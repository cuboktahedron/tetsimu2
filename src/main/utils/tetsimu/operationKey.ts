export type OperationKeyOption = {
  interval1?: number;
  interval2?: number;
};

type InnerOperationKeyOption = {
  interval1: number; // ms
  interval2: number; // ms
};

export class OperationKey {
  private option: InnerOperationKeyOption;
  private isPressed: boolean = false;
  private isActive: boolean = false;
  private prevTime: number | null = null;
  private currentInterval: number | null = null;

  constructor(option: OperationKeyOption) {
    this.option = {
      interval1: option.interval1 ?? Number.MAX_SAFE_INTEGER,
      interval2: option.interval2 ?? Number.MAX_SAFE_INTEGER,
    };
  }

  down(): void {
    if (this.isPressed) {
      return;
    }

    this.isPressed = true;
    this.prevTime = new Date().getTime();
  }

  up(): void {
    this.isPressed = false;
    this.currentInterval = null;
    this.prevTime = null;
  }

  get pressed(): boolean {
    return this.isPressed;
  }

  get active(): boolean {
    return this.isActive;
  }

  refresh(): void {
    if (this.prevTime !== null) {
      const nowTime = new Date().getTime();
      if (this.currentInterval !== null) {
        const diff = nowTime - this.prevTime;
        if (diff < this.currentInterval) {
          this.isActive = false;
        } else {
          this.isActive = true;
          this.prevTime = nowTime;
          this.currentInterval = this.option.interval2;
        }
      } else {
        this.prevTime = nowTime;
        this.isActive = true;
        this.currentInterval = this.option.interval1;
      }
    } else {
      this.isActive = false;
    }
  }
}
