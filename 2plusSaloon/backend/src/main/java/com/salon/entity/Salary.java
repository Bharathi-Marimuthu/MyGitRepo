package com.salon.entity;
import lombok.*;
import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Entity @Table(name="salary") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Salary {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="employee_id",nullable=false) private Employee employee;
    @Column(name="salary_month",nullable=false) private String salaryMonth;
    @Column(name="basic_salary") private BigDecimal basicSalary;
    private BigDecimal incentive = BigDecimal.ZERO, commission = BigDecimal.ZERO, deduction = BigDecimal.ZERO, finalSalary;
    @Column(name="payment_date") private LocalDate paymentDate;
    @Column(name="payment_status") private String paymentStatus = "PENDING";
    private String remarks;
}
