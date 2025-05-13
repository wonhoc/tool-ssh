import { Request, Response } from "express";
import { ServerService } from "../services/ServerService";
import { ServerInfo, ServerList } from "../types/serverType";

export class ServerController {
    private serverService: ServerService;

    constructor() {
        this.serverService = new ServerService();
    }

    // 서버 정보 저장
    registerServerInfo = async (req: Request, res: Response) => {
        const serverInfo: ServerInfo = req.body;
        const privateKey = req.file;

        if (!privateKey) {
            return res.status(400).json({
                result: "false",
                message: "파일이 없습니다.",
            });
        }

        try {
            this.serverService.saveServerRegister(serverInfo, privateKey);
            return res
                .status(200)
                .json({ result: true, message: "서버 등록 성공" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Something went wrong" });
        }
    };

    // 서버 리스트 반환
    getServerList = async (req: Request, res: Response) => {
        try {
            const serverList: ServerList | null =
                await this.serverService.findAll();
            return res.json({ serverList });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Something went wrong" });
        }
    };

    // 서버 연결
    connectServer = async (req: Request, res: Response) => {
        const serverId: number = req.body.serverId;

        try {
            const serverInfo = await this.serverService.connectResteredServer(
                serverId
            );
            return res.status(200).json({
                result: true,
                message: "연결 완료.",
                data: serverInfo,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Something went wrong" });
        }
    };

    // 명령어 실행
    executeCommand = async (req: Request, res: Response) => {
        const { commands } = req.body;

        if (!commands) {
            return res.status(400).json({
                result: false,
                message: "명령어는 필수이며 문자열이어야 합니다.",
            });
        }

        try {
            const response = await this.serverService.executeMultipleCommands(
                commands
            );

            if (!response) {
                return res.status(404).json({
                    result: false,
                    message: "서버를 찾을 수 없거나 연결할 수 없습니다.",
                });
            }

            return res.status(200).json(response);
        } catch (err: any) {
            console.error("SSH 명령 실행 중 오류:", err);

            if (err.message && err.message.includes("찾을 수 없습니다")) {
                return res.status(404).json({
                    result: false,
                    message: err.message,
                });
            }

            return res.status(500).json({
                result: false,
                message: "명령 실행 중 오류가 발생했습니다.",
                error: err.message,
            });
        }
    };
}
