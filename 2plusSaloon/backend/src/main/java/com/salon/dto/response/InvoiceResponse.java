package com.salon.dto.response;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InvoiceResponse {
    private Long id;
    private String invoiceNumber;
    private LocalDate invoiceDate;
    private Long customerId;
    private String customerName;
    private String customerMobile;
    private String employeeName;
    private String branchName;
    private List<InvoiceDetailResponse> details;
    private BigDecimal subtotal;
    private BigDecimal discountPct;
    private BigDecimal discountAmount;
    private BigDecimal gstAmount;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String paymentStatus;
    private Integer loyaltyRedeemed;
}
