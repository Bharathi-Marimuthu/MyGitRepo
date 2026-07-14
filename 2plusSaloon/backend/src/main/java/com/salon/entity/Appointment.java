package com.salon.entity;
import lombok.*;
import javax.persistence.*;
import java.time.*;
@Entity @Table(name="appointments") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Appointment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="appointment_no",nullable=false,unique=true) private String appointmentNo;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="customer_id",nullable=false) private Customer customer;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="employee_id") private Employee employee;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="service_id",nullable=false) private Service service;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="branch_id",nullable=false) private Branch branchId;
    @Column(name="appointment_date",nullable=false) private LocalDate appointmentDate;
    @Column(name="appointment_time",nullable=false) private LocalTime appointmentTime;
    private String status = "BOOKED", notes;
    @Column(name="created_at",updatable=false) private LocalDateTime createdAt = LocalDateTime.now();
}
