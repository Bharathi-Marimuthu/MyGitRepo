package com.salon.controller;
import com.salon.dto.response.ApiResponse;
import com.salon.entity.Customer;
import com.salon.service.CustomerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/customers") @RequiredArgsConstructor @Tag(name="Customers")
public class CustomerController {
    private final CustomerService service;
    @GetMapping  public ResponseEntity<ApiResponse<Page<Customer>>> list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size){ return ResponseEntity.ok(ApiResponse.ok(service.findAll(page,size))); }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<Customer>> get(@PathVariable Long id){ return ResponseEntity.ok(ApiResponse.ok(service.findById(id))); }
    @PostMapping public ResponseEntity<ApiResponse<Customer>> create(@RequestBody Customer c){ return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Customer created",service.save(c))); }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<Customer>> update(@PathVariable Long id,@RequestBody Customer c){ return ResponseEntity.ok(ApiResponse.ok(service.update(id,c))); }
    @DeleteMapping("/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id){ service.delete(id); return ResponseEntity.ok(ApiResponse.ok("Deleted",null)); }
}
