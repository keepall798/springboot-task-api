# Git / GitHub 上传教程（傻瓜版）

> 写给以后的自己：项目写完了，怎么传到 GitHub。
> 本文所有命令都在**项目根目录**执行。

---

## 一、先想清楚：哪些文件该传，哪些不该传

Git 传的是**源码和文档**，不是「能运行的东西」。

| 类型 | 传不传 | 原因 |
|---|---|---|
| 源代码 `.java` | ✅ 传 | 核心内容 |
| 配置文件 `application.yml`（示例值） | ✅ 传 | 别人要知道怎么配 |
| SQL 脚本 | ✅ 传 | 建库建表必需 |
| `pom.xml` / `mvnw` / `.mvn/` | ✅ 传 | 项目能构建 |
| README、docs 文档 | ✅ 传 | 学习记录的主体 |
| Postman 集合 / 测试脚本 | ✅ 传 | 别人能复现测试 |
| 测试截图、报告 | ✅ 传 | 证据（注意别太大） |
| `target/` 编译产物 | ❌ 不传 | 每次构建都能重新生成，又大又没意义 |
| `.idea/`、`*.iml`、`.vscode/` | ❌ 不传 | 个人 IDE 配置 |
| `node_modules/` | ❌ 不传 | 依赖，用 `npm install` 能装回来 |
| `.env`、真实密码 | ❌ **绝对不传** | 泄露事故 |
| 和你项目无关的个人文件 | ❌ 不传 | 仓库要干净 |

判断标准一句话：

> **「别人 clone 下来，能不能重新生成它？」能 → 不传；不能且必需 → 传。**

这些规则写在 `.gitignore` 里，Git 会自动忽略。

---

## 二、只做一次：准备 Git

### 2.1 检查是否装了 Git

```bash
git --version
```

没有就去 <https://git-scm.com/downloads> 装。

### 2.2 设置用户名和邮箱（提交记录会显示）

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

这一步只做一次，之后所有仓库通用。

### 2.3 确认能在终端登录 GitHub

推荐用 GitHub CLI，一次登录，后面建仓库、推送都免密：

```bash
gh auth status
```

如果显示 `Logged in to github.com account 你的名字`，就绪。

没有的话：

```bash
gh auth login
# 依次选择：GitHub.com → HTTPS → Login with a web browser
# 复制终端给出的一次性代码，在浏览器里粘贴授权
```

---

## 三、每次新建项目：五步上传

### 第 1 步：进入项目目录

```bash
cd E:\project
```

### 第 2 步：初始化仓库

```bash
git init -b main
```

`-b main` 表示主分支叫 `main`（GitHub 默认名）。

### 第 3 步：看看 Git 准备传哪些文件（重要！）

```bash
git status
```

红色的是「未跟踪」的文件。**这一步一定要看**：

- 如果出现了 `target/`、`.idea/`、`node_modules/`、个人文件 → 说明 `.gitignore` 没写好，先补
- 如果出现了密码、密钥、`.env` → 立刻停下来

不想传某个文件，有两个办法：

```bash
# 临时排除（写进 .gitignore 更好）
echo "不想传的文件名" >> .gitignore
```

### 第 4 步：暂存并提交

```bash
git add .
git commit -m "feat: 初始化任务清单后端项目"
```

`git add .` 把当前目录所有「没被忽略」的文件加入暂存区。
`git commit` 生成一次提交记录，`-m` 后面是说明。

提交信息建议用前缀，一看就懂：

| 前缀 | 用途 |
|---|---|
| `feat:` | 新功能 |
| `fix:` | 修 bug |
| `docs:` | 只改文档 |
| `refactor:` | 重构 |
| `test:` | 测试相关 |
| `chore:` | 构建、配置等杂事 |

### 第 5 步：创建远程仓库并推送

**方式 A：用 GitHub CLI（最省事，一条命令）**

```bash
gh repo create 仓库名 --public --source=. --remote=origin --push
```

例如：

```bash
gh repo create springboot-task-api --public --source=. --remote=origin --push
```

这条命令自动完成：建远程仓库 → 关联 `origin` → 推送当前分支。

想建私有仓库就把 `--public` 换成 `--private`。

**方式 B：先在网页建，再推**

1. 打开 <https://github.com/new>
2. 填 Repository name（**不要**勾选 "Add a README"，否则会和本地冲突）
3. 点 `Create repository`
4. 复制页面上的命令，类似：

```bash
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

第一次推送会弹浏览器授权，登录即可。

---

## 四、以后改了代码，怎么更新

三步：

```bash
git status                 # 看改了什么
git add .
git commit -m "feat: 增加按状态筛选接口"
git push
```

如果之前用过 `git push -u origin main`，以后直接 `git push` 就行。

---

## 五、常见问题

### 提示 `fatal: not a git repository`

不在项目目录里，或者还没 `git init`。

### 推送时要账号密码 / 一直失败

优先用 `gh auth login`（HTTPS + 浏览器授权）。
不要用 GitHub 账号密码，GitHub 早已不支持密码推送，要用 Personal Access Token 或 CLI 登录。

### `error: remote origin already exists`

已经关联过远程仓库了。改地址：

```bash
git remote set-url origin https://github.com/你的用户名/新仓库名.git
```

看当前关联：

```bash
git remote -v
```

### 不小心把密码提交了

1. 立刻去对应平台**改密码 / 吊销 Token**
2. 从 Git 历史里删除（`git filter-repo` 或 BFG）
3. 注意：**只要推上去了，即使后来删除，历史里仍然存在**，所以最好一开始就别提交

### 文件太大推不上去

GitHub 单文件上限 100MB。`target/`、`node_modules/`、视频、数据库备份都不要传。

### 想改仓库为私有 / 公有

```bash
gh repo edit --visibility private    # 改私有
gh repo edit --visibility public     # 改公有
```

### 中文文件名显示乱码

```bash
git config --global core.quotepath false
```

---

## 六、这个仓库实际用到的命令

```bash
cd E:\project
git init -b main
git add .
git commit -m "feat: Spring Boot 任务清单接口学习记录"
gh repo create springboot-task-api --public --source=. --remote=origin --push
```

之后每次更新：

```bash
git add .
git commit -m "docs: 补充 xxx"
git push
```

---

## 七、检查仓库是否健康

推上去后打开仓库页面，确认：

- [ ] 首页 README 正常显示（Markdown 渲染、图片能加载）
- [ ] `docs/` 下 7 篇文档都在
- [ ] 没有 `target/`、`.idea/`、`node_modules/`
- [ ] 没有密码、Token、个人隐私文件
- [ ] `sql/`、`postman/` 都能点开
- [ ] clone 到另一个目录后，按 README 能跑起来

最后一条最重要：**别人能不能复现**，是仓库质量的唯一标准。
