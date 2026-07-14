package com.salon.controller;
import com.salon.dto.response.ApiResponse;
import com.salon.entity.Appointment;
import com.salon.service.AppointmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/appointments") @RequiredArgsConstructor @Tag(name="Appointments")
public class AppointmentController {
    private final AppointmentService service;
    @GetMapping  public ResponseEntity<ApiResponse<Page<Appointment>>> list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size){ return ResponseEntity.ok(ApiResponse.ok(service.findAll(page,size))); }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<Appointment>> get(@PathVariable Long id){ return ResponseEntity.ok(ApiResponse.ok(service.findById(id))); }
    @PostMapping public ResponseEntity<ApiResponse<Appointment>> create(@RequestBody Appointment a){
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Appointment created",service.save(a))); }
    @PutMapping("/{id}/status") public ResponseEntity<ApiResponse<Appointment>> status(@PathVariable Long id,@RequestParam String status){ return ResponseEntity.ok(ApiResponse.ok(service.updateStatus(id,status))); }
    @DeleteMapping("/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id){ service.delete(id); return ResponseEntity.ok(ApiResponse.ok("Deleted",null)); }
}
