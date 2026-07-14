package com.salon.dto.response;
import lombok.*;
import java.math.BigDecimal;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class InvoiceDetailResponse {
    private String itemType;
    private Long itemId;
    private String itemName;
    private Integer qty;
    private BigDecimal unitPrice;
    private BigDecimal gstPct;
    private BigDecimal lineTotal;
}
