# SQL 学习平台

基于 Node.js 和 MySQL 的 SQL 学习平台后端服务。

## 技术栈

- 后端框架：Express.js + TypeScript
- 数据库：MySQL
- 认证：JWT (JSON Web Token)
- 开发工具：ts-node-dev
- 日志：Winston
- 错误处理：统一的错误处理中间件

## 已实现功能

### 1. 用户系统
- 用户注册
- 用户登录
- 用户信息获取
- JWT认证
- 用户角色权限（student/teacher/admin）

### 2. SQL查询功能
- SQL语句执行
- 查询结果格式化
- 查询历史记录
- 错误处理和提示
- 查询超时控制
- 结果集大小限制

### 3. 数据库设计

#### 用户表 (users)
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 查询历史表 (query_history)
```sql
CREATE TABLE query_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    query TEXT NOT NULL,
    execution_time INT,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

#### 示例数据表
- customers（客户信息）
- accounts（账户信息）

## API 接口文档

### 用户认证接口

#### 1. 用户注册
- **URL**: `/api/users/register`
- **方法**: POST
- **请求体**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **成功响应** (201):
  ```json
  {
    "status": "success",
    "data": {
      "token": "string",
      "user": {
        "user_id": "number",
        "username": "string",
        "email": "string",
        "role": "string",
        "status": "string"
      }
    }
  }
  ```

#### 2. 用户登录
- **URL**: `/api/users/login`
- **方法**: POST
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "status": "success",
    "data": {
      "token": "string",
      "user": {
        "user_id": "number",
        "username": "string",
        "email": "string",
        "role": "string",
        "status": "string"
      }
    }
  }
  ```

#### 3. 获取用户信息
- **URL**: `/api/users/profile`
- **方法**: GET
- **请求头**: 
  ```
  Authorization: Bearer <token>
  ```
- **成功响应** (200):
  ```json
  {
    "status": "success",
    "data": {
      "user": {
        "user_id": "number",
        "username": "string",
        "email": "string",
        "role": "string",
        "status": "string",
        "last_login": "string",
        "created_at": "string"
      }
    }
  }
  ```

### SQL查询接口

#### 1. 执行SQL查询
- **URL**: `/api/sql/execute`
- **方法**: POST
- **请求头**: 
  ```
  Authorization: Bearer <token>
  ```
- **请求体**:
  ```json
  {
    "sql": "string"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "success": true,
    "data": [...],
    "message": "查询执行成功"
  }
  ```
- **错误响应** (400/401/500):
  ```json
  {
    "success": false,
    "message": "错误信息"
  }
  ```

#### 2. 获取查询历史
- **URL**: `/api/sql/history`
- **方法**: GET
- **请求头**: 
  ```
  Authorization: Bearer <token>
  ```
- **成功响应** (200):
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "number",
        "query": "string",
        "execution_time": "number",
        "status": "string",
        "created_at": "string"
      }
    ]
  }
  ```

## 错误处理

所有API响应遵循统一的错误处理格式：

```json
{
  "status": "error",
  "message": "错误描述信息"
}
```

常见错误状态码：
- 400: 请求参数错误
- 401: 未授权访问
- 403: 禁止访问
- 404: 资源不存在
- 408: 查询超时
- 500: 服务器内部错误

## 查询限制

- 最大返回行数: 1000
- 查询超时时间: 10秒
- 仅支持SELECT语句
- 查询结果自动分页

## 开发指南

### 1. 环境配置
复制 `.env.example` 到 `.env` 并修改配置：
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sql_learning
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

### 2. 安装依赖
```bash
npm install
```

### 3. 初始化数据库
```bash
node src/database/init.js
```

### 4. 启动服务
```bash
npm run dev
```

## 前端开发建议

1. **用户认证处理**：
   - 登录后保存 JWT token 到 localStorage
   - 在请求头中添加 token
   - 处理 token 过期情况

2. **SQL查询界面**：
   - 实现SQL编辑器（推荐使用 CodeMirror）
   - 添加语法高亮
   - 实现自动补全
   - 添加查询历史记录显示

3. **查询结果展示**：
   - 表格形式显示结果
   - 支持排序和筛选
   - 分页控制
   - 导出功能

4. **错误处理**：
   - 友好的错误提示
   - 查询超时处理
   - 网络错误处理

5. **性能优化**：
   - 实现查询防抖
   - 缓存查询结果
   - 分批加载大数据集

## 安全注意事项

1. 所有API请求必须包含有效的JWT token
2. 密码传输必须使用HTTPS
3. 防止SQL注入攻击
4. 限制查询执行时间和结果集大小
5. 对用户输入进行验证和清理