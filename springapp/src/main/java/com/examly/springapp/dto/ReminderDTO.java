package com.examly.springapp.dto;

import com.examly.springapp.model.EnumStatus;

public class ReminderDTO {
    private Long taskId;
    private String reminderDate;
    private EnumStatus status;

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getReminderDate() {
        return reminderDate;
    }

    public void setReminderDate(String reminderDate) {
        this.reminderDate = reminderDate;
    }

    public EnumStatus getStatus() {
        return status;
    }

    public void setStatus(EnumStatus status) {
        this.status = status;
    }
    
    
}
