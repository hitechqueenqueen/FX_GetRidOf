/* ===== FX1 24-Hour Cycle & Interactive Portfolio Engine ===== */
const WEDGES = [
  { s:0, e:1, zh:"歐美重疊尾段", cl:"週末消息累積 · 亞洲接手前", en:"Overlap Tail", tz:"歐洲＋美國", tzFull:"歐洲（倫敦）＋美國（紐約）", tag:"EU+NY", k:"獲利回吐", hot:2, pr:"EUR/USD、GBP/USD" },
  { s:1, e:2, zh:"紐約尾市", cl:"週末消息累積 · 亞洲接手前", en:"NY Late Session", tz:"美國", tzFull:"美國（紐約）", tag:"NY", k:"波動遞減", hot:1, pr:"USD/JPY、USD/CHF、EUR/USD" },
  { s:2, e:3, zh:"亞洲待市", cl:"週末休市 · 開市前靜止", en:"Pre-Asia Handoff", tz:"過渡期", tzFull:"過渡期（紐約午後）", tag:"—", k:"交接真空", hot:0, pr:"—" },
  { s:3, e:6, zh:"流動性靜淡", cl:"週末休市 · 開市前靜止", en:"Liquidity Lull", tz:"亞洲休市", tzFull:"紐約尾盤至換日（無主導）", tag:"—", k:"低流動性", hot:0, pr:"交叉盤（EUR/JPY、GBP/JPY）" },
  { s:6, e:7, zh:"東京開市", cl:"亞洲時段（尚未開始）", en:"Tokyo Open", tz:"亞洲", tzFull:"亞洲（悉尼／東京前哨）", tag:"ASIA", k:"跳空突破", hot:2, pr:"USD/JPY、EUR/JPY、AUD/JPY" },
  { s:7, e:8, zh:"亞洲承接", cl:"亞洲時段（尚未開始）", en:"Asia Takeover", tz:"亞洲", tzFull:"亞洲（東京＋悉尼）", tag:"ASIA", k:"承接方向", hot:1, pr:"AUD/USD、NZD/USD、AUD/JPY" },
  { s:8, e:10, zh:"亞洲流動性", cl:"亞洲時段（尚未開始）", en:"Asian Liquidity", tz:"亞洲", tzFull:"亞洲（東京＋悉尼）", tag:"ASIA", k:"趨勢初成", hot:1, pr:"AUD、NZD、JPY 交叉盤" },
  { s:10, e:12, zh:"亞洲盤整固", cl:"亞洲時段（尚未開始）", en:"Asian Range", tz:"亞洲", tzFull:"亞洲（東京）", tag:"ASIA", k:"區間整理", hot:0, pr:"JPY 交叉盤（EUR/JPY、USD/JPY）" },
  { s:12, e:15, zh:"亞洲午後", cl:"亞洲時段（尚未開始）", en:"Asia Afternoon", tz:"亞洲", tzFull:"亞洲（等待歐洲接力）", tag:"ASIA", k:"數據預期", hot:1, pr:"USD 交叉盤、EUR/USD" },
  { s:15, e:16, zh:"倫敦鋪墊", cl:"倫敦盤前（尚未開始）", en:"Pre-London Uptick", tz:"亞洲→歐洲", tzFull:"亞洲 轉 歐洲（倫敦）", tag:"PRE-EU", k:"波幅擴大", hot:2, pr:"EUR/JPY、GBP/JPY、EUR/USD" },
  { s:16, e:17, zh:"亞歐重疊", cl:"亞歐重疊（尚未開始）", en:"Asia/Europe Overlap", tz:"亞洲＋歐洲", tzFull:"亞洲＋歐洲（倫敦）", tag:"ASIA+EU", k:"交叉盤活躍", hot:3, pr:"EUR/JPY、GBP/JPY（EUR/USD 開始反應）" },
  { s:17, e:18, zh:"倫敦早盤突破", cl:"倫敦時段（尚未開始）", en:"London Breakout", tz:"歐洲", tzFull:"歐洲（倫敦）", tag:"EU", k:"日內突破", hot:2, pr:"EUR/USD、GBP/USD" },
  { s:18, e:20, zh:"倫敦動能", cl:"倫敦時段（尚未開始）", en:"London Momentum", tz:"歐洲", tzFull:"歐洲（倫敦）", tag:"EU", k:"順勢動能", hot:2, pr:"EUR/USD、GBP/USD、EUR/CHF、GBP/CHF" },
  { s:20, e:21, zh:"倫敦轉折", cl:"倫敦尾盤（尚未開始）", en:"London Reversal", tz:"歐洲", tzFull:"歐洲（倫敦）", tag:"EU", k:"高位反轉", hot:2, pr:"EUR/USD、GBP/USD" },
  { s:21, e:22, zh:"紐約開市", cl:"紐約時段（尚未開始）", en:"NY Open", tz:"美國", tzFull:"美國（紐約）", tag:"NY", k:"美元定價", hot:2, pr:"全部 USD 貨幣對" },
  { s:22, e:24, zh:"歐美重疊核心", cl:"歐美重疊（尚未開始）", en:"Core EU/NA Overlap", tz:"歐洲＋美國", tzFull:"歐洲（倫敦）＋美國（紐約）", tag:"EU+NY", k:"最高量", hot:3, pr:"EUR/USD、GBP/USD、USD/JPY" }
];

