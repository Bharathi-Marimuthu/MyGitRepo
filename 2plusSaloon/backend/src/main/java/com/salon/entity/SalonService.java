package com.salon.entity;
import lombok.*;
import javax.persistence.*;
import java.math.BigDecimal;
@Entity @Table(name = "services")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SalonService {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "service_code", unique = true, nullable = false, length = 20)
    private String serviceCode;
    @Column(name = "service_name", nullable = false, length = 150)
    private String serviceName;
    @Column(length = 100)
    private String category;
    @Column(name = "duration_mins")
    private Integer durationMins;
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    @Column(name = "gst_percentage", precision = 5, scale = 2)
    private BigDecimal gstPercentage = new BigDecimal("18");
    private boolean status = true;
}
