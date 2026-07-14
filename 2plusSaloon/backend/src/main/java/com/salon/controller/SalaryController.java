package com.salon.controller;
import com.salon.dto.response.ApiResponse;
import com.salon.entity.Salary;
import com.salon.service.SalaryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/salary") @RequiredArgsConstructor @Tag(name="Salary")
public class SalaryController {
    private final SalaryService service;
    @GetMapping public ResponseEntity<ApiResponse<Page<Salary>>> list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size){ return ResponseEntity.ok(ApiResponse.ok(service.findAll(page,size))); }
    @PostMapping public ResponseEntity<ApiResponse<Salary>> create(@RequestBody Salary s){ return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(service.save(s))); }
}