const AI = [
  { now:"歐美重疊進入最後一小時，倫敦接近收市（17:00 UTC）。美元指數站上 103 的高位在亞洲接手前缺乏後續買盤，本時段通常是日內方向的最後一次修正。", geo:"美伊和談消息與中東局勢在亞洲開盤前仍可能傳出；油價單日曾跌逾 10%，顯示避險溢價正在快速收縮。", cb:"FOMC 會議紀錄（香港時間 11/19 03:00）前，市場已把 12 月加息 25bp 定價至約 90%。", brk:"USD/JPY 160.00 是政策干預觸發線；亞洲開盤前若再度逼近 160，可能出現官方口頭干預。", act:"不開新倉，只做倉位管理；為 07:00 東京開盤預備 JPY 交叉盤突破單。" },
  { now:"倫敦已收市，紐約進入午盤，是美元強勢的最後確認期。USD/CHF 波動劇烈，避險需求與美瑞息差主導瑞郎與日圓走勢。", geo:"中東局勢若出現新一輪消息，已收市的歐洲盤會在亞洲早盤補價。", cb:"Fed 十月議息有兩票反對主張加息 25bp，鷹派分歧擴大，加息路徑仍是美元主要支撐。", brk:"尾盤前薄量時段點差擴大，假突破機率上升。", act:"僅管理倉位；用掛單等待亞洲開盤方向確認，滑點設定要收緊。" },
  { now:"紐約午後交投轉淡、東京與悉尼尚未開市，全球流動性逐步降至低谷，價格以窄幅橫盤為主。", geo:"地緣政治頭條在此累積，隔夜跳空風險升高。", cb:"無政策事件。", brk:"突發新聞在此時段容易造成流動性真空跳空。", act:"不交易；用掛單等待亞洲開盤的方向確認。" },
  { now:"紐約尾盤收市（06:00 HKT）及每日日結換日（05:00–06:00 HKT），點差擴闊、波動極低，是日內方向形成前的蓄勢期。", geo:"中東與美伊進程的最新消息在此被市場消化。", cb:"中國人民銀行上調外匯存款準備金率至 6%，在岸人民幣在 6.67 附近企穩。", brk:"隔夜突發新聞與 USD/JPY 干預是最大變數；05:00–06:00 換日點差最闊。", act:"波段與長線的建倉窗口：避開日內劇烈波動，用限價單分批佈局（避開 05:00–06:00 換日點差）。" },
  { now:"新交易日開啟（週一 06:00 HKT 補週末缺口），日本 CPI 與第三季 GDP 等國內數據被消化，JPY 交叉盤出現亞洲時段第一個可交易訊號。", geo:"美國中期選舉後政策轉向及 AI 監管疑慮影響科技股與避險情緒。", cb:"日本央行政策利率 1.25%；12/18 加息定價約 84%。", brk:"USD/JPY 盤中觸及 160.19 後已獲財務大臣與首相的干預警告。", act:"順勢追突破但先等 15 分鐘確認方向；干預風險高，倉位宜小。" },
  { now:"東京時段正式啟動（23:00 UTC），隔夜美元強勢的方向在此消化。AUD/USD 跌至 0.6773 的 10 個月低點，商品貨幣承壓。", geo:"油價因美伊和談希望急挫，直接壓制澳元、加元等商品貨幣。", cb:"RBA 已加息至 4.85%；RBNZ 第三季通脹回落至 3.7%。", brk:"澳洲就業數據是商品貨幣的單日最大變數。", act:"以亞洲承接方向做短線；AUD/JPY 為當日最活躍的亞洲交叉盤。" },
  { now:"亞洲時段流動性主峰，東京定盤與中國在岸開盤帶動日內方向初成。", geo:"澳洲與中東相關的供應鏈消息影響商品貨幣估值。", cb:"中國收緊外匯流動性以抑制結匯，人民幣偏強格局未變但升值斜率放緩。", brk:"中國數據低於預期會放大人民幣波動並傳導至亞洲貨幣。", act:"等待突破亞洲時段早盤區間，量能確認後順勢持有。" },
  { now:"東京午盤波動收斂，價格在區間內來回，是典型「區間為主」的時段。", geo:"暫無新增頭條。", cb:"歐洲理事會與歐央行官員在午間前開始發言，歐元定價醞釀中。", brk:"區間末端容易出現假突破。", act:"支撐阻力高拋低吸，止損放區間外；不追突破單。" },
  { now:"歐洲開盤前的準備時段，美元倉位開始調整。美元指數 103.17 高位讓非美貨幣持續承壓。", geo:"美國中期選舉後的財政與 AI 監管政策不確定性持續發酵。", cb:"12 月 Fed 加息定價約 90%；歐央行 12 月加息預期同步升溫。", brk:"歐盤前的突發頭條可能改變整體定價。", act:"歐盤前收縮過度槓桿；可先佈局突破掛單等行情啟動。" },
  { now:"自 HKT 15:00（UTC 07:00）起每小時 pip 區間明顯放大——歐洲交易員開始對亞洲隔夜動作作出反應。", geo:"法國財政與政治風險令歐元政治溢價受壓。", cb:"歐央行存款利率 2.50%，管委會鷹派訊號升溫。", brk:"英國 CPI 前 30 分鐘波動常先放大，須防假突破；留意 EUR/USD 1.1000 關口。", act:"先掛突破單等波幅擴大；用 EUR/USD 1.1000 關口作觸發條件。" },
  { now:"倫敦正式開市接手亞洲盤，亞洲×歐洲交叉盤點差收窄、波動放大。", geo:"英國財政與評級檢討前的英鎊敏感度升高。", cb:"英國央行已加息至 4.00%，維持鷹派立場支撐英鎊。", brk:"EUR/USD 跌破 1.1000 會引發止損連鎖。", act:"用倫敦開市首根 5 分鐘 K 線確認方向順勢入場，止損設在亞洲時段區間之外。" },
  { now:"倫敦開市後獨立主導，是歐洲早盤波幅最大的時段之一，歐元與英鎊在此突破日內區間。", geo:"歐洲能源價格反彈推升輸入型通脹，是歐央行最大的顧慮。", cb:"歐央行維持 2.50% 存款利率，屬典型鷹派暫停。", brk:"假突破比例高，需要收線確認。", act:"順勢突破為主，配合 5 分鐘收線確認；避免在開市瞬間追價。" },
  { now:"全球約 38% 的日成交量在此形成，是歐元、英鎊、瑞郎影響力最大的時段。", geo:"法國財政風險令歐元短線承壓，避險資金與息差主導歐系貨幣分化。", cb:"市場對英國央行進一步收緊的預期支撐英鎊（GBP/USD 1.3211）。", brk:"若美債 10 年期收益率站上 5.1% 上方，美元會再創年內新高。", act:"順勢突破＋回調進場的黃金窗；歐洲時段最值得做單的區間。" },
  { now:"倫敦尾盤前獲利回吐與紐約盤前佈局常在此出現，歐元日內階段性高低點多在此確立。", geo:"資金在美國數據前平倉，避險資產波動加劇。", cb:"Fed 官員密集講話窗口開啟，每一次發言都可能改變 12 月定價。", brk:"日圓干預警告可能在歐美交接期再現。", act:"順勢倉位在此段減半；反轉交易者等日內高低位假突破後跟進。" },
  { now:"紐約於美東 08:00（HKT 21:00）開市，美元定價權接管，21:30 美國一級數據密集公布。", geo:"美伊和談與中東局勢在此被定價到油價與通脹預期。", cb:"12 月 Fed 加息定價約 90%；Fed 官員的每一次講話都可能改價。", brk:"數據瞬間滑點與停頓風險最高。", act:"數據前降槓桿；數據後等 15 分鐘收線確認再順勢入場。" },
  { now:"倫敦與紐約同時開市，全日最高成交量、最大方向性擺動。美元指數 103.17 高位在此刷新。", geo:"中東、伊朗協議進度與美國政策轉向全部在此被匯率定價。", cb:"FOMC 會議紀錄（11/19 03:00 HKT）是本窗口之後的第一個政策事件。", brk:"USD/JPY 160.00 的干預線在亞洲開盤前仍可能觸發。", act:"全日唯一值得重倉的窗口：突破前 15–30 分鐘區間整理後的假突破策略，或數據後順勢單。" }
];

