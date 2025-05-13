import {
    ServerInfo,
    RtnTestConnection,
    ServerList,
    CommandResult,
} from "../types/serverType";
import { NodeSSH } from "node-ssh";
import { ServerRepository } from "../repository/ServerRepository";
import { Server } from "../entity/server";
import { FileStorage } from "../utils/FileStorage";

export class ServerService {
    private serverRepository: ServerRepository;
    private fileStorage: FileStorage;
    private ssh: NodeSSH;
    private isConnected: boolean = false;
    private timeoutId: NodeJS.Timeout | null = null;
    private timeoutDuration: number = 10 * 60 * 1000; // 10분 타임아웃 (기본값)

    constructor() {
        this.ssh = new NodeSSH();
        this.serverRepository = new ServerRepository();
        this.fileStorage = new FileStorage();
    }

    /** DB 관련 메소드 */

    // 서버 리스트 반환
    findAll(): Promise<ServerList | null> {
        return this.serverRepository.findAll();
    }

    async connectResteredServer(serverId: number) {
        const server: Server | null = await this.serverRepository.findById(
            serverId
        );

        if (server != null) {
            const privateKeyFile: Express.Multer.File | null =
                this.fileStorage.readFile(server.privateKey);

            const serverInfo: ServerInfo = {
                host: server.host,
                port: server.port,
                username: server.username,
            };

            this.connectServer(serverInfo, privateKeyFile);

            return { serverInfo };
        } else {
            return null;
        }
    }

    // 서버 정보 저장
    saveServerRegister(
        serverInfo: ServerInfo,
        privateKey: Express.Multer.File
    ) {
        const privateKeyPath: string = this.fileStorage.saveBufferToFile(
            privateKey,
            privateKey.originalname,
            process.env.SSH_KEY_DIR
        );

        const server = new Server();
        server.port = serverInfo.port;
        server.host = serverInfo.host;
        server.username = serverInfo.username;
        server.privateKey = privateKeyPath;

        this.serverRepository.save(server);
    }

    /** SSH 관련 메소드 */

    // 타이머 시작
    startTimeoutTimer() {
        // 기존 타이머 제거
        this.clearTimeoutTimer();

        // 새 타이머 설정
        this.timeoutId = setTimeout(() => {
            console.log("비활성 타임아웃: SSH 연결을 자동으로 종료합니다");
            this.disconnectServer();
        }, this.timeoutDuration);
    }

    // 타이머 종료
    clearTimeoutTimer() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    // 명령어 실행 method (한개만)
    async executeCommand(command: string): Promise<CommandResult> {
        if (!this.isConnected) {
            throw new Error("SSH 연결이 되어있지 않습니다.");
        }

        this.startTimeoutTimer(); // 활동 타이머 재설정

        try {
            // 여기서 await - 명령어 실행이 완료될 때까지 대기
            const result = await this.ssh.execCommand(command);

            return {
                success: result.code === 0,
                stdout: result.stdout,
                stderr: result.stderr,
                code: result.code || 0,
            };
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "알 수 없는 오류";
            throw new Error(`명령어 실행 실패: ${errorMessage}`);
        }
    }

    // 명령어 실행 method (다중)
    async executeMultipleCommands(
        commands: string[]
    ): Promise<CommandResult[]> {
        if (!this.isConnected) {
            throw new Error("SSH 연결이 되어있지 않습니다.");
        }

        this.startTimeoutTimer(); // 활동 타이머 재설정

        const results: CommandResult[] = [];

        try {
            for (const command of commands) {
                const result = await this.ssh.execCommand(command);
                results.push({
                    success: result.code === 0,
                    stdout: result.stdout,
                    stderr: result.stderr,
                    code: result.code || 0,
                    command,
                });
            }

            return results;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "알 수 없는 오류";
            throw new Error(`명령어 실행 실패: ${errorMessage}`);
        }
    }

    // SSH 연결
    private async connectServer(
        serverInfo: ServerInfo,
        privateKey: Express.Multer.File | null
    ): Promise<RtnTestConnection> {
        if (!serverInfo.host || !serverInfo.username) {
            return {
                result: false,
                message: "호스트 정보가 부족합니다.",
            };
        }

        try {
            if (privateKey != null) {
                const privateKeyContent = privateKey.buffer.toString("utf8");

                await this.ssh.connect({
                    host: serverInfo.host,
                    username: serverInfo.username,
                    port: serverInfo.port,
                    privateKey: privateKeyContent,
                    readyTimeout: 10000,
                });

                this.isConnected = true;
                this.startTimeoutTimer();
                return {
                    result: true,
                    message: "연결 성공",
                };
            } else {
                return {
                    result: false,
                    message: `연결 실패: 파일 없음`,
                };
            }
        } catch (error: any) {
            return {
                result: false,
                message: `연결 실패: ${error.message || "알 수 없는 오류"}`,
            };
        }
    }

    // SSH 해제
    private async disconnectServer(): Promise<RtnTestConnection> {
        await this.ssh.dispose();
        this.isConnected = false;

        return {
            result: true,
            message: "해제 성공",
        };
    }
}
