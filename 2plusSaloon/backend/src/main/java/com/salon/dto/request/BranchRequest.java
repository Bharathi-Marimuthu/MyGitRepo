package com.salon.dto.request;
import lombok.Data;
import javax.validation.constraints.NotBlank;
@Data
public class BranchRequest {
    @NotBlank private String branchCode;
    @NotBlank private String branchName;
    private String address;
    private String city;
    private String state;
    private String country;
    private String email;
    private String phone;
    private String gstNumber;
}