const DAY_CTX = [
  { n:"週日", tag:"週末休市", tone:"closed", t:"全球現貨外匯市場整日休市（週末封盤）。消息面仍在累積，將於週一 06:00 HKT 開市以跳空缺口反映。", k:"休市期間沒有現貨報價成交。", a:"市場休市。開市前準備：① 寫下關鍵位（EUR/USD 1.1000、USD/JPY 160.00）；② 檢查 EA 與掛單滑點上限。" },
  { n:"週一", tag:"補缺口日", tone:"open", t:"週一 06:00 HKT 正式開市，主線是「補回週末缺口」；第二波機構流動性於倫敦開市（16:00 HKT）加入。", k:"週末消息在亞洲開市前半小時內定價。", a:"亞洲時段先觀察缺口方向與回補幅度，待倫敦開市（16:00 HKT）確認方向再順勢入場。" },
  { n:"週二", tag:"數據密集", tone:"open", t:"一級經濟數據升溫，形成「早段亞洲區間、晚段美國定價」的雙重節奏。", k:"亞洲與歐洲先建立高低區間，美國數據決定突破方向。", a:"亞洲段做區間、歐美段做方向；避免用同一套止損幅度應對兩種波動。" },
  { n:"週三", tag:"政策敘事日", tone:"open", t:"英國 CPI 與 FOMC 會議紀錄（週四 03:00 HKT）為政策敘事核心，美元加息定價迎來重定。", k:"會議紀錄揭露委員分歧程度。", a:"FOMC 紀錄公布後 30–60 分鐘內波動劇烈，宜等首輪方向確認再順勢。" },
  { n:"週四", tag:"事件密度最高", tone:"open", t:"凌晨 FOMC 紀錄、早盤澳洲就業、晚間美國初領失業金密集登場，全週事件密度最高。", k:"數據透過利率預期差傳導至交叉盤。", a:"每個事件後只做同向確認，不做逆勢猜頂底，預留半段日內倉位額度。" },
  { n:"週五", tag:"獲利平倉日", tone:"open", t:"獲利平倉與週末前資金流主導，規避週末跳空風險使機構在週五減倉。", k:"避險平倉常令瑞郎、日圓在尾盤出現技術性回調。", a:"週五尾盤不追單；留倉過週末的話在歐美重疊結束前減半。" },
  { n:"週六", tag:"週末休市", tone:"closed", t:"全球現貨外匯市場休市（週六 06:00 HKT 正式封盤）。", k:"週末地緣政治消息將累積成下週一開市缺口。", a:"休市期間不作交易決策；檢視本週風控執行並整理下週關鍵位。" }
];

const EVENTS = [
  { d:"11/16", dow:1, h:7.83, cat:"data", t:"日本第三季 GDP（初值）", x:"23:50 GMT 換算；日圓交叉盤早盤定價基礎", imp:2 },
  { d:"11/16", dow:1, h:21.5, cat:"data", t:"加拿大 10 月 CPI", x:"08:30 ET 換算；USD/CAD 1.4290 為關鍵位", imp:3 },
  { d:"11/17", dow:2, h:21.5, cat:"data", t:"美國 10 月零售銷售", x:"08:30 ET 換算；檢驗消費韌性", imp:3 },
  { d:"11/18", dow:3, h:15, cat:"data", t:"英國 10 月 CPI", x:"07:00 GMT 換算；預估 3.73%", imp:3 },
  { d:"11/19", dow:4, h:3, cat:"cb", t:"FOMC 會議紀錄", x:"14:00 ET 換算；12 月加息 25bp 定價 90%", imp:3 },
  { d:"11/19", dow:4, h:8.5, cat:"data", t:"澳洲 10 月就業", x:"00:30 GMT 換算；AUD/USD 0.6773 關鍵催化劑", imp:3 },
  { d:"11/19", dow:4, h:21.5, cat:"data", t:"美國初領失業金人數", x:"08:30 ET 換算；檢驗勞動市場延續性", imp:2 },
  { d:"11/20", dow:5, h:7.5, cat:"data", t:"日本 10 月 CPI", x:"23:30 GMT 換算；配合 12/18 日銀加息定價 84%", imp:2 },
  { d:"11/20", dow:5, h:15, cat:"data", t:"英國 10 月零售銷售", x:"07:00 GMT 換算；考驗消費韌性", imp:2 },
  { d:"11/20", dow:5, h:23, cat:"data", t:"美國密歇根大學消費者信心指數", x:"10:00 ET 換算；週五收盤前最後美元定價", imp:2 },
  { d:"11/21", dow:6, h:1, cat:"geo", t:"Moody’s 英國評級檢討", x:"17:00 GMT 換算；財政壓力直接影響英鎊", imp:3 }
];

const RECUR = [
  { h:7, cat:"brk", t:"亞洲開盤跳空窗口", x:"日圓干預消息、亞洲央行政見傳導，隔夜跳空風險最高", imp:2 },
  { h:15, cat:"brk", t:"歐洲官員講話／波幅擴大", x:"UTC 07:00 起每小時 pip 區間明顯放大", imp:2 },
  { h:21.5, cat:"brk", t:"美國一級數據發布", x:"滑點與停頓風險最高的一刻", imp:3 },
  { h:22, cat:"brk", t:"Fed 官員點評窗口", x:"美東 09:00 起為官員講話密集時段", imp:2 }
];

const GEO_STAND = [
  { h:2, cat:"geo", t:"美伊和談與中東局勢", x:"油價波動劇烈，避險溢價快速收縮或逆轉", imp:2 },
  { h:5, cat:"geo", t:"USD/JPY 160 干預風險", x:"日本財務大臣與首相已發出警告", imp:3 },
  { h:9, cat:"geo", t:"中國外匯政策收緊", x:"外匯存款準備金率升至 6%，雙向波動放大", imp:2 },
  { h:11, cat:"geo", t:"美國中期選舉後政策轉向", x:"AI 監管疑慮令科技股波動，影響美元風險情緒", imp:2 },
  { h:18, cat:"geo", t:"法國財政與歐元政治溢價", x:"壓制歐元短線表現", imp:2 }
];

const CAT = {
  cb: { c:"#c62828", bg:"#fdeaea", zh:"央行政策" },
  data: { c:"#1565c0", bg:"#e6f0fb", zh:"經濟數據" },
  geo: { c:"#ef6c00", bg:"#fdeee0", zh:"地緣政治" },
  brk: { c:"#6a1b9a", bg:"#f0e6f7", zh:"突發風險" }
};

const SNAP = {
  date: "2026-11-14（週六）紐約收市",
  snap: "DXY 103.17；EUR/USD 1.1022、GBP/USD 1.3211、AUD/USD 0.6773、USD/JPY 159.71、USD/CHF 0.8391、USD/CAD 1.4270；美 10 年期債息 ~5.1%；黃金 >$4,000"
};

const DAY_ZH = ["日", "一", "二", "三", "四", "五", "六"];
const DAY_FULL = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const PAD = n => String(n).padStart(2, '0');
const el = id => document.getElementById(id);
const SEG_COL = { ASIA:'#2f6fb0', EU:'#1c8a5a', NY:'#d1622a', 'ASIA+EU':'#7b4fd0', 'EU+NY':'#c98a1e', 'PRE-EU':'#1f8f86', '—':'#8496ab' };
let ACTIVE = new Set(['cb', 'data', 'geo', 'brk']);

