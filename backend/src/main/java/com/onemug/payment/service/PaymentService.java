package com.onemug.payment.service;

import com.onemug.payment.dto.PaymentConfirmRequestDto;
import com.onemug.payment.dto.PaymentConfirmResponseDto;
import com.onemug.payment.dto.TossPaymentResponseDto;
import com.onemug.payment.repository.PaymentRepository;
import com.onemug.global.entity.Payment;
import com.onemug.global.entity.Membership;
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
    
    @Value("${toss.payments.mock-enabled:false}")
    private boolean mockEnabled;
    
    @Value("${app.development-mode:false}")
    private boolean developmentMode;
    
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
            log.debug("savePayment 메서드 호출 직전: orderId={}, paymentKey={}, membershipId={}", 
                    request.getOrderId(), request.getPaymentKey(), request.getMembershipId());
            Payment payment = null;
            try {
                payment = savePayment(tossResponse, request);
                log.debug("savePayment 메서드 호출 성공: savedPayment={}", payment != null ? payment.getId() : "null");
            } catch (Exception ex) {
                log.error("savePayment 메서드 호출 중 예외 발생: ", ex);
                return PaymentConfirmResponseDto.builder()
                        .status("ERROR")
                        .message("결제 정보 저장 중 오류가 발생했습니다: " + ex.getMessage())
                        .build();
            }
            
            // 5. 결제 성공 시 구독 상태 업데이트 (PENDING -> ACTIVE)
            Long subscriptionId = null;
            boolean subscriptionUpdated = false;
            if ("DONE".equals(tossResponse.getStatus())) {
                log.info("결제 완료 상태(DONE)를 확인함, 활성 구독 생성 시도: orderId={}", request.getOrderId());
                
                // 기존 업데이트 방식 대신 바로 ACTIVE 구독 생성
                if (request.getUserId() != null && request.getMembershipId() != null) {
                    // 새로운 활성 구독 생성
                    subscriptionId = membershipService.createActiveSubscription(
                            request.getMembershipId(), 
                            request.getUserId(), 
                            request.getOrderId());
                            
                    if (subscriptionId != null) {
                        subscriptionUpdated = true;
                        log.info("활성 구독 생성 완료: subscriptionId={}, orderId={}", subscriptionId, request.getOrderId());
                    } else {
                        log.warn("활성 구독 생성 실패: userId={}, membershipId={}", request.getUserId(), request.getMembershipId());
                    }
                } else {
                    log.warn("활성 구독 생성에 필요한 정보 부족: userId={}, membershipId={}", 
                             request.getUserId(), request.getMembershipId());
                }
            } else {
                log.warn("결제 상태가 DONE이 아님: {}, 구독 생성을 건너뜀", tossResponse.getStatus());
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
            // 개발 모드나 모의 응답이 활성화된 경우 모의 응답 반환
            if (developmentMode || mockEnabled) {
                log.info("🛠️ 개발 모드: 모의 토스페이먼츠 응답 생성 (orderId={})", request.getOrderId());
                return createMockTossResponse(request);
            }
            
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
     * 개발 환경용 모의 토스페이먼츠 응답 생성
     */
    private TossPaymentResponseDto createMockTossResponse(PaymentConfirmRequestDto request) {
        TossPaymentResponseDto mockResponse = new TossPaymentResponseDto();
        mockResponse.setMId("tosspayments"); // 가맹점 ID
        mockResponse.setVersion("2022-11-16"); // API 버전
        mockResponse.setPaymentKey(request.getPaymentKey());
        mockResponse.setOrderId(request.getOrderId());
        mockResponse.setOrderName("OneMug 멤버십 구독"); // 주문명
        mockResponse.setCurrency("KRW"); // 통화
        mockResponse.setMethod("카드"); // 결제 수단
        mockResponse.setTotalAmount(request.getAmount()); // 총 결제 금액
        mockResponse.setBalanceAmount(request.getAmount()); // 취소 가능 금액
        mockResponse.setStatus("DONE"); // 결제 완료 상태
        mockResponse.setRequestedAt(java.time.OffsetDateTime.now().toString());
        mockResponse.setApprovedAt(java.time.OffsetDateTime.now().toString());
        mockResponse.setUseEscrow(false);
        mockResponse.setLastTransactionKey("mock_last_transaction_" + System.currentTimeMillis());
        mockResponse.setSuppliedAmount(request.getAmount());
        mockResponse.setVat(Math.round(request.getAmount() / 11.0)); // 부가세 (10%)
        mockResponse.setCultureExpense(false);
        mockResponse.setTaxFreeAmount(0L); // 비과세 금액
        mockResponse.setTaxExemptionAmount(0); // Integer 타입으로 설정
        mockResponse.setCountry("KR"); // 국가 코드
        
        log.info("🛠️ 모의 토스페이먼츠 응답 생성 완료: orderId={}, amount={}, status={}", 
                request.getOrderId(), request.getAmount(), mockResponse.getStatus());
        
        return mockResponse;
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
        Payment payment = null;
        try {
            log.info("결제 정보 저장 시작: orderId={}, membershipId={}, userId={}", 
                tossResponse.getOrderId(), request.getMembershipId(), request.getUserId());
            
            // membershipId로 Membership 엔티티 조회
            Membership membership = null;
            if (request.getMembershipId() != null) {
                try {
                    membership = membershipService.getMembership(request.getMembershipId())
                        .orElse(null);
                    
                    // 멤버십 엔티티 정보 안전하게 로깅
                    if (membership != null) {
                        log.debug("멤버십 조회 성공: membershipId={}, isTemplate={}, status={}",
                            membership.getId(), membership.getIsTemplate(), membership.getStatus());
                        
                        // 템플릿인 경우 경고 로깅
                        if (Boolean.TRUE.equals(membership.getIsTemplate())) {
                            log.warn("결제 정보에 템플릿 멤버십이 연결됨. 실제 구독 멤버십이어야 합니다.");
                        }
                    } else {
                        log.error("결제 정보 저장 실패: 멤버십을 찾을 수 없음, membershipId={}", request.getMembershipId());
                        // 멤버십이 null이어도 계속 진행 (nullable=true 설정됨)
                    }
                } catch (Exception e) {
                    log.error("멤버십 조회 중 예외 발생: membershipId={}, 예외={}", 
                        request.getMembershipId(), e.getMessage(), e);
                    // 계속 진행 - null membership으로 저장
                }
            } else {
                log.error("결제 정보 저장 실패: membershipId가 null입니다");
                // 계속 진행
            }
            
            log.debug("Payment 객체 생성 전: paymentKey={}, orderId={}, method={}, status={}", 
                tossResponse.getPaymentKey(), tossResponse.getOrderId(), 
                tossResponse.getMethod(), tossResponse.getStatus());
            
            try {
                payment = Payment.builder()
                        .paymentKey(tossResponse.getPaymentKey())
                        .orderId(tossResponse.getOrderId())
                        .orderName(tossResponse.getOrderName())
                        .amount(tossResponse.getTotalAmount())
                        .userId(request.getUserId())
                        .membership(membership) // membership 설정
                        .status(convertToPaymentStatus(tossResponse.getStatus()))
                        .method(convertToPaymentMethod(tossResponse.getMethod()))
                        .approvedAt(tossResponse.getApprovedAt())
                        .requestedAt(tossResponse.getRequestedAt())
                        .receipt(tossResponse.getReceipt() != null ? tossResponse.getReceipt().getUrl() : null)
                        .build();
            } catch (Exception e) {
                log.error("Payment 객체 생성 중 예외 발생: 예외 클래스={}, 메시지={}", 
                    e.getClass().getName(), e.getMessage(), e);
                throw e;
            }
            
            // toString() 호출 대신 객체 정보를 안전하게 로깅
            log.debug("Payment 객체 생성 완료, 저장 시도. paymentKey={}, orderId={}, amount={}, membership={}",
                payment.getPaymentKey(), payment.getOrderId(), payment.getAmount(),
                payment.getMembership() != null ? payment.getMembership().getId() : "null");
            
            return savePaymentToDatabase(payment);
        } catch (Exception e) {
            log.error("결제 정보 저장 중 예외 발생: orderId={}, 예외 클래스={}, 메시지={}", 
                      tossResponse.getOrderId(), e.getClass().getName(), e.getMessage(), e);
            
            // 예외가 발생했지만 그래도 저장 시도 - null이 아닌 경우에만
            if (payment != null) {
                try {
                    log.info("예외 발생 후 다시 저장 시도");
                    return savePaymentToDatabase(payment);
                } catch (Exception e2) {
                    log.error("두 번째 저장 시도 중 예외 발생: ", e2);
                }
            }
            
            throw new RuntimeException("결제 정보 저장 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }
    
    /**
     * 토스페이먼츠 결제 상태를 내부 PaymentStatus enum으로 안전하게 변환
     */
    private Payment.PaymentStatus convertToPaymentStatus(String tossStatus) {
        if (tossStatus == null) {
            log.warn("결제 상태가 null입니다. 기본값으로 READY 사용");
            return Payment.PaymentStatus.READY;
        }
        
        try {
            // 대소문자 구분없이 enum 값 찾기
            return Payment.PaymentStatus.valueOf(tossStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            // 토스페이먼츠와 내부 상태 매핑
            switch(tossStatus.toUpperCase()) {
                case "USED":
                case "PAID":
                    return Payment.PaymentStatus.DONE;
                case "CANCELED":
                    return Payment.PaymentStatus.CANCELED;
                case "PARTIAL_CANCELED":
                    return Payment.PaymentStatus.PARTIAL_CANCELED;
                case "EXPIRED":
                    return Payment.PaymentStatus.EXPIRED;
                case "WAITING_FOR_DEPOSIT":
                    return Payment.PaymentStatus.WAITING_FOR_DEPOSIT;
                default:
                    log.warn("알 수 없는 결제 상태: {}, 기본값으로 READY 사용", tossStatus);
                    return Payment.PaymentStatus.READY;
            }
        }
    }
    
    /**
     * 토스페이먼츠 결제 방법을 내부 PaymentMethod enum으로 안전하게 변환
     */
    private Payment.PaymentMethod convertToPaymentMethod(String tossMethod) {
        if (tossMethod == null) {
            log.warn("결제 방법이 null입니다. 기본값으로 CARD 사용");
            return Payment.PaymentMethod.CARD;
        }
        
        try {
            // 대소문자 구분없이 enum 값 찾기
            return Payment.PaymentMethod.valueOf(tossMethod.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.warn("알 수 없는 결제 방법: {}, 기본값으로 CARD 사용", tossMethod);
            return Payment.PaymentMethod.CARD;
        }
    }
    
    /**
     * 결제 정보를 데이터베이스에 저장하는 메서드 (별도 트랜잭션으로 분리)
     */
    @Transactional
    public Payment savePaymentToDatabase(Payment payment) {
        try {
            log.debug("Payment 저장 시작: paymentKey={}, orderId={}", 
                payment.getPaymentKey(), payment.getOrderId());
                
            Payment savedPayment = paymentRepository.save(payment);
            
            log.info("결제 정보 저장 성공: paymentId={}, orderId={}, status={}", 
                savedPayment.getId(), savedPayment.getOrderId(), savedPayment.getStatus());
                
            return savedPayment;
        } catch (Exception e) {
            log.error("Payment 저장 중 데이터베이스 예외: 예외 클래스={}, 메시지={}", 
                e.getClass().getName(), e.getMessage(), e);
            throw e;
        }
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
