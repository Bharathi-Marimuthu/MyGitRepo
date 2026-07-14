package com.salon.dto.response;
import lombok.*;
import java.math.BigDecimal;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardResponse {
    private long customersToday;
    private long appointmentsToday;
    private BigDecimal revenueToday;
    private BigDecimal monthlyRevenue;
    private BigDecimal monthlyExpense;
    private BigDecimal monthlyProfit;
    private long totalCustomers;
    private long totalEmployees;
    private long lowStockCount;
}