/* ============================================================================
   BUG FIX #1: DRAGGABLE SPLIT RESIZER (Flex-basis + Pointer Capture)
   ============================================================================ */
function initSplitResizer() {
  const resizer = el('splitResizer');
  const leftPane = el('leftPane');
  const layout = el('mainLayout');
  if (!resizer || !leftPane || !layout) return;

  const savedWidth = localStorage.getItem('fx_split_left_px');
  if (savedWidth) {
    const px = parseFloat(savedWidth);
    if (px >= 340 && px <= window.innerWidth - 360) {
      leftPane.style.flex = `0 0 ${px}px`;
      leftPane.style.width = `${px}px`;
    }
  }

  let isDragging = false;

  resizer.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    isDragging = true;
    resizer.classList.add('dragging');
    resizer.setPointerCapture(e.pointerId);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  resizer.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const rect = layout.getBoundingClientRect();
    const minLeft = 340;
    const maxLeft = Math.max(minLeft, rect.width - 380);
    const newLeft = Math.max(minLeft, Math.min(maxLeft, e.clientX - rect.left - 7));
    leftPane.style.flex = `0 0 ${newLeft}px`;
    leftPane.style.width = `${newLeft}px`;
    localStorage.setItem('fx_split_left_px', String(newLeft));
  });

  const stopDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    resizer.classList.remove('dragging');
    if (e && e.pointerId !== undefined && resizer.hasPointerCapture(e.pointerId)) {
      resizer.releasePointerCapture(e.pointerId);
    }
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  resizer.addEventListener('pointerup', stopDrag);
  resizer.addEventListener('pointercancel', stopDrag);
}

/* ============================================================================
   BUG FIX #2 & #3: TWO-WAY CSV BINDING & INLINE PORTFOLIO MANAGEMENT
   ============================================================================ */
let csvFileHandle = null;
let portfolioRows = [
  { id: 1, pair: "GBPCHF", side: "BUY", lots: 0.20, entry: 1.11250, current: 1.10880, swap: -4.20, notes: "EA Grid Layer 1" },
  { id: 2, pair: "CADJPY", side: "SELL", lots: 0.30, entry: 111.850, current: 112.120, swap: 6.40, notes: "Carry Hedge" }
];

const CSV_HEADERS = ["pair", "side", "lots", "entry", "current", "swap", "notes"];

function parseCsvText(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(l => l.trim() !== "");
  if (lines.length === 0) return [];
  const headerCols = lines[0].split(",").map(h => h.trim().toLowerCase());
  const hasHeader = headerCols.includes("pair") && headerCols.includes("entry");
  const startIdx = hasHeader ? 1 : 0;

  const parsed = [];
  for (let i = startIdx; i < lines.length; i++) {
    const cols = lines[i].split(",").map(c => c.trim());
    if (cols.length < 4) continue;
    const pair = (cols[0] || "").toUpperCase();
    const side = (cols[1] || "BUY").toUpperCase() === "SELL" ? "SELL" : "BUY";
    const lots = parseFloat(cols[2]) || 0.01;
    const entry = parseFloat(cols[3]);
    const current = parseFloat(cols[4]);
    const swap = parseFloat(cols[5]) || 0;
    const notes = cols.slice(6).join(",") || "";
    if (pair && !Number.isNaN(entry)) {
      parsed.push({
        id: Date.now() + i,
        pair,
        side,
        lots,
        entry,
        current: Number.isNaN(current) ? entry : current,
        swap,
        notes
      });
    }
  }
  return parsed;
}

function serializeCsv() {
  const rows = [CSV_HEADERS.join(",")];
  portfolioRows.forEach(r => {
    const safeNotes = String(r.notes || "").replace(/,/g, ";");
    rows.push([r.pair, r.side, r.lots, r.entry, r.current, r.swap, safeNotes].join(","));
  });
  return rows.join("\n");
}

function updateCsvStatus(msg, linked) {
  const txt = el('csvStatusTxt');
  const dot = el('csvStatusDot');
  if (txt) txt.textContent = msg;
  if (dot) dot.classList.toggle('linked', Boolean(linked));
}

async function syncCsvToDisk() {
  const csvContent = serializeCsv();
  localStorage.setItem('fx_portfolio_backup_csv', csvContent);

  if (csvFileHandle) {
    try {
      const writable = await csvFileHandle.createWritable();
      await writable.write(csvContent);
      await writable.close();
      const now = new Date();
      updateCsvStatus(`已雙向同步至本地 CSV (${PAD(now.getHours())}:${PAD(now.getMinutes())}:${PAD(now.getSeconds())})`, true);
      return;
    } catch (err) {
      console.error("CSV write error:", err);
      updateCsvStatus("寫入本地 CSV 失敗（權限中斷），已暫存於瀏覽器", false);
    }
  }
}

async function bindLocalCsvFile() {
  if ('showOpenFilePicker' in window && window.isSecureContext) {
    try {
      const [handle] = await window.showOpenFilePicker({
        multiple: false,
        types: [{ description: 'CSV 持倉資料庫', accept: { 'text/csv': ['.csv'] } }]
      });
      csvFileHandle = handle;
      const file = await csvFileHandle.getFile();
      const text = await file.text();
      const rows = parseCsvText(text);
      if (rows.length > 0) {
        portfolioRows = rows;
      } else {
        await syncCsvToDisk();
      }
      renderPortfolioTable();
      updateCsvStatus(`已綁定本地檔案：${file.name}（雙向即時寫入啟用）`, true);
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn("showOpenFilePicker failed, falling back to input:", err);
    }
  }

  const fallbackInput = el('csvFileInput');
  if (fallbackInput) fallbackInput.click();
}

async function createNewCsvFile() {
  if ('showSaveFilePicker' in window && window.isSecureContext) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'fx_portfolio.csv',
        types: [{ description: 'CSV 持倉資料庫', accept: { 'text/csv': ['.csv'] } }]
      });
      csvFileHandle = handle;
      await syncCsvToDisk();
      updateCsvStatus(`已建立並綁定：${handle.name}（雙向即時寫入啟用）`, true);
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }
  exportCsvDownload();
}

