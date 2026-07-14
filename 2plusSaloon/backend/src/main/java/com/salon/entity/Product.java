package com.salon.entity;
import lombok.*;
import javax.persistence.*;
import java.math.BigDecimal;
@Entity @Table(name="products") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="product_code",nullable=false,unique=true) private String productCode;
    @Column(name="product_name",nullable=false) private String productName;
    private String brand;
    @Column(name="purchase_price") private BigDecimal purchasePrice;
    @Column(name="selling_price",nullable=false) private BigDecimal sellingPrice;
    private Integer quantity = 0;
    @Column(name="reorder_level") private Integer reorderLevel = 5;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="branch_id") private Branch branch;
    private Boolean status = true;
}
