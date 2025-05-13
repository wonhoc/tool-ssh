export const ServerSwaggerDocs = {
    registerServerInfo: {
        path: "/api/ssh/registerServerInfo",
        method: "post",
        summary: "서버 연결 테스트",
        description:
            "SSH 서버 연결을 위해 서버 정보를 등록하고 연결을 테스트합니다.",
        consumes: ["multipart/form-data"],
        requestBody: {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        type: "object",
                        required: ["host", "port", "username", "privateKey"],
                        properties: {
                            host: {
                                type: "string",
                                description: "서버 IP",
                                example: "192.168.116.128",
                            },
                            port: {
                                type: "integer",
                                description: "포트 번호",
                                example: 22,
                            },
                            username: {
                                type: "string",
                                description: "로그인 사용자 이름",
                                example: "root",
                            },
                            privateKey: {
                                type: "string",
                                format: "binary",
                                description: "개인 키 파일",
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: { description: "연결 성공" },
            400: { description: "요청 오류" },
            500: { description: "서버 오류" },
        },
    },

    getServerList: {
        path: "/api/ssh/getServerList",
        method: "get",
        summary: "serverList를 받음",
        responses: {
            200: {
                description: "응답 성공",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                response: {
                                    type: "string",
                                    example: "안녕하세요! 무엇을 도와드릴까요?",
                                },
                            },
                        },
                    },
                },
            },
            400: { description: "잘못된 요청" },
            500: { description: "서버 오류" },
        },
    },

    inputCommand: {
        path: "/api/ssh/executeCommand",
        method: "post",
        summary: "SSH 서버에 명령어 실행",
        description: "등록된 SSH 서버에 명령어를 실행하고 결과를 반환합니다.",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["command"],
                        properties: {
                            command: {
                                type: "string",
                                description: "실행할 명령어",
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                description: "명령 실행 성공",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                result: { type: "boolean" },
                                message: { type: "string" },
                                output: {
                                    type: "object",
                                    properties: {
                                        stdout: { type: "string" },
                                        stderr: { type: "string" },
                                        code: { type: "number" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            400: { description: "요청 오류" },
            404: { description: "서버 또는 키 파일을 찾을 수 없음" },
            500: { description: "서버 오류" },
        },
    },
};
