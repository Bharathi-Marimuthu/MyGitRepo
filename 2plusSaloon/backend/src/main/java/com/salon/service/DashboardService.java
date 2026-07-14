package com.salon.service;
import com.salon.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
@Service @RequiredArgsConstructor
public class DashboardService {
    private final InvoiceRepository invoiceRepo;
    private final CustomerRepository customerRepo;
    private final AppointmentRepository apptRepo;
    private final EmployeeRepository empRepo;

    public Map<String,Object> getSummary() {
        Map<String,Object> m = new HashMap<>();
        m.put("totalCustomers", customerRepo.count());
        m.put("totalEmployees", empRepo.count());
        m.put("todayAppointments", 0);
        m.put("monthlyRevenue", 0);
        return m;
    }
}
