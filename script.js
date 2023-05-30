const groupSelect = document.getElementById("groupSelect");
const startButton = document.getElementById("start");
const inputForm = document.getElementById("inputForm");
const answer = document.getElementById("answer");
const problem = document.getElementById("problem");
const hint = document.getElementById("hint");
const result = document.getElementById("result");
const missing = document.getElementById("missing");

const inputFrameRadio = document.getElementById("inputFrameRadio");
const mainFrameRadio = document.getElementById("mainFrameRadio");
const playFrameRadio = document.getElementById("playFrameRadio");

const MODEL_DATA = ":化学の単語|物質/substance,元素/element,元素記号 chemical +/symbol,原子/atom,粒子/particle,核/nucleus,電子/electron,陽子/proton,中性子/neutron,周期表 + table/periodic,分子/molecule,化学式 chemical + /formula,化学反応 chemical + /reaction,化合 chemical + /combination,化合物/compound,塩化物/chloride,ナトリウム/sodium,結晶/crystal,有機/organic,無機/inorganic,混合物/mixture,酸化/oxidization,還元/reduction,燃焼/combustion,固体/solid,液体/liquid,気体/gas,液体と気体を合わせて/fluid,(物質の)状態/state,融解/melt,気化/evaporate,凝固/freeze,凝結/condense,昇華/sublimate,融点 + point/melting,沸点 + point/boiling,:物理学の単語|物体/object,重力/gravity,質量/mass,体積/volume,比重/specific,密度/density,万有引力/universal gravitation,相対性理論 the theory of +/relativity,力学/mechanics,相互作用/interaction,運動の法則 Newton's laws of +/motion,動力学/kinetics,慣性の法則 the law of +/inertia,静止した/stationary,運動方程式 Newton's +/equation of motion,加速度/acceleration,力/force,作用・反作用/action reaction,熱力学/thermodynamics,伝わる/transmit,エネルギー保存の法則 the law of the +/conservation,伝導/conduction,対流/convection,放射/radiation,伝導率/conductivity,膨張/expand,収縮/contract,振動/vibration,音波 + wave/sound,振動数/frequency,超音波/ultrasound,干渉/interference,回折/diffraction,共振/resonance,振幅/amplitude,音叉 + fork/tuning,電気/electricity,電荷/charge,導体/conductor,絶縁体/insulator,半導体/semiconductor,電子機器 + device/electronic,発光ダイオード + diode/light emitting,絶対零度 + zero/absolute,電気抵抗 electric +/resistance,超電導/superconductivity,電位 electric +/potential,電流 electric +/current,電圧/voltage,:天文学の単語|恒星 + star/fixed,惑星/planet,衛星/satellite,公転する/revolve,地軸 the +/axis,自転する/rotate,太陽系 the +/solar system,準惑星/dwarf planet,小惑星/asteroid,彗星/comet,光年/light year,天文単位 + unit/astronomical,(星の明るさの)等級/magnitude,:政治|ホッブスが著した書の名前/リバイアサン,";

// ロード時の処理
window.onload = function(){
  const data = localStorage.getItem("E_DATA");
  inputForm.value = data == null ? MODEL_DATA : data;
  setOption();

  // localStorage.removeItem("T_DATA");
  const missData = localStorage.getItem("T_DATA");
  missing.value = missData == null ? "" : missData;
}

function setOption(){
  groupSelect.innerHTML = "";
  for(let name of getName()){
    const option = document.createElement("option");
    option.textContent = name;
    option.value = name;
    groupSelect.appendChild(option);
  }
}

// スタートボタン
let missingProblem = [];
let which = "";
let ans = [];
function start(){
  const missData = localStorage.getItem("T_DATA");
  missing.value = missData == null ? "" : missData;

  mainFrameRadio.removeAttribute("checked");
  playFrameRadio.checked = true;
  const name = groupSelect.value;
  if(name == "間違えた問題"){
    ans = missingProblem;
  }else{
    ans = getArray(name);
  }
  missingProblem = [];
  
  const state = event.target.getAttribute("data-state");
  if(state == "1"){
    which = 0;
  }else if(state == "2"){
    which = 1;
  }
  
  const  d  = new Date();
  const  year = d.getFullYear();
  const  month = d.getMonth() + 1;
  const  date = ("00" + d.getDate()).slice(-2);
  const  day = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
  const  hour = ("00" + d.getHours()).slice(-2);
  const  minute = ("00" + d.getMinutes()).slice(-2);
  const  second = ("00" + d.getSeconds()).slice(-2);
  missing.value = year + "/" + month + "/" + date + "(" + day + ") " + hour + ":" + minute + ":" + second + "\n" + missing.value;
  localStorage.setItem("T_DATA", missing.value);
  
  change();
}

