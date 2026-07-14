package com.salon.dto.request;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class AppointmentRequest {
    @NotNull private Long customerId;
    private Long employeeId;
    @NotNull private Long serviceId;
    @NotNull private Long branchId;
    @NotNull @JsonFormat(pattern = "yyyy-MM-dd") private LocalDate appointmentDate;
    @NotNull @JsonFormat(pattern = "HH:mm") private LocalTime appointmentTime;
    private String notes;
}
