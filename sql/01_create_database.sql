-- ============================================================
-- 步骤 1：创建数据库和应用专用账号（MySQL 5.7 / 8.0 均可）
-- 执行方式（在项目根目录打开 PowerShell）：
--   mysql -u root -p -e "source sql/01_create_database.sql"
-- 执行后会要求输入 MySQL root 密码。
-- ============================================================

-- 1. 创建数据库，指定 utf8mb4 以支持中文和 emoji
CREATE DATABASE IF NOT EXISTS task_manager
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

-- 2. 创建应用专用账号（不要用 root 跑业务程序）
--    密码：TaskApp@123456
--    学习项目为了方便直接写在脚本里；正式项目请改成强密码并使用环境变量。
CREATE USER IF NOT EXISTS 'task_app'@'localhost' IDENTIFIED BY 'TaskApp@123456';
ALTER USER 'task_app'@'localhost' IDENTIFIED BY 'TaskApp@123456';

-- 有些客户端会用 127.0.0.1 连接，和 localhost 在 MySQL 里是两个不同的账号
CREATE USER IF NOT EXISTS 'task_app'@'127.0.0.1' IDENTIFIED BY 'TaskApp@123456';
ALTER USER 'task_app'@'127.0.0.1' IDENTIFIED BY 'TaskApp@123456';

-- 3. 只授权 task_manager 这个库，符合最小权限原则
GRANT ALL PRIVILEGES ON task_manager.* TO 'task_app'@'localhost';
GRANT ALL PRIVILEGES ON task_manager.* TO 'task_app'@'127.0.0.1';
FLUSH PRIVILEGES;

-- 4. 验证：应看到 task_manager 数据库
SHOW DATABASES LIKE 'task_manager';
