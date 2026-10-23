package com.example.taskmanager.entity;

/**
 * 任务状态。
 *
 * <p>数据库里保存的是枚举的名字（例如 TODO），而不是 0/1/2。
 * 这样做的好处是：直接看数据库也能明白这一行是什么状态。</p>
 */
public enum TaskStatus {
    /** 待办 */
    TODO,
    /** 进行中 */
    IN_PROGRESS,
    /** 已完成 */
    DONE
}
