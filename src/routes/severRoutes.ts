// 파일: routes/serverRoutes.ts
import express from "express";
import { ServerController } from "../controllers/ServerController";
import multer from "multer";

const router = express.Router();
const serverController = new ServerController();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/registerServerInfo",
    upload.single("privateKey"),
    serverController.registerServerInfo
);

router.get("/getServerList", serverController.getServerList);

router.post("/executeCommand", serverController.executeCommand);

router.post("/connectServer", serverController.connectServer);

export default router;
