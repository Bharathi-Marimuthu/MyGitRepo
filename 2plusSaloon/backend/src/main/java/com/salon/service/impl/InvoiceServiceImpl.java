package com.salon.service.impl;
import com.salon.dto.request.*;
import com.salon.dto.response.*;
import com.salon.entity.*;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor @Transactional
public class InvoiceServiceImpl {
    private final InvoiceRepository invoiceRepo;
    private final CustomerRepository customerRepo;
    private final EmployeeRepository employeeRepo;
    private final BranchRepository branchRepo;
    private final SalonServiceRepository serviceRepo;
    private final ProductRepository productRepo;

    public InvoiceResponse create(InvoiceRequest req) {
        Customer customer = customerRepo.findById(req.getCustomerId()).orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        Employee employee = req.getEmployeeId() != null ? employeeRepo.findById(req.getEmployeeId()).orElse(null) : null;
        Branch branch = branchRepo.findById(req.getBranchId()).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        Invoice invoice = Invoice.builder()
            .invoiceNumber(generateNumber())
            .invoiceDate(LocalDate.now())
            .customer(customer).employee(employee).branch(branch)
            .paymentMethod(req.getPaymentMethod())
            .loyaltyRedeemed(req.getLoyaltyRedeemed())
            .discountPct(req.getDiscountPct())
            .build();

        List<InvoiceDetail> details = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalGst = BigDecimal.ZERO;

        for (InvoiceItemRequest item : req.getItems()) {
            InvoiceDetail detail = new InvoiceDetail();
            detail.setInvoice(invoice);
            detail.setItemType(item.getItemType());
            detail.setItemId(item.getItemId());
            detail.setQty(item.getQty());
            if ("SERVICE".equals(item.getItemType())) {
                SalonService svc = serviceRepo.findById(item.getItemId()).orElseThrow(() -> new ResourceNotFoundException("Service not found"));
                detail.setItemName(svc.getServiceName());
                detail.setUnitPrice(svc.getPrice());
                detail.setGstPct(svc.getGstPercentage());
            } else {
                Product p = productRepo.findById(item.getItemId()).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
                detail.setItemName(p.getProductName());
                detail.setUnitPrice(p.getSellingPrice());
                detail.setGstPct(BigDecimal.ZERO);
                p.setQuantity(p.getQuantity() - item.getQty());
                productRepo.save(p);
            }
            BigDecimal lineTotal = detail.getUnitPrice().multiply(BigDecimal.valueOf(detail.getQty()));
            detail.setLineTotal(lineTotal);
            subtotal = subtotal.add(lineTotal);
            totalGst = totalGst.add(lineTotal.multiply(detail.getGstPct().divide(BigDecimal.valueOf(100))));
            details.add(detail);
        }

        BigDecimal discountAmt = subtotal.multiply(req.getDiscountPct().divide(BigDecimal.valueOf(100)));
        BigDecimal total = subtotal.subtract(discountAmt).add(totalGst);
        if (req.getLoyaltyRedeemed() > 0) total = total.subtract(BigDecimal.valueOf(req.getLoyaltyRedeemed()));

        invoice.setDetails(details);
        invoice.setSubtotal(subtotal);
        invoice.setDiscountAmount(discountAmt);
        invoice.setGstAmount(totalGst);
        invoice.setTotalAmount(total.max(BigDecimal.ZERO));

        // Update customer loyalty
        int earned = total.divide(BigDecimal.valueOf(100), RoundingMode.DOWN).intValue();
        customer.setLoyaltyPoints(customer.getLoyaltyPoints() + earned - req.getLoyaltyRedeemed());
        customerRepo.save(customer);

        Invoice saved = invoiceRepo.save(invoice);
        return toResponse(saved);
    }

//    public Page<InvoiceResponse> list(Long branchId, int page, int size) {
//        return invoiceRepo.findByBranchIdOrderByCreatedAtDesc(branchId, PageRequest.of(page, size)).map(this::toResponse);
//    }

    public InvoiceResponse findById(Long id) {
        return toResponse(invoiceRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Invoice not found")));
    }

    private String generateNumber() {
        String prefix = "INV" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
        return prefix + String.format("%05d", invoiceRepo.count() + 1);
    }

    private InvoiceResponse toResponse(Invoice i) {
        List<InvoiceDetailResponse> detailRes = i.getDetails().stream().map(d ->
            InvoiceDetailResponse.builder().itemType(d.getItemType()).itemId(d.getItemId())
                .itemName(d.getItemName()).qty(d.getQty()).unitPrice(d.getUnitPrice())
                .gstPct(d.getGstPct()).lineTotal(d.getLineTotal()).build()
        ).collect(Collectors.toList());
        return InvoiceResponse.builder().id(i.getId()).invoiceNumber(i.getInvoiceNumber())
            .invoiceDate(i.getInvoiceDate()).customerId(i.getCustomer().getId())
            .customerName(i.getCustomer().getFullName()).customerMobile(i.getCustomer().getMobile())
            .employeeName(i.getEmployee() != null ? i.getEmployee().getFullName() : null)
            .branchName(i.getBranch().getBranchName())
            .details(detailRes).subtotal(i.getSubtotal()).discountPct(i.getDiscountPct())
            .discountAmount(i.getDiscountAmount()).gstAmount(i.getGstAmount())
            .totalAmount(i.getTotalAmount()).paymentMethod(i.getPaymentMethod())
            .paymentStatus(i.getPaymentStatus()).loyaltyRedeemed(i.getLoyaltyRedeemed()).build();
    }
}
