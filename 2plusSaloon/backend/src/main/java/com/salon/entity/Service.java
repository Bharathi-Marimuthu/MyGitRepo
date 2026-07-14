package com.salon.entity;
import lombok.*;
import javax.persistence.*;
import java.math.BigDecimal;
@Entity @Table(name="services") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Service {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="service_code",nullable=false,unique=true) private String serviceCode;
    @Column(name="service_name",nullable=false) private String serviceName;
    private String category;
    @Column(name="duration_mins") private Integer durationMins;
    private BigDecimal price;
    @Column(name="gst_percentage") private BigDecimal gstPercentage = new BigDecimal("18");
    private Boolean status = true;
}
