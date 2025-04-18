interface ResponseCommon {
  error: string;
  code: number;
  message: string;
  response?: any;
  server_time?: string;
}

interface MessageKey {
  code: number;
  message: string;
}

export { ResponseCommon, MessageKey };
