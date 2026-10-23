package com.example.taskmanager.dto;

import com.example.taskmanager.entity.Task;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

/**
 * 返回给客户端的任务数据。
 *
 * <p>不直接把实体返回给客户端，是为了让接口字段保持稳定：
 * 以后数据库加字段时，不会意外暴露给前端。</p>
 */
public class TaskResponse {

    private Long id;
    private String title;
    private String status;

    /** 统一输出成 2026-10-20 15:30:00 这种格式，便于阅读 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    public TaskResponse() {
    }

    public TaskResponse(Long id, String title, String status, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.createdAt = createdAt;
    }

    /** 把数据库实体转换成接口返回对象 */
    public static TaskResponse from(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getStatus().name(),
                task.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
