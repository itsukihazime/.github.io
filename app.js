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
      mainText.innerHTML = "分身配置<br>十字 or X字";
      mainText.innerHTML = colorize(mainText.innerHTML);
      show([
        { label: "十字", value: "十字" },
        { label: "X字", value: "X字" }
      ], v => mem.shape = v);
    }
  },

  // 2 入れ替え + 詠唱安置
  {
    render() {
      mainText.innerHTML =
        "" +
        "1 ↔ B / 4 ↔ C<br><br><br>" +
        "マーカー付与<br><br>" +
        "詠唱完了の安置は？";
      mainText.innerHTML = colorize(mainText.innerHTML);
      show([
        { label: "12 安置", value: "12" },
        { label: "34 安置", value: "34" }
      ], v => mem.safe = v);
    }
  },

  // 3 Aマーカー 即行動
  {
    render() {
      mainText.innerHTML = "Aマーカーの線は？";
      mainText.innerHTML = colorize(mainText.innerHTML);
      show([
        { label: "円：入れ替え", value: "円" },
        { label: "頭：そのまま", value: "頭割り" }
      ], v => mem.first = v);
    }
  },

  // 4 詠唱完了 → 安置 → 島分断 → 塔
  {
    render() {
      mainText.innerHTML =
        "" +
        `${mem.safe} 安置へ<br><br>` +
        "島分断 ST組 B 島<br><br>" +
        "踏む塔を確認";
      mainText.innerHTML = colorize(mainText.innerHTML);
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
        ? "① 円C (ｽﾄｯﾌﾟ１,ｱﾀｯｸ１)<br>② 頭 4 / 3 <br>③ 円C (ｽﾄｯﾌﾟ２,ｱﾀｯｸ２)<br>④ 頭 4 / 3 "
        : "① 頭 4 / 3 <br>② 円C (ｽﾄｯﾌﾟ1,ｱﾀｯｸ1)<br>③ 頭 4 / 3 <br>④ 円C (ｽﾄｯﾌﾟ2,ｱﾀｯｸ2)";

      mainText.innerHTML =
      "🚫ｽﾄｯﾌﾟ１とｱﾀｯｸ１は注意！<br><br>" +
      seq +
      "<br><br>" +
      "ST組 B 島移動<br>" +
      "踏む塔：" + towerIcon[mem.tower] + "<br><br>" +
      "吸い込まれた分身は？";
      mainText.innerHTML = colorize(mainText.innerHTML);

      show([
        { label: "A 吸い込み", value: "北" },
        { label: "C 吸い込み", value: "南" }
      ], v => mem.absorb = v);
    }
  },

  // 6 中央南寄り分身
  {
    render() {
      mainText.innerHTML =
        "中央南寄り分身<br>移動先は？";
      mainText.innerHTML = colorize(mainText.innerHTML);
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

      mainText.innerHTML =
      `【最終処理】<br><br>

      ${firstHead}<br><br>

      ${islandMove}<br>
      ${islandSafe}<br><br>

      ${secondHead}<br><br>

      最後の扇範囲<br>
      ${fanSafe}`;
      mainText.innerHTML = colorize(mainText.innerHTML);
    }
  }
];

function show(list, onSelect) {
  buttons.innerHTML = "";
  list.forEach(opt => {
    const b = document.createElement("button");
    b.innerHTML = colorize(opt.label);
    b.onclick = () => {
      onSelect(opt.value);
      history.innerHTML += opt.label + " ";
      step++;
      steps[step].render();
    };
    buttons.appendChild(b);
  });
}
function colorize(text) {
  return text
    // 1 / A → 赤
    .replace(/1|A/g, '<span class="c-red">$&</span>')
    // 2 / B → 黄
    .replace(/2|B/g, '<span class="c-yellow">$&</span>')
    // 3 / C → 青
    .replace(/3|C/g, '<span class="c-blue">$&</span>')
    // 4 / D → 紫
    .replace(/4|D/g, '<span class="c-purple">$&</span>');

}



resetBtn.onclick = () => {
  step = 0;
  mem = {};
  history.innerHTML = "";
  steps[0].render();
};

steps[0].render();


