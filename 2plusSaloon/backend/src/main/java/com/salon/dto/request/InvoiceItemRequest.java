package com.salon.dto.request;
import lombok.Data;
@Data
public class InvoiceItemRequest {
    private String itemType; // SERVICE or PRODUCT
    private Long itemId;
    private Integer qty = 1;
}
