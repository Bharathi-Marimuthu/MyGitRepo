package com.salon.service;
import com.salon.entity.Appointment;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.*;
@Service @RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository repo;
    private final CustomerRepository customerRepo;
    private final EmployeeRepository employeeRepo;
    private final ServiceRepository serviceRepo;
    private final BranchRepository branchRepo;

    public Page<Appointment> findAll(int page, int size) { return repo.findAll(PageRequest.of(page,size,Sort.by("appointmentDate").descending())); }
    public Appointment findById(Long id) { return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Appointment not found")); }
    public Appointment save(Appointment a) {
        if(a.getAppointmentNo()==null) a.setAppointmentNo("APT"+System.currentTimeMillis());
        return repo.save(a);
    }
    public Appointment updateStatus(Long id, String status) {
        Appointment a = findById(id);
        a.setStatus(status);
        return repo.save(a);
    }
    public void delete(Long id) { repo.deleteById(id); }
}
