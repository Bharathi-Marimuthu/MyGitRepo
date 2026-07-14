package com.salon.controller;
import com.salon.dto.request.InvoiceRequest;
import com.salon.dto.response.InvoiceResponse;
import com.salon.service.impl.InvoiceServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
@RestController @RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor @Tag(name = "Billing")
public class InvoiceController {
    private final InvoiceServiceImpl service;
//    @GetMapping
//    public ResponseEntity<Page<InvoiceResponse>> list(
//            @RequestParam Long branchId,
//            @RequestParam(defaultValue="0") int page,
//            @RequestParam(defaultValue="10") int size) {
//        return ResponseEntity.ok(service.list(branchId, page, size));
//    }
    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> getById(@PathVariable Long id) { return ResponseEntity.ok(service.findById(id)); }
    @PostMapping
    public ResponseEntity<InvoiceResponse> create(@Valid @RequestBody InvoiceRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }
}
