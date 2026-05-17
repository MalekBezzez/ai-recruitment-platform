package com.example.employeemodule.feign;

import com.example.employeemodule.config.FeignAuthConfig;
import com.example.employeemodule.dto.LeaveTypeWithSoldDTO;
import com.example.employeemodule.entity.LeaveSold;
import com.example.employeemodule.entity.LeaveType;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "Leave-Module" ,
        configuration = FeignAuthConfig.class)
public interface LeaveSoldClient {


    @GetMapping("/leave-types"
           )
    List<LeaveTypeWithSoldDTO> getAllLeaveTypes();
}

