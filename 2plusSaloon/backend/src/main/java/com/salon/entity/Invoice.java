package com.salon.entity;
import lombok.*;
import javax.persistence.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
@Entity @Table(name="invoices") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Invoice {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="invoice_number",nullable=false,unique=true) private String invoiceNumber;
    @Column(name="invoice_date",nullable=false) private LocalDate invoiceDate;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="customer_id",nullable=false) private Customer customer;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="employee_id") private Employee employee;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="branch_id",nullable=false) private Branch branch;
    @OneToMany(mappedBy="invoice",cascade=CascadeType.ALL,orphanRemoval=true) private List<InvoiceDetail> details = new ArrayList<>();
    private BigDecimal subtotal, discountPct = BigDecimal.ZERO, discountAmount = BigDecimal.ZERO, gstAmount = BigDecimal.ZERO, totalAmount;
    @Column(name="payment_method") private String paymentMethod;
    @Column(name="payment_status") private String paymentStatus = "PAID";
    @Column(name="loyalty_redeemed") private Integer loyaltyRedeemed = 0;
    private String notes;
    @Column(name="created_at",updatable=false) private LocalDateTime createdAt = LocalDateTime.now();
}
