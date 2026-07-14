package com.salon.dto.request;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class EmployeeRequest {
    @NotBlank private String fullName;
    @NotBlank private String mobile;
    private String email;
    private String gender;
    @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate dateOfBirth;
    @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate dateOfJoining;
    private String designation;
    private BigDecimal basicSalary;
    private BigDecimal commissionPercentage;
    private Long branchId;
}
