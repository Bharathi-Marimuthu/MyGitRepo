package com.salon.dto.response;
import lombok.*;
import java.math.BigDecimal;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ServiceResponse {
    private Long id;
    private String serviceCode;
    private String serviceName;
    private String category;
    private Integer durationMins;
    private BigDecimal price;
    private BigDecimal gstPercentage;
    private boolean status;
}
