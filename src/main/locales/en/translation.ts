import common from "./common";

export default {
  Common: common,
  Help: {
    Version: "Version",
    Author: "Author",
  },
  Edit: {
    Tool: {
      Button: {
        Flip: "FLIP",
      },
    },
    Settings: {
      NextPattern: "nexts pattern",
      GenerateNextsEndlessly: "Generate nexts endlessly",
      Nexts: "nexts",
      NoOfCycle: "no of cycle",
      NoOfCycleRandom: "Random",
    },
  },
  Simu: {
    Hub: {
      Button: {
        ConnectToHub: "CONNECT TO HUB",
      },
      TabAnalyze: "Analyze",
      Analyze: {
        Button: {
          Analyze: "ANALYZE",
        },
        ClearLine: "clear line",
        ClearLineAuto: "Auto",
        UseHold: "Use hold",
        DropType: {
          Label: "drop type",
          SoftDrop: "SoftDrop",
          HardDrop: "HardDrop",
          Tss: "TSS",
          Tsd: "TSD",
          Tst: "TST",
        },
      },
      Message: {
        ConnectTo: "Connect to {{url}} ...",
        ConnectionEstablished: "Connection established.",
        ConnectionClosed: "Connection closed({{code}}:{{reason}})",
        ErrorOccured: "Error occured.",
      },
      TabTutor: "Tutor",
      Tutor: {
        Button: {
          Start: "START",
          Stop: "STOP",
        },
        Message: {
          TerminatedGracefully: "Tutor terminated gracefully.",
          Ready: "Tutor is ready.",
        },
      },
    },
    Stats: {
      Title: "Stats",
      Drops: "Drops",
      Lines: "Lines",
      Single: "Single",
      Double: "Double",
      Triple: "Triple",
      Tetris: "Tetris",
      TSpinMini: "T-Spin Mini",
      TSpinMiniDouble: "T-Spin Mini Double",
      TSpinSingle: "T-Spin Single",
      TSpinDouble: "T-Spin Double",
      TSpinTriple: "T-Spin Triple",
      PerfectClear: "Perfect Clear",
      MaxRen: "Max Ren",
      BackToBack: "Back to Back",
      TotalAttack: "Total Attack",
      AttackPerDrop: "Attack per Drop",
      TotalHold: "Total Hold",
      HoldPerDrop: "Hold per Drop",
    },
    Settings: {
      TabPlay: "Play",
      Display: {
        Title: "Display",
        Nexts: "nexts",
        ShowPivot: "Show pivot",
        ShowGhost: "Show ghost",
        ShowCycle: "Show cycle",
      },
      PlayMode: {
        Title: "Play Mode",
        Mode: {
          Normal: "Normal",
          Dig: "Dig",
        },
        SimulatorType: "simulator type",
      },
      Garbage: {
        Title: "Garbage",
        Rate: {
          First: "first rate",
          Second: "second rate",
        },
        OffsetRange: "offset range",
        GenerateGarbages: "Generate garbages",
        Level: "level",
        Factors: "Factors",
      },
      TabInput: "Input",
      Input: {
        TapType: "tap type",
        HardDrop: "hard drop",
        MoveLeft: "move left",
        MoveRight: "move right",
        SoftDrop: "soft drop",
        RotateLeft: "rotate left",
        RotateRight: "rotate right",
        Hold: "hold",
        Back: "back",
      },
      TabExternal: "External",
      External: {
        Host: "host",
        Port: "port",
      },
      TabEnvironment: "Environment",
      Environment: {
        Language: "language",
      },
    },
  },
};
