import { EventEmitter as OriginalEventEmitter } from "events";
import {
  AnalyzePcMessageRes,
  LogMessage,
  UnhandledMessage
} from "types/simuMessages";

export const HubMessageEventTypes = {
  AnalyzePc: "analycePc",
  Log: "log",
  Unhandled: "unhandled",
} as const;

export class HubEventEmitter extends OriginalEventEmitter {
  public emit(
    event: typeof HubMessageEventTypes.AnalyzePc,
    msg: AnalyzePcMessageRes
  ): boolean;

  public emit(event: typeof HubMessageEventTypes.Log, msg: LogMessage): boolean;

  public emit(
    event: typeof HubMessageEventTypes.Unhandled,
    msg: UnhandledMessage
  ): boolean;

  public emit(event: string, ...args: any[]) {
    return super.emit(event, ...args);
  }
}
