package com.example.moduleleave.dto;

import com.example.moduleleave.entity.Employe;

import java.time.LocalDate;
import java.util.List;

public class LeaveRequestDTO {
    private Long id;
    private Long leaveTypeId;
    private String leaveTypeName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Long employeeId;

    private Employe employee;
    private Double numberOfHours; // Changed to Double
    private Double totalHours;    // Changed to Double
    private List<DailyHours> dailyHours;
    private Double hours;         // Changed to Double

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Double getHours() { return hours; }
    public void setHours(Double hours) { this.hours = hours; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getLeaveTypeId() { return leaveTypeId; }
    public void setLeaveTypeId(Long leaveTypeId) { this.leaveTypeId = leaveTypeId; }
    public String getLeaveTypeName() { return leaveTypeName; }
    public void setLeaveTypeName(String leaveTypeName) { this.leaveTypeName = leaveTypeName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Employe getEmployee() {
        return employee;
    }

    public void setEmployee(Employe employee) {
        this.employee = employee;
    }

    public Double getNumberOfHours() { return numberOfHours; }
    public void setNumberOfHours(Double numberOfHours) { this.numberOfHours = numberOfHours; }
    public Double getTotalHours() { return totalHours; }
    public void setTotalHours(Double totalHours) { this.totalHours = totalHours; }
    public List<DailyHours> getDailyHours() { return dailyHours; }
    public void setDailyHours(List<DailyHours> dailyHours) { this.dailyHours = dailyHours; }

    public static class DailyHours {
        private String date;
        private Double hours; // Changed to Double

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public Double getHours() { return hours; }
        public void setHours(Double hours) { this.hours = hours; }
    }
}