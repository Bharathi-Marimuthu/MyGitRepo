package com.salon.entity;
import lombok.*;
import javax.persistence.*;
import java.math.BigDecimal;
@Entity @Table(name="invoice_details") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class InvoiceDetail {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="invoice_id",nullable=false) private Invoice invoice;
    @Column(name="item_type",nullable=false) private String itemType;
    @Column(name="item_id",nullable=false) private Long itemId;
    @Column(name="item_name") private String itemName;
    private Integer qty = 1;
    @Column(name="unit_price") private BigDecimal unitPrice;
    @Column(name="gst_pct") private BigDecimal gstPct = BigDecimal.ZERO;
    @Column(name="line_total") private BigDecimal lineTotal;
}
