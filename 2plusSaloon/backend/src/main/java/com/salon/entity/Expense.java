package com.salon.entity;
import lombok.*;
import javax.persistence.*;
import java.math.BigDecimal;
import java.time.*;
@Entity @Table(name="expenses") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Expense {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="branch_id",nullable=false) private Branch branch;
    @Column(name="expense_date",nullable=false) private LocalDate expenseDate;
    private String category, description;
    private BigDecimal amount;
    @Column(name="created_at",updatable=false) private LocalDateTime createdAt = LocalDateTime.now();
}