let miss = 0;
let clear = 0;
let count = 0;
answer.onkeydown = function(){
  if(ans[count]){
    setTimeout(function(){
      const inputText = answer.value;
      const ja = ans[count].split("/")[0];
      const en = ans[count].split("/")[1];
      if(inputText == en){
        count += 1;
        if(miss == 0){
          clear += 1;
        }
        miss = 0;
        change();
      }else if(inputText !== en && inputText.length >= en.length){
        if(miss == 0){
          addMissData(ja + "/" + en);
          const problem = ja + "/" + en;
          missingProblem.push(problem);
        }
        miss = 1;
        answer.value = "";
        hint.textContent = en.slice(0, 1);
      }
    }, 10)
  }
}

function change(){
  answer.value = "";
  hint.textContent = "";
  if(ans[count]){
    const ja = ans[count].split("/")[0];
    const en = ans[count].split("/")[1];
    if(which == 0){
      problem.textContent = en + "（" + ja + "）" + (Number(count) + 1) + "/" + ans.length;
    }else if(which == 1){
      problem.textContent = ja + " " + (Number(count) + 1) + "/" + ans.length;
    }
  }else{
    if(clear == count){
      const time = missing.value.split("\n")[0];
      const other = missing.value.replace(time + "\n", "");
      missing.value = other;
      localStorage.setItem("T_DATA", missing.value);
    }
    result.innerHTML = "問題名 : " + groupSelect.value + "<br>問題数 : " + count + "<br>正解数 : " + clear + "<br>正答率 : " + Math.round(clear / count * 100) + "%";
    clear = 0;
    count = 0;
    missingSet();
    mainFrameRadio.checked = true;
  }
}

function reset(){
  if(miss == 0){
    const time = missing.value.split("\n")[0];
    const other = missing.value.replace(time + "\n", "");
    missing.value = other;
    localStorage.setItem("T_DATA", missing.value);
  }
  missingSet();
  which = "";
  ans = [];
  miss = 0;
  clear = 0;
  count = 0;
}

function missingSet(){
  document.getElementById("missingOption") ? document.getElementById("missingOption").remove() : false;
  if(missingProblem[0]){
    const option = document.createElement("option");
    option.id = "missingOption";
    option.value = "間違えた問題";
    option.textContent = "間違えた問題";
    groupSelect.appendChild(option);
  }
}

function addMissData(data){
  const group = groupSelect.value;
  const addData = data == undefined ? "中断" : data
  const time = missing.value.split("\n")[0];
  const other = missing.value.replace(time + "\n", "");
  const result = time + "\n" + "問題名 : " + group + "|" + addData + "\n" + other;
  missing.value = result;
  localStorage.setItem("T_DATA", missing.value);
}

// 入力時の処理
inputForm.onkeyup = function(){
  const userInput = inputForm.value;
  localStorage.setItem("E_DATA", userInput);
}

window.onkeydown = function(){
  if(event.which == 16 && which == 1){
    const ja = ans[count].split("/")[0];
    const en = ans[count].split("/")[1];
    if(miss == 0){
      addMissData(ja + "/" + en);
    }
    miss = 1;
    hint.textContent = en
  }
}

// 入力データ処理
function getArray(g){
  const data = inputForm.value.replace(/\n/g, "");
  const array = data.split(":").filter(Boolean);
  for(let i=0; i<array.length; i++){
    const name = array[i].replace(/^(.*?)\|.*/, "$1");
    if(name == g){
      const list = array[i].replace(/^.*?\|(.*)/, "$1");
      return arrayShuffle(list.split(",").filter(Boolean));
    }
  }
}

function getName(){
  const data = inputForm.value.replace(/\n/g, "");
  const array = data.split(":").filter(Boolean);
  let nameList = [];
  for(let i=0; i<array.length; i++){
    const name = array[i].replace(/^(.*?)\|.*/, "$1");
    nameList.push(name)
  }
  return nameList;
}

// シャッフル
function arrayShuffle(array) {
  for(let i = (array.length - 1); 0 < i; i--){
    let r = Math.floor(Math.random() * (i + 1));
    let tmp = array[i];
    array[i] = array[r];
    array[r] = tmp;
  }
  return array;
}
