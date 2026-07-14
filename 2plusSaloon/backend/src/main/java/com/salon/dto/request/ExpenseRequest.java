package com.salon.dto.request;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class ExpenseRequest {
    private Long branchId;
    @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate expenseDate;
    private String category;
    private BigDecimal amount;
    private String description;
}
