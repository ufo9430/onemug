package com.onemug.payment.service;

import com.onemug.payment.dto.PaymentConfirmRequestDto;
import com.onemug.payment.dto.PaymentConfirmResponseDto;
import com.onemug.payment.dto.TossPaymentResponseDto;
import com.onemug.global.entity.Payment;
import com.onemug.payment.repository.PaymentRepository;
import com.onemug.membership.service.MembershipService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private MembershipService membershipService;
    
    @Value("${toss.payments.secret-key}")
    private String tossSecretKey;
    
    @Value("${toss.payments.api-url:https://api.tosspayments.com}")
    private String tossApiUrl;
    
    /**
     * 결제 확인 및 검증
     */
    @Transactional
    public PaymentConfirmResponseDto confirmPayment(PaymentConfirmRequestDto request) {
        try {
            log.info("결제 확인 요청: orderId={}, paymentKey={}, amount={}", 
                    request.getOrderId(), request.getPaymentKey(), request.getAmount());
            
            // 1. 기존 결제 정보 확인
            Optional<Payment> existingPayment = paymentRepository.findByOrderId(request.getOrderId());
            if (existingPayment.isPresent() && existingPayment.get().getStatus() == Payment.PaymentStatus.DONE) {
                log.warn("이미 처리된 결제입니다: orderId={}", request.getOrderId());
                return PaymentConfirmResponseDto.builder()
                        .status("ERROR")
                        .message("이미 처리된 결제입니다.")
                        .build();
            }
            
            // 2. 토스페이먼츠 API로 결제 확인
            TossPaymentResponseDto tossResponse = confirmPaymentWithToss(request);
            
            // 3. 결제 검증
            if (!validatePayment(tossResponse, request)) {
                log.error("결제 검증 실패: orderId={}", request.getOrderId());
                return PaymentConfirmResponseDto.builder()
                        .status("ERROR")
                        .message("결제 검증에 실패했습니다.")
                        .build();
            }
            
            // 4. 결제 정보 저장
            Payment payment = savePayment(tossResponse, request);
            
            // 5. 결제 성공 시 구독 상태 업데이트 (PENDING -> ACTIVE)
            Long subscriptionId = null;
            boolean subscriptionUpdated = false;
            if ("DONE".equals(tossResponse.getStatus())) {
                log.info("결제 완료 상태(DONE)를 확인함, 구독 상태 업데이트 시도: orderId={}", request.getOrderId());
                
                // 5.1. 주문 ID로 구독 업데이트 시도
                subscriptionUpdated = membershipService.updateSubscriptionAfterPayment(request.getOrderId());
                log.info("주문 ID로 구독 상태 업데이트 결과: {}, orderId={}", subscriptionUpdated ? "성공" : "실패", request.getOrderId());
                
                // 5.2. 실패한 경우, 최근 PENDING 상태의 구독 찾아서 업데이트 시도 (fallback)
                if (!subscriptionUpdated && request.getUserId() != null) {
                    log.info("fallback: 사용자 ID와 상태로 최근 구독 찾기 시도: userId={}", request.getUserId());
                    subscriptionId = membershipService.updateLatestPendingSubscription(request.getUserId(), request.getOrderId());
                    if (subscriptionId != null) {
                        subscriptionUpdated = true;
                        log.info("fallback 성공: 최근 PENDING 구독 활성화 완료: subscriptionId={}, orderId={}", subscriptionId, request.getOrderId());
                    } else {
                        log.warn("fallback 실패: 활성화할 PENDING 구독을 찾을 수 없음: userId={}", request.getUserId());
                    }
                }
            } else {
                log.warn("결제 상태가 DONE이 아님: {}, 구독 상태 업데이트를 건너뜀", tossResponse.getStatus());
            }
            
            log.info("결제 확인 완료: orderId={}, paymentKey={}, 구독업데이트={}", 
                    request.getOrderId(), request.getPaymentKey(), subscriptionUpdated ? "성공" : "실패");
            
            return PaymentConfirmResponseDto.builder()
                    .status("SUCCESS")
                    .message(subscriptionUpdated ? "결제 및 멤버십 활성화가 완료되었습니다." : "결제는 성공했지만 멤버십 활성화에 실패했습니다.")
                    .paymentKey(tossResponse.getPaymentKey())
                    .orderId(tossResponse.getOrderId())
                    .amount(tossResponse.getTotalAmount())
                    .paymentStatus(tossResponse.getStatus())
                    .approvedAt(tossResponse.getApprovedAt())
                    .method(tossResponse.getMethod())
                    .receipt(tossResponse.getReceipt() != null ? tossResponse.getReceipt().getUrl() : null)
                    .subscriptionId(subscriptionId) // 구독 ID 추가
                    .subscriptionUpdated(subscriptionUpdated) // 구독 업데이트 성공 여부
                    .build();
                    
        } catch (Exception e) {
            log.error("결제 확인 중 오류 발생: orderId={}", request.getOrderId(), e);
            return PaymentConfirmResponseDto.builder()
                    .status("ERROR")
                    .message("결제 처리 중 오류가 발생했습니다: " + e.getMessage())
                    .build();
        }
    }
    
    /**
     * 토스페이먼츠 API 호출하여 결제 확인
     */
    private TossPaymentResponseDto confirmPaymentWithToss(PaymentConfirmRequestDto request) {
        try {
            // 토스페이먼츠 API 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Basic " + Base64.getEncoder()
                    .encodeToString((tossSecretKey + ":").getBytes(StandardCharsets.UTF_8)));
            
            // 요청 바디 설정
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("orderId", request.getOrderId());
            requestBody.put("amount", request.getAmount());
            requestBody.put("paymentKey", request.getPaymentKey());
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            // 토스페이먼츠 API 호출
            String url = tossApiUrl + "/v1/payments/confirm";
            ResponseEntity<TossPaymentResponseDto> response = restTemplate.postForEntity(
                    url, entity, TossPaymentResponseDto.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                log.info("토스페이먼츠 결제 확인 성공: orderId={}, status={}", 
                        request.getOrderId(), response.getBody().getStatus());
                return response.getBody();
            } else {
                throw new RuntimeException("토스페이먼츠 결제 확인 실패: " + response.getStatusCode());
            }
            
        } catch (Exception e) {
            log.error("토스페이먼츠 API 호출 중 오류 발생: orderId={}", request.getOrderId(), e);
            throw new RuntimeException("토스페이먼츠 결제 확인 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 결제 검증
     */
    private boolean validatePayment(TossPaymentResponseDto tossResponse, PaymentConfirmRequestDto request) {
        // 1. 결제 상태 확인
        if (!"DONE".equals(tossResponse.getStatus())) {
            log.error("결제 상태가 완료가 아닙니다: status={}", tossResponse.getStatus());
            return false;
        }
        
        // 2. 주문 ID 확인
        if (!request.getOrderId().equals(tossResponse.getOrderId())) {
            log.error("주문 ID가 일치하지 않습니다: expected={}, actual={}", 
                    request.getOrderId(), tossResponse.getOrderId());
            return false;
        }
        
        // 3. 결제 금액 확인
        if (!request.getAmount().equals(tossResponse.getTotalAmount())) {
            log.error("결제 금액이 일치하지 않습니다: expected={}, actual={}", 
                    request.getAmount(), tossResponse.getTotalAmount());
            return false;
        }
        
        // 4. 결제 키 확인
        if (!request.getPaymentKey().equals(tossResponse.getPaymentKey())) {
            log.error("결제 키가 일치하지 않습니다: expected={}, actual={}", 
                    request.getPaymentKey(), tossResponse.getPaymentKey());
            return false;
        }
        
        return true;
    }
    
    /**
     * 결제 정보 저장
     */
    private Payment savePayment(TossPaymentResponseDto tossResponse, PaymentConfirmRequestDto request) {
        Payment payment = Payment.builder()
                .paymentKey(tossResponse.getPaymentKey())
                .orderId(tossResponse.getOrderId())
                .orderName(tossResponse.getOrderName())
                .amount(tossResponse.getTotalAmount())
                .userId(request.getUserId())
                .status(Payment.PaymentStatus.valueOf(tossResponse.getStatus()))
                .method(Payment.PaymentMethod.valueOf(tossResponse.getMethod()))
                .approvedAt(tossResponse.getApprovedAt())
                .requestedAt(tossResponse.getRequestedAt())
                .receipt(tossResponse.getReceipt() != null ? tossResponse.getReceipt().getUrl() : null)
                .build();
        
        return paymentRepository.save(payment);
    }
    
    /**
     * 결제 정보 조회
     */
    public Optional<Payment> getPaymentByOrderId(String orderId) {
        return paymentRepository.findByOrderId(orderId);
    }
    
    /**
     * 사용자 결제 내역 조회
     */
    public java.util.List<Payment> getPaymentsByUserId(Long userId) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
