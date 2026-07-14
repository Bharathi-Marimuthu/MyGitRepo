package com.salon.dto.response;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AppointmentResponse {
    private Long id;
    private String appointmentNo;
    private Long customerId;
    private String customerName;
    private String customerMobile;
    private Long employeeId;
    private String employeeName;
    private Long serviceId;
    private String serviceName;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String status;
    private String notes;
}
