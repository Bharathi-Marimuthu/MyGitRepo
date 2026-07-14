package com.salon.service.impl;
import com.salon.dto.request.AppointmentRequest;
import com.salon.dto.response.AppointmentResponse;
import com.salon.entity.*;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service @RequiredArgsConstructor @Transactional
public class AppointmentServiceImpl {
    private final AppointmentRepository repo;
    private final CustomerRepository customerRepo;
    private final EmployeeRepository employeeRepo;
    private final SalonServiceRepository serviceRepo;
    private final BranchRepository branchRepo;

    public AppointmentResponse create(AppointmentRequest req) {
        Customer customer = customerRepo.findById(req.getCustomerId()).orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        Employee employee = req.getEmployeeId() != null ? employeeRepo.findById(req.getEmployeeId()).orElse(null) : null;
        SalonService svc = serviceRepo.findById(req.getServiceId()).orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        Branch branch = branchRepo.findById(req.getBranchId()).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        String no = "APT" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + String.format("%04d", repo.count() + 1);
        Appointment a = Appointment.builder().appointmentNo(no).customer(customer).employee(employee)
            .branchId(branch).appointmentDate(req.getAppointmentDate())
            .appointmentTime(req.getAppointmentTime()).notes(req.getNotes()).build();
        return toResponse(repo.save(a));
    }

    public AppointmentResponse updateStatus(Long id, String status) {
        Appointment a = repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        a.setStatus(status);
        return toResponse(repo.save(a));
    }

//    public Page<AppointmentResponse> list(Long branchId, int page, int size) {
//        return repo.findByBranchIdOrderByAppointmentDateDescAppointmentTimeDesc(branchId, PageRequest.of(page, size)).map(this::toResponse);
//    }

//    public List<AppointmentResponse> listByDate(Long branchId, LocalDate date) {
//        return repo.findByAppointmentDateAndBranchId(date, branchId).stream().map(this::toResponse).collect(Collectors.toList());
//    }

    private AppointmentResponse toResponse(Appointment a) {
        return AppointmentResponse.builder().id(a.getId()).appointmentNo(a.getAppointmentNo())
            .customerId(a.getCustomer().getId()).customerName(a.getCustomer().getFullName())
            .customerMobile(a.getCustomer().getMobile())
            .employeeId(a.getEmployee() != null ? a.getEmployee().getId() : null)
            .employeeName(a.getEmployee() != null ? a.getEmployee().getFullName() : null)
            .serviceId(a.getService().getId()).serviceName(a.getService().getServiceName())
            .appointmentDate(a.getAppointmentDate()).appointmentTime(a.getAppointmentTime())
            .status(a.getStatus()).notes(a.getNotes()).build();
    }
}
