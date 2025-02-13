import { diskStorage } from 'multer';
import { Request } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// 动态创建存储目录
const createDestination = (req: any, file: Express.Multer.File, cb: Function) => {
  const userDir = `./uploads/user_${req.user?.id || 'anonymous'}`; // 按用户ID分区
  if (!existsSync(userDir)) mkdirSync(userDir, { recursive: true });
  cb(null, userDir);
};

// 生成防碰撞文件名
const generateFilename = (req: Request, file: Express.Multer.File, cb: Function) => {
//   const fileHash = crypto.randomBytes(16).toString('hex');
  const extension = extname(file.originalname);
  cb(null, `${uuidv4()}-${Date.now()}${extension}`);
};

export const localDiskConfig = {
  storage: diskStorage({
    destination: createDestination,
    filename: generateFilename
  }),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB上限
};