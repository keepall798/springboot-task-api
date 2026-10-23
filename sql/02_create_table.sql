-- ============================================================
-- 步骤 2：创建 task 表
-- 执行方式（在项目根目录打开 PowerShell）：
--   mysql -u root -p task_manager -e "source sql/02_create_table.sql"
-- ============================================================

USE task_manager;

CREATE TABLE IF NOT EXISTS task (
    id         BIGINT       NOT NULL AUTO_INCREMENT COMMENT '任务 ID，主键',
    title      VARCHAR(200) NOT NULL                COMMENT '任务标题',
    status     VARCHAR(20)  NOT NULL DEFAULT 'TODO' COMMENT '状态：TODO=待办，IN_PROGRESS=进行中，DONE=已完成',
    created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
    PRIMARY KEY (id),
    KEY idx_task_status (status),
    KEY idx_task_created_at (created_at)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = '任务表';

-- 验证表结构
DESC task;
