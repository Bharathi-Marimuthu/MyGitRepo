package com.salon.dto.request;
import lombok.Data;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
@Data
public class InvoiceRequest {
    @NotNull private Long customerId;
    private Long employeeId;
    @NotNull private Long branchId;
    @NotNull private List<InvoiceItemRequest> items;
    private BigDecimal discountPct = BigDecimal.ZERO;
    private String paymentMethod = "CASH";
    private Integer loyaltyRedeemed = 0;
}
