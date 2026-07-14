package com.salon.dto.request;
import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
@Data
public class SalonServiceRequest {
    @NotBlank private String serviceName;
    private String category;
    private Integer durationMins;
    @NotNull private BigDecimal price;
    private BigDecimal gstPercentage = new BigDecimal("18");
}
