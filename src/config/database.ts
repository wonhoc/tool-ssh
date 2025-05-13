import { DataSource } from "typeorm";
import { join } from "path";

// 엔티티 파일들을 자동으로 불러오기 위한 경로 설정
const entitiesPath = join(__dirname, "..", "entity", "*.{ts,js}");
const migrationsPath = join(__dirname, "..", "migrations", "*.{ts,js}");

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306", 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false, // 개발 환경에서만 사용 (프로덕션에서는 false로 설정)
    logging: true,
    entities: [entitiesPath],
    migrations: [migrationsPath],
    subscribers: [],
});
