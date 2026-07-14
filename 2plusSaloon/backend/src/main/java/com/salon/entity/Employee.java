package com.salon.entity;
import lombok.*;
import javax.persistence.*;
import java.math.BigDecimal;
import java.time.*;
@Entity @Table(name="employees") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Employee {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="employee_code",nullable=false,unique=true) private String employeeCode;
    @Column(name="full_name",nullable=false) private String fullName;
    private String mobile, email, gender, designation;
    @Column(name="date_of_birth") private LocalDate dateOfBirth;
    @Column(name="date_of_joining",nullable=false) private LocalDate dateOfJoining;
    @Column(name="basic_salary") private BigDecimal basicSalary;
    @Column(name="commission_percentage") private BigDecimal commissionPercentage = BigDecimal.ZERO;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="branch_id") private Branch branch;
    private Boolean status = true;
    @Column(name="created_at",updatable=false) private LocalDateTime createdAt = LocalDateTime.now();
}