function exportCsvDownload() {
  const blob = new Blob([serializeCsv()], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fx_portfolio.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  updateCsvStatus("已匯出 fx_portfolio.csv（提示：透過 http://localhost 開啟可自動覆寫原檔）", false);
}

function calcSwapBreakEven(row) {
  const isJpy = row.pair.includes("JPY");
  const contractSize = 100000;
  const quoteToUsd = isJpy ? (1 / (row.current || 150)) : 1.0;
  const usdPerPriceUnit = row.lots * contractSize * quoteToUsd;
  if (usdPerPriceUnit <= 0) return row.entry;

  const dir = row.side === "BUY" ? 1 : -1;
  const bePrice = row.entry - (row.swap / (dir * usdPerPriceUnit));
  const decimals = isJpy ? 3 : 5;
  return bePrice.toFixed(decimals);
}

function calcFloatingUsd(row) {
  const isJpy = row.pair.includes("JPY");
  const contractSize = 100000;
  const quoteToUsd = isJpy ? (1 / (row.current || 150)) : 1.0;
  const dir = row.side === "BUY" ? 1 : -1;
  const rawPnl = (row.current - row.entry) * dir * row.lots * contractSize * quoteToUsd;
  return rawPnl + (row.swap || 0);
}

function renderPortfolioTable() {
  const tbody = el('pfTbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  portfolioRows.forEach((row) => {
    const isJpy = row.pair.includes("JPY");
    const step = isJpy ? "0.001" : "0.00001";
    const bePrice = calcSwapBreakEven(row);
    const netUsd = calcFloatingUsd(row);
    const pnlCls = netUsd >= 0 ? "pnl-pos" : "pnl-neg";

    const tr = document.createElement('tr');
    tr.dataset.id = String(row.id);
    tr.innerHTML = `
      <td><input type="text" data-col="pair" value="${row.pair}" style="font-weight:800;text-transform:uppercase;width:72px"/></td>
      <td>
        <select data-col="side" style="width:66px;font-weight:700;color:${row.side === 'BUY' ? '#157a4e' : '#c0392b'}">
          <option value="BUY" ${row.side === 'BUY' ? 'selected' : ''}>BUY</option>
          <option value="SELL" ${row.side === 'SELL' ? 'selected' : ''}>SELL</option>
        </select>
      </td>
      <td><input type="number" step="0.01" min="0.01" data-col="lots" value="${row.lots}" style="width:62px"/></td>
      <td><input type="number" step="${step}" data-col="entry" value="${row.entry}" style="width:86px"/></td>
      <td><input type="number" step="${step}" data-col="current" value="${row.current}" style="width:86px"/></td>
      <td><input type="number" step="0.01" data-col="swap" value="${row.swap}" style="width:68px"/></td>
      <td class="num" style="color:#1e4f80">${bePrice}</td>
      <td class="num ${pnlCls}">${netUsd >= 0 ? '+' : ''}${netUsd.toFixed(2)}</td>
      <td><input type="text" data-col="notes" value="${row.notes || ''}" placeholder="備註" style="width:95px"/></td>
      <td><button type="button" class="btn sm danger" data-action="delete">刪除</button></td>
    `;

    tr.querySelectorAll('input, select').forEach(ctrl => {
      ctrl.addEventListener('change', async () => {
        const col = ctrl.dataset.col;
        if (col === 'pair') row.pair = ctrl.value.trim().toUpperCase();
        else if (col === 'side') row.side = ctrl.value;
        else if (col === 'lots') row.lots = parseFloat(ctrl.value) || 0.01;
        else if (col === 'entry') {
          const val = parseFloat(ctrl.value);
          if (!Number.isNaN(val) && val > 0) row.entry = val;
        }
        else if (col === 'current') {
          const val = parseFloat(ctrl.value);
          if (!Number.isNaN(val) && val > 0) row.current = val;
        }
        else if (col === 'swap') row.swap = parseFloat(ctrl.value) || 0;
        else if (col === 'notes') row.notes = ctrl.value.trim();

        renderPortfolioTable();
        await syncCsvToDisk();
      });
    });

    tr.querySelector('[data-action="delete"]').addEventListener('click', async () => {
      portfolioRows = portfolioRows.filter(item => item.id !== row.id);
      renderPortfolioTable();
      await syncCsvToDisk();
    });

    tbody.appendChild(tr);
  });
}

async function appendNewPortfolioRecord() {
  const addRow = el('pfAddRow');
  if (!addRow) return;

  const pairEl = addRow.querySelector('[data-new="pair"]');
  const sideEl = addRow.querySelector('[data-new="side"]');
  const lotsEl = addRow.querySelector('[data-new="lots"]');
  const entryEl = addRow.querySelector('[data-new="entry"]');
  const currentEl = addRow.querySelector('[data-new="current"]');
  const swapEl = addRow.querySelector('[data-new="swap"]');
  const notesEl = addRow.querySelector('[data-new="notes"]');

  const pair = (pairEl.value || "").trim().toUpperCase();
  const side = sideEl.value === "SELL" ? "SELL" : "BUY";
  const lots = parseFloat(lotsEl.value);
  const entry = parseFloat(entryEl.value);
  const currentRaw = parseFloat(currentEl.value);
  const swap = parseFloat(swapEl.value);
  const notes = (notesEl.value || "").trim();

  if (!pair) {
    alert("請輸入貨幣對（例如 GBPCHF 或 CADJPY）。");
    pairEl.focus();
    return;
  }
  if (Number.isNaN(entry) || entry <= 0) {
    alert("請輸入有效的開倉價（Entry Price，必須大於 0）。");
    entryEl.focus();
    return;
  }

  const newRecord = {
    id: Date.now(),
    pair,
    side,
    lots: (!Number.isNaN(lots) && lots > 0) ? lots : 0.10,
    entry,
    current: (!Number.isNaN(currentRaw) && currentRaw > 0) ? currentRaw : entry,
    swap: !Number.isNaN(swap) ? swap : 0,
    notes
  };

  portfolioRows.push(newRecord);

  pairEl.value = "";
  lotsEl.value = "0.10";
  entryEl.value = "";
  currentEl.value = "";
  swapEl.value = "0";
  notesEl.value = "";

  renderPortfolioTable();
  await syncCsvToDisk();
}

function initPortfolioAndCsv() {
  const savedBackup = localStorage.getItem('fx_portfolio_backup_csv');
  if (savedBackup) {
    const parsed = parseCsvText(savedBackup);
    if (parsed.length > 0) portfolioRows = parsed;
  }

  renderPortfolioTable();

  el('btnBindCsv')?.addEventListener('click', bindLocalCsvFile);
  el('btnNewCsv')?.addEventListener('click', createNewCsvFile);
  el('btnExportCsv')?.addEventListener('click', exportCsvDownload);
  el('btnAddPfRow')?.addEventListener('click', appendNewPortfolioRecord);

  el('pfAddRow')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      appendNewPortfolioRecord();
    }
  });

  el('csvFileInput')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = parseCsvText(String(reader.result || ""));
      if (rows.length > 0) {
        portfolioRows = rows;
        localStorage.setItem('fx_portfolio_backup_csv', serializeCsv());
        renderPortfolioTable();
        updateCsvStatus(`已載入 ${file.name}（唯讀模式：請改用 http://localhost 開啟以啟用自動寫回）`, false);
      } else {
        alert("CSV 格式無法識別，請確認包含 pair,side,lots,entry 欄位。");
      }
    };
    reader.readAsText(file);
  });
}

/* ============================================================================
   24-HOUR CYCLE WHEEL, MARKET STATE & AI BRIEFING ENGINE
   ============================================================================ */
