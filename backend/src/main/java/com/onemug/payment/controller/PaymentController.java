package com.onemug.payment.controller;

import com.onemug.payment.dto.PaymentConfirmRequestDto;
import com.onemug.payment.dto.PaymentConfirmResponseDto;
import com.onemug.global.entity.Payment;
import com.onemug.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    
    private final PaymentService paymentService;
    
    /**
     * 결제 확인 API
     * 프론트엔드에서 토스페이먼츠 결제 성공 후 호출
     */
    @PostMapping("/confirm")
    public ResponseEntity<PaymentConfirmResponseDto> confirmPayment(
            @RequestBody PaymentConfirmRequestDto request,
            @RequestHeader("User-Id") Long userId) {
        try {
            log.info("결제 확인 요청: userId={}, orderId={}, paymentKey={}", 
                    userId, request.getOrderId(), request.getPaymentKey());
            
            // 요청에 사용자 ID 설정
            request.setUserId(userId);
            
            // 결제 확인 처리
            PaymentConfirmResponseDto response = paymentService.confirmPayment(request);
            
            if ("SUCCESS".equals(response.getStatus())) {
                log.info("결제 확인 성공: userId={}, orderId={}, subscriptionId={}", 
                        userId, request.getOrderId(), response.getSubscriptionId());
                return ResponseEntity.ok(response);
            } else {
                log.warn("결제 확인 실패: userId={}, orderId={}, message={}", 
                        userId, request.getOrderId(), response.getMessage());
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            log.error("결제 확인 API 처리 중 오류 발생: userId={}, orderId={}", 
                    userId, request.getOrderId(), e);
            
            PaymentConfirmResponseDto errorResponse = PaymentConfirmResponseDto.builder()
                    .status("ERROR")
                    .message("결제 처리 중 서버 오류가 발생했습니다: " + e.getMessage())
                    .build();
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * 결제 정보 조회 API
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<Payment> getPayment(@PathVariable String orderId) {
        try {
            Optional<Payment> payment = paymentService.getPaymentByOrderId(orderId);
            
            if (payment.isPresent()) {
                return ResponseEntity.ok(payment.get());
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            log.error("결제 정보 조회 중 오류 발생: orderId={}", orderId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 사용자 결제 내역 조회 API
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getUserPayments(@PathVariable Long userId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByUserId(userId);
            return ResponseEntity.ok(payments);
            
        } catch (Exception e) {
            log.error("사용자 결제 내역 조회 중 오류 발생: userId={}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 내 결제 내역 조회 API (헤더의 User-Id 사용)
     */
    @GetMapping("/my-payments")
    public ResponseEntity<List<Payment>> getMyPayments(@RequestHeader("User-Id") Long userId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByUserId(userId);
            return ResponseEntity.ok(payments);
            
        } catch (Exception e) {
            log.error("내 결제 내역 조회 중 오류 발생: userId={}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
