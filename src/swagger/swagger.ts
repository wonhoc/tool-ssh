import { ServerSwaggerDocs } from "./server.swagger";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SSH Server API",
            version: "1.0.0",
            description: "SSH 서버 제어 API",
        },
        paths: {
            "/api/ssh/registerServerInfo": {
                post: ServerSwaggerDocs.registerServerInfo,
            },
            "/api/ssh/getServerList": {
                get: ServerSwaggerDocs.getServerList,
            },
            "/api/ssh/executeCommand": {
                post: ServerSwaggerDocs.inputCommand,
            },
        },
    },
    apis: ["./src/routes/severRoutes.ts"], // 필요한 경우 API 경로 추가
};

const swaggerSpecs = swaggerJsdoc(options);
export default swaggerSpecs;