const ST = { day: 0, hour: 0, live: true };
function nowHkt() { const n = new Date(); return new Date(n.getTime() + n.getTimezoneOffset() * 60000 + 8 * 3600000); }
function hktH(d) { return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600; }
function segIndex(h) {
  const hn = ((h % 24) + 24) % 24;
  for (let i = 0; i < WEDGES.length; i++) {
    if (hn >= WEDGES[i].s && hn < WEDGES[i].e) return i;
  }
  return 0;
}

function marketState(day, hour) {
  const m = hour * 60;
  if (day === 0) return { st:'closed', label:'週末休市（星期日）', note:'全球現貨外匯整日封盤，週日 17:00 ET（＝星期一 06:00 HKT）才重開。', reopen:'星期一 06:00 HKT 開市' };
  if (day === 1 && m < 360) return { st:'closed', label:'週末休市（開市前夕）', note:'尚未進入本週交易時段，星期一 06:00 HKT 才正式開市。', reopen:'今日 06:00 HKT 開市' };
  if (day === 6 && m >= 360) return { st:'closed', label:'週末休市（星期六）', note:'週五紐約已於星期六 06:00 HKT 收市，現貨外匯進入週末封盤。', reopen:'下星期一 06:00 HKT 開市' };
  if (day === 6) return { st:'open', label:'開市中（星期五尾盤）', note:'仍在週五交易時段內，06:00 HKT 封盤後進入週末。', reopen:'星期六 06:00 HKT 封盤' };
  if (m >= 300 && m < 360) return { st:'rollover', label:'日結換日 · 流動性極低', note:'紐約已收市、下一交易日未開市，為每日換日（Rollover）低谷，點差極闊。', reopen:'06:00 HKT 進入下一交易日' };
  return { st:'open', label:'開市中', note:'正常交易時段，流動性由各主要金融中心輪替。', reopen:'—' };
}

function tradingDayNo(day, hour) {
  const m = hour * 60;
  if (day === 6 && m < 360) return '第 5 日（星期五尾盤）';
  if (day === 1 && m < 360) return '休市（開市前夕）';
  if (day === 0 || (day === 6 && m >= 360)) return '週末休市';
  return `第 ${day} 日`;
}

const elayer = el('eventLayer');
function evMarker(h, cat, title, detail, dateLabel, recur, lane) {
  const c = CAT[cat], a = (h / 24) * 360, rad = (a - 90) * Math.PI / 180, r = 398 + lane * 9.5;
  const x = 400 + r * Math.cos(rad), y = 400 + r * Math.sin(rad);
  const x2 = 400 + 392 * Math.cos(rad), y2 = 400 + 392 * Math.sin(rad);
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('class', 'ev'); g.setAttribute('data-cat', cat); g.style.cursor = 'pointer';
  const inner = recur
    ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.3" fill="#fff" stroke="${c.c}" stroke-width="2.2"/>`
    : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${c.c}" stroke="#fff" stroke-width="1.8"/>`;
  g.innerHTML = `<line x1="${x2.toFixed(1)}" y1="${y2.toFixed(1)}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${c.c}" stroke-width="1.6" opacity="0.65"/>` + inner;
  g.addEventListener('mousemove', e => showTip(e, (recur ? '⟳ ' : '● ') + c.zh + '｜' + title, detail + (dateLabel ? ` <span style="opacity:.78">${dateLabel}</span>` : '')));
  g.addEventListener('mouseleave', hideTip);
  g.addEventListener('click', () => { ST.hour = h; ST.live = false; setScrub(w.s * 60); render(); });
  elayer.appendChild(g);
}

function buildEventLayer() {
  if (!elayer) return;
  elayer.innerHTML = '';
  const all = [
    ...EVENTS.map(v => ({ h:v.h, cat:v.cat, t:v.t, x:v.x, d:v.d + ' ' + hhmm(v.h), recur:false })),
    ...RECUR.map(v => ({ h:v.h, cat:v.cat, t:v.t, x:v.x, d:'每日重複 · ' + hhmm(v.h), recur:true })),
    ...GEO_STAND.map(v => ({ h:v.h, cat:v.cat, t:v.t, x:v.x, d:'常設風險窗口 · ' + hhmm(v.h), recur:true }))
  ];
  const gr = {};
  all.forEach(v => { const k = Math.round(v.h * 60); (gr[k] = gr[k] || []).push(v); });
  Object.keys(gr).forEach(k => gr[k].forEach((v, i) => evMarker(v.h, v.cat, v.t, v.x, v.d, v.recur, i)));
  applyLayers();
}

function applyLayers() {
  document.querySelectorAll('.ev').forEach(g => { g.style.display = ACTIVE.has(g.dataset.cat) ? '' : 'none'; });
}

const tip = el('tip');
function showTip(e, title, detail) {
  const wr = el('wheelWrap').getBoundingClientRect();
  tip.innerHTML = '<b>' + title + '</b> ' + detail;
  tip.style.opacity = '1';
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  let x = e.clientX - wr.left + 14, y = e.clientY - wr.top + 12;
  if (x + tw > wr.width) x = e.clientX - wr.left - tw - 14;
  if (y + th > wr.height) y = wr.height - th - 6;
  tip.style.left = Math.max(4, x) + 'px';
  tip.style.top = Math.max(4, y) + 'px';
}
function hideTip() { if (tip) tip.style.opacity = '0'; }

function drawNow(h) {
  const a = (h / 24) * 360, rad = (a - 90) * Math.PI / 180;
  const x1 = 400 + 170 * Math.cos(rad), y1 = 400 + 170 * Math.sin(rad);
  const x2 = 400 + 392 * Math.cos(rad), y2 = 400 + 392 * Math.sin(rad);
  const xm = 400 + 382 * Math.cos(rad), ym = 400 + 382 * Math.sin(rad);
  el('nowMarker').innerHTML = `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#e03a3a" stroke-width="2.4" stroke-dasharray="7 5" opacity="0.9"/>` +
    `<circle cx="${xm.toFixed(1)}" cy="${ym.toFixed(1)}" r="9" fill="#e03a3a" stroke="#fff" stroke-width="2.4"/><circle cx="${xm.toFixed(1)}" cy="${ym.toFixed(1)}" r="3.4" fill="#fff"/>`;
}

function drawPreview(h) {
  if (!ST.live) {
    const a = (h / 24) * 360, rad = (a - 90) * Math.PI / 180;
    const x1 = 400 + 170 * Math.cos(rad), y1 = 400 + 170 * Math.sin(rad);
    const x2 = 400 + 392 * Math.cos(rad), y2 = 400 + 392 * Math.sin(rad);
    const xm = 400 + 382 * Math.cos(rad), ym = 400 + 382 * Math.sin(rad);
    el('previewMarker').innerHTML = `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#c98a1e" stroke-width="2" stroke-dasharray="4 4" opacity="0.85"/>` +
      `<circle cx="${xm.toFixed(1)}" cy="${ym.toFixed(1)}" r="8.5" fill="#f2c14e" stroke="#12263f" stroke-width="2"/>`;
  } else {
    el('previewMarker').innerHTML = '';
  }
}

