package com.example.modulepayslip.controller;

import com.example.modulepayslip.dto.PayslipDTO;
import com.example.modulepayslip.Service.PayslipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payslips")
public class PayslipController {

    @Autowired
    private PayslipService payslipService;
    @PostMapping("/generate")
    public ResponseEntity<String> generatePayslipsManually(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        if (month == null || year == null) {
            return ResponseEntity.badRequest().body("Month and year are required.");
        }
        try {
            payslipService.generatePayslipsForAllByMonthAndYear(month, year);
            return ResponseEntity.ok("Payslips generated successfully for month " + month + " and year " + year);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating payslips: " + e.getMessage());
        }
    }
    @GetMapping(params = {"month","year"})
    public ResponseEntity<List<PayslipDTO>> getPayslipsByMonthAndYear(
            @RequestParam int month,
            @RequestParam int year) {
        List<PayslipDTO> list = payslipService.getPayslipsByMonthAndYear(month, year);
        return ResponseEntity.ok(list);
    }
/*     @GetMapping
    public ResponseEntity<List<PayslipDTO>> getAllPayslips() {
        List<PayslipDTO> payslips = payslipService.getAllPayslips();
        return new ResponseEntity<>(payslips, HttpStatus.OK);
    }*/

   @GetMapping("/{id}")
    public ResponseEntity<PayslipDTO> getPayslipById(@PathVariable Long id) {
        PayslipDTO payslip = payslipService.getPayslipById(id);
        if (payslip == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(payslip, HttpStatus.OK);
    }

  /*  @PostMapping
    public ResponseEntity<PayslipDTO> createPayslip(@RequestBody PayslipDTO payslipDTO) {
        try {
            PayslipDTO createdPayslip = payslipService.create(payslipDTO);
            return new ResponseEntity<>(createdPayslip, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PayslipDTO> updatePayslip(@PathVariable Long id, @RequestBody PayslipDTO payslipDTO) {
        PayslipDTO updatedPayslip = payslipService.updatePayslip(id, payslipDTO);
        if (updatedPayslip == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updatedPayslip, HttpStatus.OK);
    }
*/
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayslip(@PathVariable Long id) {
        payslipService.deletePayslip(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}