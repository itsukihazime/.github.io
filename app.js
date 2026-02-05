const mainText = document.getElementById("mainText");
const buttons = document.getElementById("buttons");
const history = document.getElementById("history");
const resetBtn = document.getElementById("resetBtn");

const towerIcon = {
  炎: "🔥：移動禁止ﾆｱ誘導",
  タケノコ: "🌰：離れるﾆｱ誘導",
  闇: "🟣：ニアデバフ",
  風: "💨：ファーデバフ"
};

let step = 0;
let mem = {};

const steps = [
  // 1 十字 / X
  {
    render() {
      mainText.innerText = "分身配置\n十字 or X字";
      show([
        { label: "十字", value: "十字" },
        { label: "X字", value: "X字" }
      ], v => mem.shape = v);
    }
  },

  // 2 入れ替え + 詠唱安置
  {
    render() {
      mainText.innerText =
        "" +
        "1 ↔ B / 4 ↔ C\n\n\n" +
        "マーカー付与\n\n" +
        "詠唱完了の安置は？";
      show([
        { label: "12 安置", value: "12" },
        { label: "34 安置", value: "34" }
      ], v => mem.safe = v);
    }
  },

  // 3 Aマーカー 即行動
  {
    render() {
      mainText.innerText = "Aマーカーの線は？";
      show([
        { label: "円：入れ替え", value: "円" },
        { label: "頭：そのまま", value: "頭割り" }
      ], v => mem.first = v);
    }
  },

  // 4 詠唱完了 → 安置 → 島分断 → 塔
  {
    render() {
      mainText.innerText =
        "" +
        `${mem.safe} 安置へ\n\n` +
        "島分断 ST組 B 島\n\n" +
        "踏む塔を確認";
      show([
        { label: "🔥", value: "炎" },
        { label: "🌰", value: "タケノコ" },
        { label: "🟣", value: "闇" },
        { label: "💨", value: "風" }
      ], v => mem.tower = v);
    }
  },

  // 5 円 / 頭 ×4 表示 + 吸い込み
  {
    render() {
      const seq = mem.first === "円"
        ? "① 円C (ｽﾄｯﾌﾟ1,ｱﾀｯｸ1)\n② 頭 4 / 3 \n③ 円C (ｽﾄｯﾌﾟ2,ｱﾀｯｸ2)\n④ 頭 4 / 3 "
        : "① 頭 4 / 3 \n② 円C (ｽﾄｯﾌﾟ1,ｱﾀｯｸ1)\n③ 頭 4 / 3 \n④ 円C (ｽﾄｯﾌﾟ2,ｱﾀｯｸ2)";

      mainText.innerText =
      "🚫ｽﾄｯﾌﾟ1とｱﾀｯｸ１は注意！\n\n" +
      seq +
      "\n\n" +
      "ST組 B 島移動\n" +
      "踏む塔：" + towerIcon[mem.tower] + "\n\n" +
      "吸い込まれた分身は？";

      show([
        { label: "A 吸い込み", value: "北" },
        { label: "C 吸い込み", value: "南" }
      ], v => mem.absorb = v);
    }
  },

  // 6 中央南寄り分身
  {
    render() {
      mainText.innerText =
        "中央南寄り分身\n移動先は？";
      show([
        { label: "B島", value: "B" },
        { label: "D島", value: "D" }
      ], v => mem.clone = v);
    }
  },

 // 7 最終処理
{
  render() {
    buttons.innerHTML = "";

      // ① 最初の頭割りマーカー
      const firstHead =
        mem.shape === "十字"
          ? "頭割り：ST組 D"
          : "頭割り：ST組 4";

      // ② 島移動
      const islandMove =
        mem.clone === "B"
          ? "移動：D島"
          : "移動：B島";

      // ③ 島での安置（タゲサ内 / 外）
      const islandSafe =
        (mem.absorb === "北" && mem.safe === "12") ||
        (mem.absorb === "南" && mem.safe === "34")
          ? "安置：タゲサ外"
          : "安置：タゲサ内";

      // ④ 次の頭割りマーカー（①と逆）
      const secondHead =
        mem.shape === "十字"
          ? "頭割り：ST組 4"
          : "頭割り：ST組 D";

      // ⑤ 最後の扇範囲安置
      let fanSafe = "";
      if (mem.absorb === "北") {
        fanSafe = mem.safe === "12" ? "12安置" : "ボス下安置";
      } else {
        fanSafe = mem.safe === "12" ? "ボス下安置" : "12安置";
      }

      mainText.innerText =
      `【最終処理】

      ${firstHead}

      ${islandMove}
      ${islandSafe}

      ${secondHead}

      最後の扇範囲
      ${fanSafe}`;
    }
  }
];

function show(list, onSelect) {
  buttons.innerHTML = "";
  list.forEach(opt => {
    const b = document.createElement("button");
    b.innerText = opt.label;
    b.onclick = () => {
      onSelect(opt.value);
      history.innerText += opt.label + " ";
      step++;
      steps[step].render();
    };
    buttons.appendChild(b);
  });
}

resetBtn.onclick = () => {
  step = 0;
  mem = {};
  history.innerText = "";
  steps[0].render();
};

steps[0].render();
