package com.example.moduleleave.Service;

import com.example.moduleleave.Feign.EmployeClient;
import com.example.moduleleave.Repository.LeaveRequestRepository;
import com.example.moduleleave.Repository.LeaveSoldRepository;
import com.example.moduleleave.Repository.LeaveTypeRepository;
import com.example.moduleleave.dto.EmployeCreateDTO;
import com.example.moduleleave.dto.EmployeDTO;
import com.example.moduleleave.dto.LeaveRequestDTO;
import com.example.moduleleave.entity.*;
import java.time.format.DateTimeFormatter;

import com.example.moduleleave.exception.LeaveRequestNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class LeaveRequestService {
    // au haut de ta classe LeaveRequestService :
    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_DATE;

    @Autowired
    private EmployeClient employeRepository ;
    @Autowired
    private LeaveTypeRepository leaveTypeRepository;
    private final LeaveSoldService leaveSoldService ;
    @Autowired
    private LeaveSoldRepository leaveSoldRepository ;
    private final LeaveRequestRepository leaveRequestRepository;

    @Autowired
    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository , LeaveSoldService leaveSoldService) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveSoldService = leaveSoldService ;
    }
    public List<LeaveRequest> findByStatus(String status) {
        return leaveRequestRepository.findByStatus(status);
    }


    public List<LeaveRequest> getLeaveRequestsByEmployee(Long employeeId) {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }




    @Transactional
    public List<LeaveRequest> createLeaveRequest(LeaveRequestDTO dto) {
        System.out.println("Received DTO: " + dto);
        System.out.println("numberOfHours: " + dto.getNumberOfHours());
        System.out.println("totalHours: " + dto.getTotalHours());
        System.out.println("dailyHours: " + dto.getDailyHours());

        EmployeCreateDTO empDto = employeRepository.getEmployeById(dto.getEmployeeId());
        Employe emp = empDto.toEntity();

        System.out.println("Employe récupéré : " + emp.getId() + " - " + emp.getFirstname());

        LeaveType type = leaveTypeRepository.findById(dto.getLeaveTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Type de congé non trouvé"));

        LocalDate start = dto.getStartDate();
        LocalDate end = dto.getEndDate();
        List<LeaveRequest> requests = new ArrayList<>();
        LeaveSold sold = leaveSoldRepository.findByEmployeAndLeaveType(emp, type)
                .orElseThrow(() -> new IllegalStateException("Solde non trouvé"));

        if (isSameDay(start, end)) {
            // Single-day request
            Double hours = dto.getNumberOfHours() != null ? dto.getNumberOfHours() : 8.0;
            if (hours < 0.5 || hours > 8) {
                System.out.println("Invalid numberOfHours, defaulting to 8: " + hours);
                hours = 8.0;
            }
            LeaveRequest req = createRequest(emp, type, start, end, hours, dto.getDescription());
            requests.add(req);
        } else if (dto.getTotalHours() != null && dto.getTotalHours() > 0) {
            // Multi-day with total hours - store as a single period
            double totalHours = dto.getTotalHours();
            long numDays = ChronoUnit.DAYS.between(start, end) + 1;
            double maxPossibleHours = numDays * 8;

            // Validate totalHours
            if (totalHours < 0.5 || totalHours > maxPossibleHours) {
                System.out.println("Invalid totalHours, defaulting to max: " + totalHours);
                totalHours = maxPossibleHours;
            }

            // Create a single LeaveRequest for the entire period
            LeaveRequest req = createRequest(emp, type, start, end, totalHours, dto.getDescription());
            requests.add(req);
        } else {
            // Full days (8h each) for the entire period
            long numDays = ChronoUnit.DAYS.between(start, end) + 1;
            double totalHours = numDays * 8;
            LeaveRequest req = createRequest(emp, type, start, end, totalHours, dto.getDescription());
            requests.add(req);
        }

        // Verify balance
        double requiredDays = requests.stream()
                .mapToDouble(r -> r.getNumberOfHours() / 8.0)
                .sum();

        if (sold.getSolde() < requiredDays) {
            throw new IllegalStateException("Solde insuffisant");
        }

        // Save
       // sold.setSolde(sold.getSolde() - requiredDays);
        leaveSoldRepository.save(sold);
        return leaveRequestRepository.saveAll(requests);
    }



    private LeaveRequest createRequest(Employe emp, LeaveType type, LocalDate start, LocalDate end, double hours, String desc) {
        LeaveRequest req = new LeaveRequest();
        req.setEmployee(emp);
        req.setLeaveType(type);
        req.setStartDate(start);
        req.setEndDate(end);
        req.setNumberOfHours(hours);
        req.setDescription(desc);
        req.setStatus("PENDING"); // Fixed status
        return req;
    }


    private boolean isSameDay(LocalDate start, LocalDate end) {
        return start.equals(end);
    }





    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    public LeaveRequest getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id)
                .orElseThrow(() -> new LeaveRequestNotFoundException("Leave request not found with id: " + id));
    }

    @Transactional
    public LeaveRequest updateLeaveRequestStatus(Long id, String newStatus) {
        LeaveRequest request = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new LeaveRequestNotFoundException("Leave request not found with id: " + id));

        request.setStatus(newStatus);
        return leaveRequestRepository.save(request);
    }

    @Transactional
    public void deleteLeaveRequest(Long id) {
        if (!leaveRequestRepository.existsById(id)) {
            throw new LeaveRequestNotFoundException("Leave request not found with id: " + id);
        }
        leaveRequestRepository.deleteById(id);
    }

    public LeaveRequest updateLeaveRequest(LeaveRequest leaveRequest) {
        return leaveRequestRepository.save(leaveRequest); // Update the LeaveRequest
    }
    public List<LeaveRequestDTO> getLeaveRequestsWithWorkflowStatus() {
        List<LeaveRequest> requests = leaveRequestRepository.findAll();
        return requests.stream().map(request -> {
            LeaveRequestDTO dto = new LeaveRequestDTO();
            dto.setId(request.getId());
            dto.setStartDate(request.getStartDate());
            dto.setEndDate(request.getEndDate());

            // ⚠ ici, tu dois mapper leaveTypeId + leaveTypeName
            if (request.getLeaveType() != null) {
                dto.setLeaveTypeId(request.getLeaveType().getIdLeaveType());
                dto.setLeaveTypeName(request.getLeaveType().getType());
            }

            dto.setDescription(request.getDescription());

            if (request.getWorkflowLeave() != null) {
                dto.setStatus(request.getWorkflowLeave().getStatus());
            } else {
                dto.setStatus(request.getStatus()); // fallback si pas de workflow
            }

            dto.setEmployee(request.getEmployee());

            return dto;
        }).collect(Collectors.toList());
    }
    public List<LeaveRequest> getValidatedLeaveRequestsByEmployeeAndDateRange(
            Long employeeId, LocalDate startDate, LocalDate endDate) {

        return leaveRequestRepository
                .findByEmployeeIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        employeeId,
                        "Validated by HR",   // ou mieux : LeaveRequestStatus.VALIDATED_BY_HR.name()
                        endDate,
                        startDate
                ) ;


    }


    private boolean isDateRangeOverlapping(LocalDate leaveStart, LocalDate leaveEnd,
                                           LocalDate rangeStart, LocalDate rangeEnd) {
        return !leaveEnd.isBefore(rangeStart) && !leaveStart.isAfter(rangeEnd);
    }

}