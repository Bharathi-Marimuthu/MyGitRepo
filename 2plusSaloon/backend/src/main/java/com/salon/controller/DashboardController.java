package com.salon.controller;
import com.salon.dto.response.ApiResponse;
import com.salon.service.DashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/v1/dashboard") @RequiredArgsConstructor
@Tag(name="Dashboard")
public class DashboardController {
    private final DashboardService service;
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String,Object>>> summary() {
        return ResponseEntity.ok(ApiResponse.ok(service.getSummary()));
    }
}
