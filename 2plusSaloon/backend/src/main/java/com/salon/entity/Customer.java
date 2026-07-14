package com.salon.entity;
import lombok.*;
import javax.persistence.*;
import java.time.*;
@Entity @Table(name="customers") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Customer {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="customer_code",nullable=false,unique=true) private String customerCode;
    @Column(name="full_name",nullable=false) private String fullName;
    private String mobile, email, gender, address;
    @Column(name="date_of_birth") private LocalDate dateOfBirth;
    @Column(name="anniversary_date") private LocalDate anniversaryDate;
    @Column(name="membership_type") private String membershipType = "NONE";
    @Column(name="loyalty_points") private Integer loyaltyPoints = 0;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="branch_id") private Branch branch;
    @Column(name="created_at",updatable=false) private LocalDateTime createdAt = LocalDateTime.now();
}
