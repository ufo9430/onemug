package com.onemug.membership.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MembershipSelectionRequestDto {
    private Long membershipId;
    private Long userId;
    private Boolean autoRenew;
    private String paymentMethod; // "CARD", "BANK_TRANSFER"
}
