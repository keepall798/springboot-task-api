package com.example.taskmanager.dto;

import com.example.taskmanager.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 更新任务时提交的 JSON。
 *
 * <p>本项目使用 PUT 表示“整体更新”，所以 title 和 status 都必须传。
 * 如果只想改状态，也要把原来的 title 一起带上。</p>
 */
public class TaskUpdateRequest {

    @NotBlank(message = "标题不能为空")
    @Size(max = 200, message = "标题不能超过 200 个字符")
    private String title;

    @NotNull(message = "状态不能为空，可选值：TODO、IN_PROGRESS、DONE")
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
