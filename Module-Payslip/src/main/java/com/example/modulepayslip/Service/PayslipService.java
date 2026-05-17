package com.example.modulepayslip.Service;

import com.example.modulepayslip.dto.EmployeCreateDTO;
import com.example.modulepayslip.dto.EmployeDTO;
import com.example.modulepayslip.dto.ImputationDTO;
import com.example.modulepayslip.dto.PayslipDTO;

import com.example.modulepayslip.entity.Employe;
import com.example.modulepayslip.entity.Payslip;

import com.example.modulepayslip.Repository.PayslipRepository;
import com.example.modulepayslip.enums.Worktime;
import com.example.modulepayslip.feign.EmployeFeignClient;
import com.example.modulepayslip.feign.ImputationFeignClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.time.DayOfWeek;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PayslipService {

    private static final Logger log = LoggerFactory.getLogger(PayslipService.class);
    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Africa/Tunis"); // Adjust to your timezone
    private static final int WORKING_DAYS_PER_MONTH = 22;

    @Autowired
    private PayslipRepository payslipRepository;

    @Autowired
    private EmployeFeignClient employeFeignClient;


    @Autowired
    private ImputationFeignClient imputationFeignClient;


    @Value("${salaire.cnss.rate}")
    private double cnssRate;

    @Value("${salaire.deduction.forfaitaire.max}")
    private double deductionForfaitaireMax;

    @Value("${salaire.deduction.forfaitaire.percent}")
    private double deductionForfaitairePercent;

    /**
     * Generates payslips for all eligible employees for a specific month and year.
     * @param month The month (1-12) for which to generate payslips.
     * @param year The year for which to generate payslips.
     * @throws IllegalArgumentException if month or year is invalid.
     */
    @Transactional
    public void generatePayslipsForAllByMonthAndYear(int month, int year) {
        // Validate input
        LocalDate monthStart = LocalDate.of(year, month, 1);
        LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());
        LocalDate today = LocalDate.now();

        if (month < 1 || month > 12 || year < 1900 || monthEnd.isAfter(today)) {
            log.error("Invalid month ({}) or year ({}), or future date", month, year);
            throw new IllegalArgumentException("Invalid month or year, or future date.");
        }

        List<Employe> employees = employeFeignClient.getAllEmployes();


        for (Employe employe : employees) {
            if (employe.getHireDate() == null || employe.getSalary() <= 0.0) {
                log.warn("Skip employee {}: no hire date or zero salary", employe.getId());
                continue;
            }

            // Check if employee was hired before or during the specified month
            LocalDate hireDate = employe.getHireDate().toInstant().atZone(BUSINESS_ZONE).toLocalDate();
            if (hireDate.isAfter(monthEnd)) {
                log.info("Skip employee {}: hired after {}/{}", employe.getId(), month, year);
                continue;
            }

            // Check for existing payslip to avoid duplicates
            Optional<Payslip> existingPayslip = payslipRepository.findByUserIdAndMonthAndYear(
                    employe.getId(), month, year);
            if (existingPayslip.isPresent()) {
                log.info("Skip employee {}: payslip already exists for {}/{}", employe.getId(), month, year);
                continue;
            }

            Payslip payslip = new Payslip();
            payslip.setUserId(employe.getId());
            payslip.setDate(Date.from(monthEnd.atStartOfDay(BUSINESS_ZONE).toInstant()));
            // Set start date to hire date if hired mid-month, else first day of the month
            LocalDate effectiveStart = hireDate.isAfter(monthStart) ? hireDate : monthStart;
            payslip.setStartDate(Date.from(effectiveStart.atStartOfDay(BUSINESS_ZONE).toInstant()));

            calculateSalaries(payslip, effectiveStart, monthEnd);
            payslipRepository.save(payslip);

            log.info("Payslip generated for employee {} for {}/{}", employe.getId(), month, year);
        }
    }

    private void calculateSalaries(Payslip payslip, LocalDate startDate, LocalDate endDate) {
        Long userId = payslip.getUserId();

        // Appel au microservice employé via Feign
        EmployeCreateDTO empDto = employeFeignClient.getEmployeById(userId);
        Employe employe = empDto.toEntity();
        if (employe == null || employe.getSalary() == 0 || employe.getWorktime() == null) {
            log.warn("Employé non trouvé ou informations incomplètes pour l'utilisateur {}", userId);
            payslip.setBaseSalary(0.0);
            payslip.setGrossSalary(0.0);
            payslip.setNetSalary(0.0);
            payslip.setDeductions(0.0);
            payslip.setIrppDeduction(0.0);
            payslip.setCnssDeduction(0.0);
            payslip.setUnjustifiedAbsences(0.0);
            payslip.setPresentDays(0);
            return;
        }

        double baseSalary = employe.getSalary();

        AbsenceResult absenceResult = calculateAbsenceDeduction(employe, startDate, endDate);
        double absenceDeduction = absenceResult.deduction;
        payslip.setUnjustifiedAbsences(absenceResult.days);

        long workingDays = calculateWorkingDays(startDate, endDate, employe.getWorktime());
        int presentDays = (int) Math.max(0, workingDays - absenceResult.days);
        payslip.setPresentDays(presentDays);

        payslip.setBaseSalary(baseSalary);

        double prorationFactor = (double) workingDays / WORKING_DAYS_PER_MONTH;
        double proratedBaseSalary = baseSalary * prorationFactor;
        double salaryAfterAbsence = proratedBaseSalary - absenceDeduction;
        payslip.setGrossSalary(Math.max(0.0, salaryAfterAbsence));

        double cnssDeduction = salaryAfterAbsence * this.cnssRate;
        double deductionForfaitaire = Math.min(salaryAfterAbsence * deductionForfaitairePercent, deductionForfaitaireMax);
        double revenuImposableMensuel = salaryAfterAbsence - deductionForfaitaire;

        double revenuAnnuel = revenuImposableMensuel * 12;
        double irppAnnuel = calculateIRPP(revenuAnnuel);
        double irppMensuel = irppAnnuel / 12;

        double netSalary = salaryAfterAbsence - cnssDeduction - irppMensuel;

        payslip.setDeductions(cnssDeduction + irppMensuel);
        payslip.setIrppDeduction(irppMensuel);
        payslip.setCnssDeduction(cnssDeduction);
        payslip.setNetSalary(Math.max(0.0, netSalary));

        log.info("Employé {}: baseSalary={}, workingDays={}, presentDays={}, prorationFactor={}, grossSalary={}, netSalary={}",
                userId, baseSalary, workingDays, presentDays, prorationFactor, salaryAfterAbsence, netSalary);
    }

    private long calculateWorkingDays(LocalDate startDate, LocalDate endDate, Employe.Worktime worktime) {
        long totalDays = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        long workingDays = 0;
        LocalDate current = startDate;

        if (worktime == Employe.Worktime.H48) {
            while (!current.isAfter(endDate)) {
                if (current.getDayOfWeek() != DayOfWeek.SUNDAY) {
                    workingDays++;
                }
                current = current.plusDays(1);
            }
        } else if (worktime == Employe.Worktime.H40) {
            while (!current.isAfter(endDate)) {
                if (current.getDayOfWeek() != DayOfWeek.SATURDAY && current.getDayOfWeek() != DayOfWeek.SUNDAY) {
                    workingDays++;
                }
                current = current.plusDays(1);
            }
        } else {
            workingDays = totalDays;
        }

        return workingDays;
    }

    private AbsenceResult calculateAbsenceDeduction(Employe employe, LocalDate start, LocalDate end) {
        Employe.Worktime worktime = employe.getWorktime();

        double monthlyExpectedHours;
        double dailyHours;

        if (worktime == Employe.Worktime.H48) {
            dailyHours = 8.0;
            monthlyExpectedHours = 48 * (WORKING_DAYS_PER_MONTH / 6.0);
        } else if (worktime == Employe.Worktime.H40) {
            dailyHours = 8.0;
            monthlyExpectedHours = 40 * (WORKING_DAYS_PER_MONTH / 5.0);
        } else {
            return new AbsenceResult(0.0, 0);
        }

        double hourlyRate = employe.getSalary() / monthlyExpectedHours;

        List<ImputationDTO> absences = imputationFeignClient.getAbsencesByUserAndDateRange(
                employe.getId(),
                start,
                end
        );

        double absenceHours = absences.stream()
                .filter(imputation -> imputation.isValide() && !imputation.isDraft())
                .mapToDouble(ImputationDTO::getHours)
                .sum();


        int absenceDays = (int) Math.round(absenceHours / dailyHours);

        return new AbsenceResult(absenceHours * hourlyRate, absenceDays);
    }

    private double calculateIRPP(double revenuAnnuel) {
        double tax = 0;

        if (revenuAnnuel <= 5000) {
            tax = 0;
        } else if (revenuAnnuel <= 20000) {
            tax = (revenuAnnuel - 5000) * 0.26;
        } else if (revenuAnnuel <= 30000) {
            tax = (15000 * 0.26) + (revenuAnnuel - 20000) * 0.28;
        } else if (revenuAnnuel <= 50000) {
            tax = (15000 * 0.26) + (10000 * 0.28) + (revenuAnnuel - 30000) * 0.32;
        } else {
            tax = (15000 * 0.26) + (10000 * 0.28) + (20000 * 0.32) + (revenuAnnuel - 50000) * 0.35;
        }

        return tax;
    }

    public PayslipDTO getPayslipById(Long id) {
        return payslipRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    private PayslipDTO convertToDTO(Payslip payslip) {
        PayslipDTO dto = new PayslipDTO();
        dto.setPayslipId(payslip.getPayslipId());
        dto.setNetSalary(payslip.getNetSalary());
        dto.setGrossSalary(payslip.getGrossSalary());
        dto.setBaseSalary(payslip.getBaseSalary());
        dto.setDeductions(payslip.getDeductions());
        dto.setIrppDeduction(payslip.getIrppDeduction());
        dto.setCnssDeduction(payslip.getCnssDeduction());
        dto.setUnjustifiedAbsences(payslip.getUnjustifiedAbsences());
        dto.setDate(payslip.getDate());
        dto.setUserId(payslip.getUserId());
        dto.setStartDate(payslip.getStartDate());
        dto.setPresentDays(payslip.getPresentDays());
        return dto;
    }
    public void deletePayslip(Long id){
         payslipRepository.deleteById(id);
    }
    public List<PayslipDTO> getPayslipsByMonthAndYear(int month, int year) {
        List<Payslip> payslips = payslipRepository.findByMonthAndYear(month, year);
        return payslips.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private static class AbsenceResult {
        double deduction;
        int days;

        public AbsenceResult(double deduction, int days) {
            this.deduction = deduction;
            this.days = days;
        }
    }
}