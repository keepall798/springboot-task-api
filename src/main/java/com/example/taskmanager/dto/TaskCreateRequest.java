package com.example.taskmanager.dto;

import com.example.taskmanager.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 新增任务时，客户端提交的 JSON 会被转换成这个对象。
 *
 * <p>把“请求参数”单独做成 DTO，而不是直接接收 Task 实体，
 * 可以避免客户端伪造 id、createdAt 等字段，也更适合教学演示。</p>
 */
public class TaskCreateRequest {

    @NotBlank(message = "标题不能为空")
    @Size(max = 200, message = "标题不能超过 200 个字符")
    private String title;

    /**
     * 状态可以不传，不传时默认使用 TODO。
     * 可选值：TODO、IN_PROGRESS、DONE。
     */
    private TaskStatus status;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}
