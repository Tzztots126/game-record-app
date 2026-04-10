# GameTrack

一个用于记录个人游戏库信息的项目。你可以在这里维护自己的游戏清单、状态、评分、游玩时长、标签、封面图和截图。

## 功能

- 游戏新增、编辑、删除、查看详情
- 按状态筛选（`playing` / `completed` / `dropped` / `wishlist`）
- 按创建时间、评分、名称排序
- 封面与截图上传（服务端压缩并转为 `webp`）
- 首页与游戏库统计面板
- 像素风 UI（适配桌面与移动端）

## 技术栈

- Next.js 16（App Router）
- React 19 + TypeScript
- Prisma 7 + SQLite/libSQL
- Tailwind CSS 4
- Sharp（图片处理）

## 项目结构

```text
app/
  api/games/              # 游戏 CRUD 接口
  games/                  # 游戏列表 / 详情 / 新增 / 编辑页面
  components/             # UI 组件（卡片、筛选、上传、灯箱等）
lib/
  db.ts                   # Prisma 客户端初始化
  upload.ts               # 图片上传/压缩/删除与标签处理
prisma/
  schema.prisma           # 数据模型
  migrations/             # 数据库迁移
public/
  uploads/                # 上传后的静态资源（封面/截图）
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

项目使用 `DATABASE_URL`，默认可用 SQLite 本地文件，例如：

```env
DATABASE_URL="file:./dev.db"
```

### 3. 初始化数据库

```bash
npx prisma migrate dev
```

### 4. 启动开发环境

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 可用命令

```bash
npm run dev      # 开发模式
npm run build    # 生产构建
npm run start    # 生产启动
npm run lint     # 代码检查
```

## 数据模型（Game）

- `id`: 游戏 ID（UUID）
- `name`: 游戏名称
- `coverImage`: 封面图片路径
- `tags`: 标签（JSON 字符串）
- `comment`: 备注
- `screenshots`: 截图列表（JSON 字符串）
- `status`: 游戏状态
- `rating`: 评分（1-10）
- `playTime`: 游玩时长（小时）
- `completedAt`: 完成时间（可选）

## 图片与存储说明

- 上传文件会保存在 `public/uploads/games/<gameId>/`
- 封面和截图会在服务端压缩并转为 `webp`
- 若未上传封面，使用默认图：`/uploads/default-cover.svg`
