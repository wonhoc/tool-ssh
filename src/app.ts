import express from "express";
import session from "express-session";
import cors from "cors";
import "dotenv/config";
import { setupSwagger } from "./config/swagger";
import sshRoutes from "./routes/severRoutes";
import "reflect-metadata";
import { AppDataSource } from "./config/database";

AppDataSource.initialize()
    .then(() => {
        console.log("데이터베이스 연결 성공!");
        // 서버 시작 코드...
    })
    .catch((error) => {
        console.error("데이터베이스 연결 오류:", error);
    });

const app = express();

app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:5000"],
        credentials: true,
        optionsSuccessStatus: 200, // legacy 브라우저를 위한 상태 코드 설정
    })
);
app.use(express.json());

app.use(
    session({
        secret: "your-secret-key", // 비밀 키를 환경 변수 등에서 관리
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // HTTPS 사용 시 true 로 변경
    })
);

setupSwagger(app);

app.use("/api/ssh", sshRoutes);

export default app;
