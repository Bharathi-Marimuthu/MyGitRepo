package com.salon.dto.response;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CustomerResponse {
    private Long id;
    private String customerCode;
    private String fullName;
    private String mobile;
    private String email;
    private String gender;
    private String membershipType;
    private Integer loyaltyPoints;
    private LocalDateTime createdAt;
}
