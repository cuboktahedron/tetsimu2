import common from "./common";

export default {
  Common: common,
  App: {
    InitializationFailed: "Initialization failed",
    Message: {
      InvalidParameterPassed: "This is maybe invalid url parameters passed.",
    },
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
  Explorer: {
    LoadError: "Load error",
    LoadFileFailed: "Load file failed",
    NewFile: "NewFile",
    NewFolder: "NewFolder",
    SyncFailed: "Sync failed",
    TempFolderDescription: "The contents of this folder will not be saved.",
    Message: {
      InvalidFileFormat: "This file is not valid format.",
      InvalidParameterPassed: "This is maybe invalid url parameters passed.",
    },
    AddSync: {
      Message: {
        MustNotBeEmpty: "Must not be empty",
      },
      SyncUrl: "sync url",
      Title: "Add sync",
    },
    EditFile: {
      Title: "Edit file",
      Message: {
        MustNotBeEmpty: "Must not be empty",
        NameIsAlreadyUsed: "This name is already used",
      },
      Name: "name",
      Parameters: "parameters",
      Description: "description",
      ParametersPlaceHolder: "Paste generated url parameters here",
    },
    EditFolder: {
      Title: "Edit folder",
      Message: {
        MustNotBeEmpty: "Must not be empty",
        NameIsAlreadyUsed: "This name is already used",
      },
      Name: "name",
      Description: "description",
      SyncUrl: "sync url",
    },
  },
  Help: {
    Version: "Version",
    Author: "Author",
  },
  Replay: {
    Tool: {
      Step: "step",
    },
    Settings: {
      Display: {
        Title: "Display",
        ShowPivot: "Show pivot",
        ShowGhost: "Show ghost",
        ShowCycle: "Shot cycle",
        ShowTrace: "Show trace",
      },
      ReplayInfo: {
        Title: "Replay Info",
        Nexts: "Nexts",
        OffsetRange: "Offset range",
        SimulatorType: "Simulator type",
      },
      Other: {
        Title: "Other",
        PassAllToSimu: "Pass all to play mode",
      },
    },
  },
  Simu: {
    Hub: {
      Button: {
        ConnectToHub: "CONNECT TO HUB",
        DisconnectFromHub: "DISCONNECT FROM HUB",
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
        HubVersion: "Hub version: {{version}}",
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
  Stats: {
    Title: "Stats",
    Drops: "Drops",
    Lines: "Lines",
    Single: common.Tetsimu.Single,
    Double: common.Tetsimu.Double,
    Triple: common.Tetsimu.Triple,
    Tetris: common.Tetsimu.Tetris,
    TSpinMini: common.Tetsimu.TSpinMini,
    TSpinMiniDouble: common.Tetsimu.TSpinMiniDouble,
    TSpinSingle: common.Tetsimu.TSpinSingle,
    TSpinDouble: common.Tetsimu.TSpinDouble,
    TSpinTriple: common.Tetsimu.TSpinTriple,
    PerfectClear: common.Tetsimu.PerfectClear,
    MaxRen: "Max Ren",
    BackToBack: "Back to Back",
    TotalAttack: "Total Attack",
    AttackPerDrop: "Attack per Drop",
    TotalHold: "Total Hold",
    HoldPerDrop: "Hold per Drop",
  },
};
