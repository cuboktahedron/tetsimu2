import common from "./common";

export default {
  Common: common,
  Help: {
    Version: "バージョン",
    Author: "製作者",
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
  Simu: {
    Hub: {
      Button: {
        ConnectToHub: "Hubに接続",
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
    Stats: {
      Title: "統計",
      Drops: "ミノ落下数",
      Lines: "消去ライン数",
      Single: "シングル",
      Double: "ダブル",
      Triple: "トリプル",
      Tetris: "テトリス",
      TSpinMini: "Tスピンミニ",
      TSpinMiniDouble: "Tスピンミニダブル",
      TSpinSingle: "Tスピンシングル",
      TSpinDouble: "Tスピンダブル",
      TSpinTriple: "Tスピントリプル",
      PerfectClear: "パーフェクトクリア",
      MaxRen: "最大Ren数",
      BackToBack: "BtB",
      TotalAttack: "総アタックライン数",
      AttackPerDrop: "アタックライン率",
      TotalHold: "総ホールド数",
      HoldPerDrop: "ホールド率",
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
        SimulatorType: "プレイタイプ",
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
};
