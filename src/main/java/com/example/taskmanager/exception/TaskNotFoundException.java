package com.example.taskmanager.exception;

/**
 * 任务不存在时抛出的自定义异常。
 *
 * <p>继承 RuntimeException 表示非受检异常，Service 方法不用写 throws。
 * 最终由 GlobalExceptionHandler 统一转换成 404 JSON 响应。</p>
 */
public class TaskNotFoundException extends RuntimeException {

    public TaskNotFoundException(Long id) {
        super("任务不存在，id=" + id);
    }
}