function arcPath(rO, rI, a1, a2) {
  const p = (r, d) => { const q = (d - 90) * Math.PI / 180; return [400 + r * Math.cos(q), 400 + r * Math.sin(q)]; };
  const p1 = p(rO, a1), p2 = p(rO, a2), p3 = p(rI, a2), p4 = p(rI, a1), lg = (a2 - a1) > 180 ? 1 : 0;
  return `M${p1[0].toFixed(2)},${p1[1].toFixed(2)} A${rO},${rO} 0 ${lg} 1 ${p2[0].toFixed(2)},${p2[1].toFixed(2)} L${p3[0].toFixed(2)},${p3[1].toFixed(2)} A${rI},${rI} 0 ${lg} 0 ${p4[0].toFixed(2)},${p4[1].toFixed(2)} Z`;
}

function drawActive(idx) {
  const w = WEDGES[idx], a1 = (w.s / 24) * 360, a2 = (w.e / 24) * 360, col = SEG_COL[w.tag];
  el('activeSeg').innerHTML = `<path d="${arcPath(390, 302, a1, a2)}" fill="none" stroke="${col}" stroke-width="5" opacity="0.55" filter="url(#act)"/>` +
    `<path d="${arcPath(170, 120, a1, a2)}" fill="${col}" opacity="0.16"/><path d="${arcPath(170, 120, a1, a2)}" fill="none" stroke="${col}" stroke-width="1.8" opacity="0.75"/>`;
  el('activeSeg').setAttribute('opacity', '1');
  document.querySelectorAll('#masterTable tbody tr').forEach(tr => {
    tr.classList.toggle('row-active', Number(tr.dataset.seg) === idx);
  });
}

function selectSeg(idx) {
  const w = WEDGES[idx], a = AI[idx];
  const ms = marketState(ST.day, ST.hour);
  const dc = DAY_CTX[ST.day];
  const closed = ms.st === 'closed';
  el('roZh').textContent = closed ? w.cl : w.zh;
  el('roEn').textContent = closed ? ('原定時段：' + w.zh + ' · 休市期間不適用') : w.en;
  const b = el('roBadge'); b.textContent = w.tzFull; b.style.background = SEG_COL[w.tag];
  el('roDay').textContent = DAY_FULL[ST.day];
  el('roHkt').textContent = PAD(w.s) + ':00 → ' + PAD(w.e) + ':00';
  el('roUtc').textContent = PAD((w.s + 16) % 24) + ':00 → ' + PAD((w.e + 16) % 24) + ':00';
  el('roEt').textContent = PAD((w.s + 13) % 24) + ':00 → ' + PAD((w.e + 13) % 24) + ':00';
  el('roState').textContent = ms.label + ' · ' + tradingDayNo(ST.day, ST.hour) + ' · ' + ms.note;
  el('roWatch').textContent = closed ? dc.t : a.now;
  el('roStrat').textContent = closed ? dc.a : a.act;
  el('roPairs').textContent = w.pr;
  el('roPills').innerHTML = ['類型：' + w.k, '時區：' + w.tzFull, '級別：' + '★'.repeat(w.hot || 1) + '☆'.repeat(3 - (w.hot || 1))]
    .map((t, i) => `<span class="pill${i === 0 ? (closed ? ' off' : ' on') : ''}">${t}</span>`).join('') +
    `<span class="pill${closed ? ' off' : (ms.st === 'rollover' ? ' warn' : ' on')}">${ms.label}</span>`;
  drawActive(idx);
  renderAI(idx);
}

function hhmm(v) { const h = Math.floor(v), m = Math.round((v - h) * 60); return PAD(h) + ':' + PAD(m); }
function dayEvents(dow) { return EVENTS.filter(e => e.dow === dow).map(e => ({ h:e.h, t:e.t, x:e.x, d:e.d, c:e.cat })); }
function nearEvents(h) {
  const out = [];
  const push = (e, label) => { let dh = e.h - h; if (dh < -0.001) dh += 24; if (dh < 24) out.push({ e, label, dh }); };
  EVENTS.forEach(e => push(e, e.d));
  RECUR.forEach(e => push(e, '每日重複'));
  GEO_STAND.forEach(e => push(e, '常設背景'));
  out.sort((a, b) => a.dh - b.dh || (b.e.imp || 1) - (a.e.imp || 1));
  const cnt = {}, keep = [];
  for (const o of out) {
    const k = Math.floor(o.e.h); cnt[k] = cnt[k] || 0;
    if (cnt[k] < 2) { cnt[k]++; keep.push(o); }
    if (keep.length >= 6) break;
  }
  return keep;
}

function renderAI(idx) {
  const w = WEDGES[idx], a = AI[idx], h = ST.hour;
  const d = nowHkt(), ms = marketState(ST.day, h), dc = DAY_CTX[ST.day];
  const closed = ms.st === 'closed';
  el('aiTitle').textContent = closed
    ? `${DAY_FULL[ST.day]} 休市 · ${w.cl} HKT ${PAD(w.s)}:00–${PAD(w.e)}:00${ST.live ? '（現在）' : '（預覽）'}`
    : `${DAY_FULL[ST.day]} ${w.zh} HKT ${PAD(w.s)}:00–${PAD(w.e)}:00${ST.live ? '（現在）' : '（預覽）'}`;
  const st = el('aiStatus');
  st.textContent = ms.label;
  st.className = 'ai-status ' + (closed ? 'st-closed' : (ms.st === 'rollover' ? 'st-roll' : 'st-open'));
  el('aiStamp').innerHTML = `系統時間：HKT ${PAD(d.getHours())}:${PAD(d.getMinutes())} 依據 FX1 三時段系統`;

  el('aiDay').querySelector('.dh').innerHTML = '📅 ' + dc.n + ' · ' + dc.tag;
  el('aiDay').querySelector('.dt').textContent = tradingDayNo(ST.day, h);
  el('aiDayTxt').textContent = dc.t;
  el('aiDay').style.borderLeftColor = closed ? '#8496ab' : '#2f6fb0';

  ['bxNow', 'bxGeo', 'bxCb', 'bxData'].forEach(id => el(id).className = 'ai-box' + (closed ? ' closed' : ''));
  el('aiNow').textContent = closed
    ? `${ms.note} 市場維持在休市前最後報價（${SNAP.snap}）。`
    : `${a.now} 【快照】${SNAP.snap}`;
  el('aiGeo').textContent = a.geo;
  el('aiCb').textContent = closed ? `${a.cb}（休市期間政策預期仍隨消息發酵。）` : a.cb;

  const inHour = [];
  EVENTS.forEach(e => { if (e.dow === ST.day && Math.floor(e.h) === Math.floor(h)) inHour.push({ t:e.t, x:e.x, l:e.d }); });
  RECUR.forEach(e => { if (Math.floor(e.h) === Math.floor(h)) inHour.push({ t:e.t, x:e.x, l:'每日重複' }); });
  GEO_STAND.forEach(e => { if (Math.floor(e.h) === Math.floor(h)) inHour.push({ t:e.t, x:e.x, l:'常設背景' }); });
  const dayEv = dayEvents(ST.day);

  if (closed) {
    el('aiData').textContent = `休市期間無經濟數據公布（${dc.k}）。本週關鍵數據：` + EVENTS.slice(0, 4).map(e => `${e.d} ${hhmm(e.h)} ${e.t}`).join('；') + '。';
  } else if (inHour.length) {
    el('aiData').textContent = '【本時段事件】' + inHour.map(x => `◉ ${x.t}（${x.l}）：${x.x}`).join(' ｜ ') + ' ' + a.brk;
  } else {
    el('aiData').textContent = a.brk + (dayEv.length ? ` 【${dc.n}日程】` + dayEv.map(e => `${hhmm(e.h)} ${e.t}`).join('；') : '');
  }

  el('aiAct').innerHTML = '<b>本時段操作重點 ▸</b> ' + (closed ? dc.a : a.act);
  const near = nearEvents(h);
  const up = near.map(x => `◉ ${hhmm(x.e.h)} ${x.e.t}（${CAT[x.e.cat].zh}${x.label !== '每日重複' && x.label !== '常設背景' ? '·' + x.label : ''}）`).join(' ｜ ');
  el('aiUp').innerHTML = '<b>接下來 24 小時 ▸</b> ' + (up || '無重大事件') + (closed ? ' ｜ ' + ms.reopen : '');

  window.__brief = `【外匯 24H 市場簡報｜${DAY_FULL[ST.day]} ${closed ? w.cl + '（休市）' : w.zh} HKT ${PAD(w.s)}:00–${PAD(w.e)}:00｜${ms.label}】\n` +
    `◆ 市場狀態：${ms.label}（${tradingDayNo(ST.day, h)}）\n` +
    `◆ 市場現況：${el('aiNow').textContent}\n` +
    `◆ 本時段操作重點：${closed ? dc.a : a.act}`;
}

