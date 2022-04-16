import { EventEmitter as OriginalEventEmitter } from "events";
import {
  AnalyzePcMessageRes,
  InitTutorMessageRes,
  LogMessage,
  StepsMessage,
  TermTutorMessageRes,
  UnhandledMessage,
  VersionMessage
} from "types/simuMessages";

export const HubMessageEventTypes = {
  AnalyzePc: "analycePc",
  InitTuror: "initTutor",
  Log: "log",
  Steps: "steps",
  TermTuror: "termTutor",
  Unhandled: "unhandled",
  Version: "version",
} as const;

export class HubEventEmitter extends OriginalEventEmitter {
  public emit(
    event: typeof HubMessageEventTypes.AnalyzePc,
    msg: AnalyzePcMessageRes
  ): boolean;

  public emit(
    event: typeof HubMessageEventTypes.InitTuror,
    msg: InitTutorMessageRes
  ): boolean;

  public emit(event: typeof HubMessageEventTypes.Log, msg: LogMessage): boolean;

  public emit(
    event: typeof HubMessageEventTypes.Steps,
    msg: StepsMessage
  ): boolean;

  public emit(
    event: typeof HubMessageEventTypes.TermTuror,
    msg: TermTutorMessageRes
  ): boolean;

  public emit(
    event: typeof HubMessageEventTypes.Unhandled,
    msg: UnhandledMessage
  ): boolean;

  public emit(
    event: typeof HubMessageEventTypes.Version,
    msg: VersionMessage
  ): boolean;

  public emit(event: string, ...args: any[]) {
    return super.emit(event, ...args);
  }
}
