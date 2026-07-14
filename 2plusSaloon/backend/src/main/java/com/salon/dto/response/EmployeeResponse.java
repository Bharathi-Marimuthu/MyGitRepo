package com.salon.dto.response;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EmployeeResponse {
    private Long id;
    private String employeeCode;
    private String fullName;
    private String mobile;
    private String email;
    private String gender;
    private String designation;
    private BigDecimal basicSalary;
    private BigDecimal commissionPercentage;
    private Long branchId;
    private String branchName;
    private boolean status;
    private LocalDate dateOfJoining;
}
