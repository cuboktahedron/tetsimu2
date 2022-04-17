import common from "./common";

export default {
  Common: common,
  App: {
    InitializationFailed: "初期化失敗",
    Message: {
      InvalidParameterPassed: "URLパラメータが間違っています。",
    },
  },
  Edit: {
    Tool: {
      Button: {
        Flip: "左右反転",
      },
    },
    Settings: {
      NextPattern: "ネクストパターン",
      GenerateNextsEndlessly: "無限にネクストを生成する",
      Nexts: "ネクスト",
      NoOfCycle: "サイクル番号",
      NoOfCycleRandom: "ランダム",
    },
  },
  Explorer: {
    LoadError: "読み込み失敗",
    LoadFileFailed: "ファイルの読み込みに失敗",
    NewFile: "新しいファイル",
    NewFolder: "新しいフォルダ",
    SyncFailed: "同期に失敗",
    TempFolderDescription: "このフォルダの内容は保存されません。",
    Message: {
      InvalidFileFormat: "ファイルのフォーマットが正しくありません。",
      InvalidParameterPassed: "渡されたURLパラメータが正しくありません。",
    },
    AddSync: {
      Message: {
        MustNotBeEmpty: "入力してください。",
      },
      Title: "同期追加",
      SyncUrl: "同期URL",
    },
    EditFile: {
      Title: "ファイル編集",
      Message: {
        MustNotBeEmpty: "入力してください。",
        NameIsAlreadyUsed: "この名前は使用されています。",
      },
      Name: "ファイル名",
      Parameters: "パラメーター",
      Description: "内容",
      ParametersPlaceHolder: "生成されたURLパラメータを貼り付けてください。",
    },
    EditFolder: {
      Title: "フォルダ編集",
      Message: {
        MustNotBeEmpty: "入力してください",
        NameIsAlreadyUsed: "この名前は使用されています。",
      },
      Name: "フォルダ名",
      Description: "内容",
      SyncUrl: "同期URL",
    },
  },
  Help: {
    Version: "バージョン",
    Author: "製作者",
  },
  Replay: {
    Tool: {
      Step: "ステップ",
    },
    Settings: {
      Display: {
        Title: "表示",
        ShowPivot: "回転軸を表示する",
        ShowGhost: "ゴーストを表示する",
        ShowCycle: "サイクルを表示する",
        ShowTrace: "設置の軌跡を表示する",
      },
      ReplayInfo: {
        Title: "リプレイ情報",
        Nexts: "ネクスト数",
        OffsetRange: "相殺範囲",
        SimulatorType: "シミュレートタイプ",
      },
      Other: {
        Title: "その他",
        PassAllToSimu: "プレイモードに全て引き継ぐ",
      },
    },
  },
  Simu: {
    Hub: {
      Button: {
        ConnectToHub: "Hubに接続する",
        DisconnectFromHub: "Hubとの接続を閉じる",
      },
      TabAnalyze: "解析",
      Analyze: {
        Button: {
          Analyze: "解析",
        },
        ClearLine: "消去ライン",
        ClearLineAuto: "自動判別",
        UseHold: "ホールドを使用する",
        DropType: {
          Label: "落下タイプ",
          SoftDrop: "ソフトドロップ",
          HardDrop: "ハードドロップ",
          Tss: "TSS",
          Tsd: "TSD",
          Tst: "TST",
        },
      },
      Message: {
        ConnectTo: "{{url}} に接続しています ...",
        ConnectionEstablished: "接続に成功しました。",
        ConnectionClosed: "接続が閉じられました。({{code}}:{{reason}})",
        ErrorOccured: "エラーが発生しました。",
        HubVersion: "Hub バージョン: {{version}}",
      },
      TabTutor: "チューター",
      Tutor: {
        Button: {
          Start: "開始",
          Stop: "停止",
        },
        Message: {
          TerminatedGracefully: "正常に終了しました。",
          Ready: "準備ができました。",
        },
      },
    },
    Settings: {
      TabPlay: "プレイ",
      Display: {
        Title: "表示",
        Nexts: "ネクスト数",
        ShowPivot: "回転軸を表示する",
        ShowGhost: "ゴーストを表示する",
        ShowCycle: "サイクルを表示する",
      },
      PlayMode: {
        Title: "プレイモード",
        Mode: {
          Normal: "通常",
          Dig: "堀",
        },
        SimulatorType: "シミュレートタイプ",
      },
      Garbage: {
        Title: "お邪魔",
        Rate: {
          First: "レート1",
          Second: "レート2",
        },
        OffsetRange: "相殺範囲",
        GenerateGarbages: "お邪魔を生成する",
        Level: "レベル",
        Factors: "係数",
      },
      TabInput: "入力",
      Input: {
        TapType: "タップタイプ",
        HardDrop: "ハードドロップ",
        MoveLeft: "左移動",
        MoveRight: "右移動",
        SoftDrop: "ソフトドロップ",
        RotateLeft: "左回転",
        RotateRight: "右回転",
        Hold: "ホールド",
        Back: "一つ戻す",
      },
      TabExternal: "外部設定",
      External: {
        Host: "ホスト",
        Port: "ポート",
      },
      TabEnvironment: "環境",
      Environment: {
        Language: "言語",
      },
    },
  },
  Stats: {
    Title: "統計",
    Drops: "ミノ落下数",
    Lines: "消去ライン数",
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
    MaxRen: "最大Ren数",
    BackToBack: "BtB",
    TotalAttack: "総アタックライン数",
    AttackPerDrop: "アタックライン率",
    TotalHold: "総ホールド数",
    HoldPerDrop: "ホールド率",
  },
};
