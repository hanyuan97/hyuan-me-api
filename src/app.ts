import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import adminRoutes from './routes/admin';
import apiRoutes from './routes';
import dotenv from "dotenv"

dotenv.config()

const app = express();

// 連接 MongoDB 資料庫
const DB_URI = process.env.DB_URI as string;
mongoose.connect(DB_URI);

// 啟用跨域
app.use(cors());

// 設定 middleware，解析 request body 的內容
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 設定路由
app.use('/admin/api', adminRoutes);
app.use('/api', apiRoutes);

// 如果路由不存在，回傳 404
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

export default app;