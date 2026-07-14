package com.salon.entity;
import lombok.*;
import javax.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="branches") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Branch {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="branch_code",nullable=false,unique=true) private String branchCode;
    @Column(name="branch_name",nullable=false) private String branchName;
    private String address, city, state, country, email, phone;
    @Column(name="gst_number") private String gstNumber;
    private Boolean status = true;
    @Column(name="created_at",updatable=false) private LocalDateTime createdAt = LocalDateTime.now();
}
