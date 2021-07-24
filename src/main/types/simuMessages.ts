
export type HubMessageHeader = {
  message_id: string;
  request_message_id: string;
  result: number;
};

export type AnalyzePcMessageResBody = {
  message: string;
};

export type AnalyzePcMessageRes = {
  header: HubMessageHeader;
  body: AnalyzePcMessageResBody;
};

export type LogMessage = {
  header: MessageHeader;
  body: LogMessageBody;
};

export type MessageHeader = {
  message_id: string;
};

export type LogMessageBody = {
  message: string;
};

export type UnhandledMessage = {
  header: MessageHeader;
  body: UnhandledMessageBody;
};

export type UnhandledMessageBody = {
  message: string;
};
