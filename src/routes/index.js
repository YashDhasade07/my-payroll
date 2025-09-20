import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const basename = path.basename(__filename);

const files = fs.readdirSync(__dirname)
  .filter((file) => 
    file.indexOf(".") !== -1 && 
    file !== basename && 
    file.slice(-3) === ".js"
  );

for (const file of files) {
  const fileName = file.split(".js")[0];
  const mainRoute = fileName ? `/${fileName}` : "/";
  const module = await import(path.join(__dirname, file));
  const route = module.default; 
  
  router.use(mainRoute, route);
}

export default router;
