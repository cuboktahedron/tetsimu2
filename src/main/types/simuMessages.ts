// Response messages

import { Direction, FieldCellValue, Tetromino } from "./core";

export const Tetsimu2MessageVersion = "1.0.0";

export type HubMessageHeader = {
  version: String;
  message_id: string;
  request_message_id: string;
  result: number;
};

export type AnalyzePcMessageResBody = {
  succeeded: boolean;
  message: string;
  minimal_items: AnalyzePcMessageResBodyItem[];
  unique_items: AnalyzePcMessageResBodyItem[];
};

export type AnalyzePcMessageResBodyItem = {
  title: string;
  detail: AnalyzePcMessageResBodyItemDetail[];
};

export type AnalyzePcMessageResBodyItemDetail = {
  settles: string;
  field: FieldCellValue[];
};

export type AnalyzePcMessageRes = {
  header: HubMessageHeader;
  body: AnalyzePcMessageResBody;
};

export type InitTutorMessageRes = {
  header: HubMessageHeader;
};

export type TermTutorMessageRes = {
  header: HubMessageHeader;
};

// Hub messages

export type LogMessage = {
  header: MessageHeader;
  body: LogMessageBody;
};

export type MessageHeader = {
  version: string;
  message_id: string;
};

export type LogMessageBody = {
  message: string;
};

export type StepsMessage = {
  header: MessageHeader;
  body: StepsMessageBody;
};

export type StepsMessageBody = {
  request_message_id: string;
  steps: Step[];
};

export type Step = {
  type: Tetromino;
  dir: Direction;
  x: number;
  y: number;
};

export type UnhandledMessage = {
  header: MessageHeader;
  body: UnhandledMessageBody;
};

export type UnhandledMessageBody = {
  message: string;
};

export type VersionMessage = {
  header: MessageHeader;
  body: VersionMessageBody;
};

export type VersionMessageBody = {
  version: string;
};
