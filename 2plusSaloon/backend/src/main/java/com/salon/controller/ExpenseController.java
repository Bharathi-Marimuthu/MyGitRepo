package com.salon.controller;
import com.salon.dto.response.ApiResponse;
import com.salon.entity.Expense;
import com.salon.service.ExpenseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/expenses") @RequiredArgsConstructor @Tag(name="Expenses")
public class ExpenseController {
    private final ExpenseService service;
    @GetMapping public ResponseEntity<ApiResponse<Page<Expense>>> list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size){ return ResponseEntity.ok(ApiResponse.ok(service.findAll(page,size))); }
    @PostMapping public ResponseEntity<ApiResponse<Expense>> create(@RequestBody Expense e){ return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(service.save(e))); }
    @DeleteMapping("/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id){ service.delete(id); return ResponseEntity.ok(ApiResponse.ok("Deleted",null)); }
}