/* Layer Chips */
document.querySelectorAll('.chip[data-cat]').forEach(ch => {
  ch.addEventListener('click', () => {
    const c = ch.dataset.cat;
    if (ACTIVE.has(c)) {
      ACTIVE.delete(c); ch.classList.add('off'); ch.classList.remove('on');
      ch.style.background = ''; ch.style.color = ''; ch.querySelector('i').style.background = CAT[c].c;
    } else {
      ACTIVE.add(c); ch.classList.remove('off'); ch.classList.add('on');
      ch.style.background = CAT[c].c; ch.style.color = '#fff'; ch.querySelector('i').style.background = '#fff';
    }
    applyLayers();
  });
});

/* Day Buttons */
const dayBtns = el('dayBtns');
DAY_ZH.forEach((z, i) => {
  const b = document.createElement('button');
  b.textContent = z; b.dataset.d = i;
  b.title = DAY_FULL[i] + (i === 0 || i === 6 ? '（週末休市）' : '（交易日）');
  b.addEventListener('click', () => { ST.day = i; ST.live = false; syncDayBtns(); render(); });
  dayBtns.appendChild(b);
});
function syncDayBtns() {
  [...dayBtns.children].forEach((b, i) => {
    b.classList.toggle('on', i === ST.day);
    b.classList.toggle('off', i === 0 || i === 6);
  });
}

/* Wedge & Master Table Interactions */
document.querySelectorAll('.wedge').forEach(g => {
  const i = +g.dataset.i, w = WEDGES[i], a = AI[i];
  g.style.cursor = 'pointer';
  g.addEventListener('mouseenter', () => g.setAttribute('opacity', '0.74'));
  g.addEventListener('mouseleave', () => { g.removeAttribute('opacity'); hideTip(); });
  g.addEventListener('mousemove', e => {
    const ms = marketState(ST.day, ST.hour), cl = ms.st === 'closed';
    showTip(e, `${cl ? w.cl : w.zh}｜${DAY_FULL[ST.day]} HKT ${PAD(w.s)}:00–${PAD(w.e)}:00`,
      `<b>${ms.label}</b> — ${cl ? DAY_CTX[ST.day].t : a.now}<br><b>操作 ▸</b> ${cl ? DAY_CTX[ST.day].a : a.act}`);
  });
  g.addEventListener('click', () => { ST.hour = w.s; ST.live = false; setScrub(w.s * 60); render(); });
});

document.querySelectorAll('#masterTable tbody tr').forEach(tr => {
  tr.style.cursor = 'pointer';
  tr.addEventListener('click', () => {
    const idx = Number(tr.dataset.seg);
    const w = WEDGES[idx];
    ST.hour = w.s; ST.live = false; setScrub(w.s * 60); render();
    el('rightScroll').scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* Scrubber & Controls */
function setScrub(mins) {
  const m = Math.round(mins);
  el('scrub').value = m;
  el('scrubLbl').textContent = (ST.live ? '現在 ' : '') + PAD(Math.floor(m / 60)) + ':' + PAD(m % 60);
}
el('scrub').addEventListener('input', () => {
  const h = parseFloat(el('scrub').value) / 60; ST.hour = h; ST.live = false;
  el('scrubLbl').textContent = PAD(Math.floor(h)) + ':' + PAD(Math.round((h % 1) * 60));
  render();
});
el('btnNow').addEventListener('click', () => { ST.live = true; syncNow(); });
el('btnRefresh').addEventListener('click', () => { render(); });
el('btnCopy').addEventListener('click', async () => {
  const b = el('btnCopy'), t = b.textContent;
  try { await navigator.clipboard.writeText(window.__brief || ''); b.textContent = '✓ 已複製'; }
  catch (e) { b.textContent = '複製失敗'; }
  setTimeout(() => b.textContent = t, 1800);
});

/* Main Loop */
let lastHour = -1;
function render() { selectSeg(segIndex(ST.hour)); drawPreview(ST.hour); }
function syncNow() {
  const d = nowHkt(), h = hktH(d);
  drawNow(h);
  const ms = marketState(d.getDay(), h);
  const chip = el('nowChip');
  chip.className = 'nowchip ' + (ms.st === 'closed' ? 'closed' : (ms.st === 'rollover' ? 'roll' : 'open'));
  el('nowTxt').textContent = `現在香港時間 ${DAY_FULL[d.getDay()]} ${PAD(d.getHours())}:${PAD(d.getMinutes())} · ${ms.label}`;
  const nx = new Date(d.getTime() + (60 - d.getMinutes()) * 60000);
  el('nextTxt').textContent = `下次自動更新：${PAD(nx.getHours())}:00（每小時整點重生成簡報）`;
  if (ST.live) {
    ST.day = d.getDay(); ST.hour = h;
    if (d.getHours() !== lastHour) { lastHour = d.getHours(); syncDayBtns(); }
    setScrub(d.getHours() * 60 + d.getMinutes());
    render();
  } else {
    setScrub(ST.hour * 60);
    drawPreview(ST.hour);
  }
}

/* Boot */
initSplitResizer();
initPortfolioAndCsv();
buildEventLayer();
syncDayBtns();
syncNow();
setInterval(syncNow, 20000);
window.addEventListener('resize', hideTip);
