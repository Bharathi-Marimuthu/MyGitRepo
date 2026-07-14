package com.salon.controller;
import com.salon.dto.response.ApiResponse;
import com.salon.entity.Employee;
import com.salon.service.EmployeeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/employees") @RequiredArgsConstructor @Tag(name="Employees")
public class EmployeeController {
    private final EmployeeService service;
    @GetMapping  public ResponseEntity<ApiResponse<Page<Employee>>> list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size){ return ResponseEntity.ok(ApiResponse.ok(service.findAll(page,size))); }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<Employee>> get(@PathVariable Long id){ return ResponseEntity.ok(ApiResponse.ok(service.findById(id))); }
    @PostMapping public ResponseEntity<ApiResponse<Employee>> create(@RequestBody Employee e){
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Employee created",service.save(e))); }
    @PutMapping("/{id}") public ResponseEntity<ApiResponse<Employee>> update(@PathVariable Long id,@RequestBody Employee e)
    { return ResponseEntity.ok(ApiResponse.ok(service.update(id,e))); }
    @DeleteMapping("/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id)
    { service.delete(id); return ResponseEntity.ok(ApiResponse.ok("Deleted",null)); }
}
