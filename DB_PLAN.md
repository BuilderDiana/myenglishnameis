# 数据库设计与执行计划（PostgreSQL on AWS RDS）

目标：夯实数据库基础，先用原生 SQL 建表，再用 Prisma 映射到代码中，最后完成一次真实写入与读取。

## 1. 选择与理由

- 先用原生 SQL：打牢地基，面试常考，理解表结构与关系最扎实。
- 再用 Prisma：提升工程效率，能快速落地到 Next.js 项目。

## 2. 最小可用数据模型（MVP）

### 2.1 users（用户）

- id：主键
- email：邮箱（唯一）
- created_at：创建时间

### 2.2 profiles（用户画像/偏好）

- id：主键
- user_id：外键 → users.id
- chinese_name：中文名（可选）
- gender：性别风格（female/male/neutral）
- zodiac：西方星座
- chinese_zodiac：中国生肖
- mbti：MBTI（可选）
- vibe_keywords：核心气质关键词（最多 2 个）
- created_at：创建时间

### 2.3 name_results（生成结果）

- id：主键
- user_id：外键 → users.id
- profile_id：外键 → profiles.id
- candidates：JSON（3 个英文名及理由）
- created_at：创建时间

### 2.4 favorites（收藏）

- id：主键
- user_id：外键 → users.id
- name：收藏的英文名
- created_at：创建时间

## 3. SQL 建表脚本（第一阶段）

说明：先在 RDS 里执行以下 SQL，完成真实建表。

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chinese_name TEXT,
  gender TEXT NOT NULL,
  zodiac TEXT NOT NULL,
  chinese_zodiac TEXT NOT NULL,
  mbti TEXT,
  vibe_keywords TEXT[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS name_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  candidates JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

注意：
- `gen_random_uuid()` 需要 `pgcrypto` 扩展。
- 如果提示未安装扩展，请先执行：

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

## 4. Learning by Doing（明天执行顺序）

### Step 1：连接到 RDS

- 从 AWS 控制台拿到：
  - Host
  - Port
  - DB Name
  - Username / Password
- 使用 psql 连接：

```bash
psql "postgresql://USER:PASSWORD@HOST:5432/DBNAME"
```

### Step 2：执行 SQL 建表

- 先执行 `CREATE EXTENSION`（如果需要）
- 再执行四张表的建表脚本

### Step 3：验证表结构

```sql
\dt
\d users
\d profiles
```

### Step 4：插入一条测试数据

```sql
INSERT INTO users (email) VALUES ('test@example.com') RETURNING id;
```

### Step 5：插入 profile

```sql
INSERT INTO profiles (
  user_id, chinese_name, gender, zodiac, chinese_zodiac, mbti, vibe_keywords
) VALUES (
  'USER_ID_HERE', '张伟', 'neutral', 'leo', 'dragon', 'INTJ', ARRAY['rational','elegant']
);
```

### Step 6：插入生成结果（JSONB）

```sql
INSERT INTO name_results (user_id, profile_id, candidates)
VALUES (
  'USER_ID_HERE',
  'PROFILE_ID_HERE',
  '[{"name":"Elias","why_fit":["..."]}]'
);
```

### Step 7：查询确认

```sql
SELECT * FROM users;
SELECT * FROM profiles;
SELECT * FROM name_results;
```

## 5. Prisma 阶段（第二阶段）

完成 SQL 建表后，再开始：

- 新建 Prisma schema
- 用 Prisma 映射现有表结构
- 在 Next.js API 写入与读取

## 6. 明天的产出目标

- RDS 中成功建表
- 插入 1 条测试数据并能查询出来
- 把执行日志或截图记录，准备 GitHub 更新说明
