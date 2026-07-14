package com.salon.dto.response;
import lombok.*;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BranchResponse {
    private Long id;
    private String branchCode;
    private String branchName;
    private String address;
    private String city;
    private String state;
    private String country;
    private String email;
    private String phone;
    private String gstNumber;
    private boolean status;
}
