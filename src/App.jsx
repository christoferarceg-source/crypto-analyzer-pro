import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
:root {
  --bg:#050810; --panel:#0a0f1e; --panel2:#0d1425; --border:#1a2340;
  --accent:#00f5c4; --accent2:#7b61ff; --buy:#00e676; --sell:#ff3d71; --hold:#ffb300;
  --muted:#4a5880; --text:#c8d4f0; --white:#eef2ff;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);font-family:'Space Mono',monospace;color:var(--text);}
.app{min-height:100vh;background:var(--bg);background-image:radial-gradient(ellipse 80% 40% at 50% -10%,rgba(0,245,196,.07) 0%,transparent 60%);}
.header{display:flex;align-items:center;justify-content:space-between;padding:13px 22px;border-bottom:1px solid var(--border);background:rgba(10,15,30,.97);position:sticky;top:0;z-index:200;backdrop-filter:blur(12px);gap:12px;flex-wrap:wrap;}
.logo{font-family:'Syne',sans-serif;font-weight:800;font-size:1.15rem;color:var(--white);letter-spacing:-.02em;}
.logo span{color:var(--accent);}
.nav{display:flex;gap:3px;}
.nav-btn{font-family:'Space Mono',monospace;font-size:.62rem;padding:6px 12px;border-radius:6px;border:1px solid var(--border);background:transparent;color:var(--muted);cursor:pointer;transition:all .2s;letter-spacing:.04em;}
.nav-btn:hover{color:var(--text);}
.nav-btn.active{background:rgba(0,245,196,.08);color:var(--accent);border-color:rgba(0,245,196,.3);}
.header-right{display:flex;align-items:center;gap:10px;}
.pulse-dot{width:5px;height:5px;border-radius:50%;background:var(--accent);animation:pulse 2s infinite;display:inline-block;margin-right:4px;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.live-badge{font-size:.57rem;color:var(--muted);}
.fg-widget{display:flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid var(--border);border-radius:7px;background:var(--panel);}
.fg-label{font-size:.55rem;color:var(--muted);margin-bottom:2px;}
.fg-val{font-size:.72rem;font-weight:700;}
.stats-bar{display:flex;overflow-x:auto;border-bottom:1px solid var(--border);background:rgba(5,8,16,.8);}
.stat-item{flex:1;min-width:110px;padding:9px 14px;border-right:1px solid var(--border);text-align:center;}
.stat-label{font-size:.53rem;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;}
.stat-value{font-size:.88rem;font-weight:700;color:var(--white);}
.stat-value.up{color:var(--buy);} .stat-value.down{color:var(--sell);}
.controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 22px;border-bottom:1px solid var(--border);background:rgba(10,15,30,.6);}
select{background:var(--panel);border:1px solid var(--border);color:var(--text);font-family:'Space Mono',monospace;font-size:.65rem;padding:5px 22px 5px 8px;border-radius:6px;cursor:pointer;outline:none;appearance:none;}
.sel-wrap{position:relative;} .sel-wrap::after{content:'▾';position:absolute;right:7px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none;font-size:.62rem;}
.btn{font-family:'Space Mono',monospace;font-size:.62rem;padding:6px 12px;border-radius:6px;border:1px solid;cursor:pointer;transition:all .2s;letter-spacing:.04em;}
.btn-primary{background:var(--accent);color:#000;border-color:var(--accent);font-weight:700;}
.btn-primary:hover{background:#00d4a8;box-shadow:0 0 16px rgba(0,245,196,.28);}
.btn-primary:disabled{opacity:.5;cursor:not-allowed;}
.btn-ghost{background:transparent;color:var(--muted);border-color:var(--border);}
.btn-ghost.active{color:var(--accent);border-color:rgba(0,245,196,.4);background:rgba(0,245,196,.05);}
.filter-group{display:flex;gap:3px;margin-left:auto;}
.summary-chips{display:flex;gap:5px;flex-wrap:wrap;padding:8px 22px;border-bottom:1px solid var(--border);background:rgba(0,0,0,.15);}
.chip{font-size:.58rem;padding:3px 8px;border-radius:20px;border:1px solid;}
.chip-buy{background:rgba(0,230,118,.07);color:var(--buy);border-color:rgba(0,230,118,.2);}
.chip-sell{background:rgba(255,61,113,.07);color:var(--sell);border-color:rgba(255,61,113,.2);}
.chip-hold{background:rgba(255,179,0,.07);color:var(--hold);border-color:rgba(255,179,0,.2);}
.chip-info{background:rgba(0,245,196,.07);color:var(--accent);border-color:rgba(0,245,196,.2);}
.main{padding:16px 22px;display:flex;flex-direction:column;gap:16px;}
.table-panel{background:var(--panel);border:1px solid var(--border);border-radius:10px;overflow:hidden;}
.panel-hdr{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;border-bottom:1px solid var(--border);background:rgba(0,245,196,.025);}
.panel-title{font-family:'Syne',sans-serif;font-weight:700;font-size:.8rem;color:var(--white);}
.badge{font-size:.57rem;background:rgba(0,245,196,.1);color:var(--accent);border:1px solid rgba(0,245,196,.2);padding:2px 7px;border-radius:20px;}
.scrollable{overflow-x:auto;}
table{width:100%;border-collapse:collapse;}
th{font-size:.57rem;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);padding:8px 11px;text-align:left;border-bottom:1px solid var(--border);background:rgba(0,0,0,.2);cursor:pointer;white-space:nowrap;}
th:hover{color:var(--accent);}
td{padding:8px 11px;font-size:.66rem;border-bottom:1px solid rgba(26,35,64,.4);vertical-align:middle;white-space:nowrap;}
tr:last-child td{border-bottom:none;}
tr{cursor:pointer;transition:background .1s;}
tr:hover td{background:rgba(0,245,196,.025);}
tr.selected td{background:rgba(0,245,196,.05);}
.coin-info{display:flex;align-items:center;gap:7px;}
.coin-img{width:22px;height:22px;border-radius:50%;}
.coin-name{color:var(--white);font-weight:700;font-size:.68rem;}
.coin-sym{color:var(--muted);font-size:.57rem;}
.change.up{color:var(--buy);font-weight:700;} .change.down{color:var(--sell);font-weight:700;}
.signal{display:inline-flex;align-items:center;gap:3px;font-size:.58rem;font-weight:700;padding:2px 7px;border-radius:3px;text-transform:uppercase;letter-spacing:.06em;}
.signal.BUY{background:rgba(0,230,118,.1);color:var(--buy);border:1px solid rgba(0,230,118,.25);}
.signal.SELL{background:rgba(255,61,113,.1);color:var(--sell);border:1px solid rgba(255,61,113,.25);}
.signal.HOLD{background:rgba(255,179,0,.1);color:var(--hold);border:1px solid rgba(255,179,0,.25);}
.risk{display:inline-block;font-size:.57rem;font-weight:700;padding:2px 6px;border-radius:3px;text-transform:uppercase;}
.risk.LOW{background:rgba(0,230,118,.09);color:var(--buy);}
.risk.MEDIUM{background:rgba(255,179,0,.09);color:var(--hold);}
.risk.HIGH{background:rgba(255,61,113,.09);color:var(--sell);}
.score-bar{display:flex;align-items:center;gap:5px;}
.score-track{width:46px;height:3px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden;}
.score-fill{height:100%;border-radius:2px;}
.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
@media(max-width:860px){.detail-grid{grid-template-columns:1fr;}}
.card{background:var(--panel);border:1px solid var(--border);border-radius:10px;overflow:hidden;}
.tab-row{display:flex;border-bottom:1px solid var(--border);overflow-x:auto;}
.tab{padding:8px 12px;font-size:.6rem;cursor:pointer;color:var(--muted);border-bottom:2px solid transparent;transition:all .2s;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;}
.tab.active{color:var(--accent);border-bottom-color:var(--accent);}
.tv-container{background:#131722;height:320px;}
.tv-container iframe{width:100%;height:100%;border:none;}
.metrics-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border);}
.metric-cell{background:var(--panel);padding:11px 13px;}
.metric-label{font-size:.57rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px;}
.metric-value{font-size:.82rem;font-weight:700;color:var(--white);}
.metric-sub{font-size:.57rem;color:var(--muted);margin-top:2px;}
.ai-box{margin:12px;padding:11px 13px;background:rgba(123,97,255,.05);border:1px solid rgba(123,97,255,.18);border-radius:7px;}
.ai-label{font-size:.57rem;color:var(--accent2);text-transform:uppercase;letter-spacing:.09em;margin-bottom:6px;display:flex;align-items:center;gap:5px;}
.ai-text{font-size:.66rem;line-height:1.75;color:var(--text);}
.oc-row{display:flex;align-items:center;justify-content:space-between;padding:8px 13px;border-bottom:1px solid rgba(26,35,64,.4);font-size:.66rem;}
.oc-row:last-child{border-bottom:none;}
.oc-name{color:var(--muted);} .oc-val{color:var(--white);font-weight:700;}
.oc-bar-wrap{width:55px;height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin:0 7px;}
.oc-bar{height:100%;border-radius:2px;}
.hint{font-size:.57rem;color:var(--muted);padding:2px 13px 7px;font-style:italic;}
.score-section{padding:16px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;}
.donut-wrap{position:relative;flex-shrink:0;}
.donut-label{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.donut-score{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:800;}
.donut-text{font-size:.5rem;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;}
.sb-row{display:flex;align-items:center;justify-content:space-between;gap:6px;}
.sb-label{font-size:.58rem;color:var(--muted);flex-shrink:0;width:88px;}
.sb-track{flex:1;height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;}
.sb-fill{height:100%;border-radius:2px;}
.sb-val{font-size:.58rem;color:var(--white);width:22px;text-align:right;}
.sent-gauge{padding:16px;display:flex;flex-direction:column;align-items:center;gap:10px;}
.sent-score-big{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;margin-top:-6px;}
.sent-dir{font-size:.62rem;font-weight:700;padding:3px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:.07em;}
.sent-factors{width:100%;display:flex;flex-direction:column;gap:5px;padding:0 13px 13px;}
.sf-row{display:flex;align-items:center;gap:7px;font-size:.63rem;}
.sf-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}
.heatmap-wrap{padding:16px;}
.heatmap-grid{display:flex;flex-wrap:wrap;gap:4px;}
.hm-cell{border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:transform .15s;border:1px solid rgba(255,255,255,.05);overflow:hidden;}
.hm-cell:hover{transform:scale(1.05);z-index:10;position:relative;}
.hm-sym{font-weight:700;color:rgba(255,255,255,.9);}
.hm-chg{color:rgba(255,255,255,.8);}
.legend-bar{height:5px;width:180px;border-radius:3px;background:linear-gradient(90deg,#ff3d71,#ffb300,#00e676);}
.portfolio-wrap{padding:16px;display:flex;flex-direction:column;gap:14px;}
.add-form{display:flex;gap:7px;flex-wrap:wrap;align-items:flex-end;padding:13px;background:rgba(0,0,0,.2);border:1px solid var(--border);border-radius:8px;}
.form-group{display:flex;flex-direction:column;gap:3px;}
.form-label{font-size:.56rem;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;}
input[type=number],input[type=text]{background:var(--panel2);border:1px solid var(--border);color:var(--text);font-family:'Space Mono',monospace;font-size:.65rem;padding:6px 9px;border-radius:6px;outline:none;}
input:focus{border-color:var(--accent);}
.portfolio-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;}
@media(max-width:650px){.portfolio-stats{grid-template-columns:repeat(2,1fr);}}
.p-stat{background:var(--panel2);border:1px solid var(--border);border-radius:7px;padding:11px 13px;}
.p-stat-label{font-size:.55rem;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;}
.p-stat-value{font-size:.95rem;font-weight:700;color:var(--white);}
.portfolio-body{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
@media(max-width:650px){.portfolio-body{grid-template-columns:1fr;}}
.ptable{background:var(--panel2);border:1px solid var(--border);border-radius:8px;overflow:hidden;}
.pie-card{background:var(--panel2);border:1px solid var(--border);border-radius:8px;padding:14px;display:flex;flex-direction:column;align-items:center;gap:10px;}
.pie-legend{width:100%;display:flex;flex-direction:column;gap:4px;}
.pie-row{display:flex;align-items:center;gap:6px;font-size:.6rem;}
.pie-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.pie-name{color:var(--text);flex:1;}
.pie-pct{color:var(--muted);}
.del-btn{background:none;border:none;color:var(--muted);cursor:pointer;font-size:.7rem;padding:2px 4px;}
.del-btn:hover{color:var(--sell);}
.empty-port{text-align:center;padding:28px;color:var(--muted);font-size:.68rem;line-height:2.2;}
.chat-wrap{display:flex;flex-direction:column;height:560px;}
.chat-context{padding:7px 13px;background:rgba(123,97,255,.05);border-bottom:1px solid rgba(123,97,255,.15);font-size:.58rem;color:var(--accent2);display:flex;align-items:center;gap:5px;flex-wrap:wrap;}
.chat-messages{flex:1;overflow-y:auto;padding:13px;display:flex;flex-direction:column;gap:9px;}
.msg{display:flex;flex-direction:column;gap:3px;max-width:82%;}
.msg.user{align-self:flex-end;align-items:flex-end;}
.msg.assistant{align-self:flex-start;align-items:flex-start;}
.msg-bubble{padding:8px 12px;border-radius:9px;font-size:.66rem;line-height:1.72;}
.msg.user .msg-bubble{background:var(--accent2);color:#fff;}
.msg.assistant .msg-bubble{background:var(--panel2);border:1px solid var(--border);color:var(--text);}
.msg-time{font-size:.53rem;color:var(--muted);}
.chat-input-row{padding:10px 13px;border-top:1px solid var(--border);display:flex;gap:7px;}
.chat-input{flex:1;background:var(--panel2);border:1px solid var(--border);color:var(--text);font-family:'Space Mono',monospace;font-size:.65rem;padding:7px 11px;border-radius:7px;outline:none;resize:none;}
.chat-input:focus{border-color:var(--accent);}
.quick-btns{display:flex;gap:4px;flex-wrap:wrap;padding:0 13px 7px;}
.quick-btn{font-family:'Space Mono',monospace;font-size:.56rem;padding:3px 8px;border-radius:20px;border:1px solid var(--border);background:rgba(0,245,196,.03);color:var(--muted);cursor:pointer;transition:all .15s;}
.quick-btn:hover{color:var(--accent);border-color:rgba(0,245,196,.3);}
.loading{display:flex;align-items:center;justify-content:center;gap:9px;padding:44px;color:var(--muted);font-size:.68rem;}
.spinner{width:16px;height:16px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite;flex-shrink:0;}
@keyframes spin{to{transform:rotate(360deg)}}
.empty{text-align:center;padding:30px;color:var(--muted);font-size:.66rem;}
.warn-box{margin:13px;padding:9px 11px;background:rgba(255,179,0,.04);border:1px solid rgba(255,179,0,.12);border-radius:7px;font-size:.58rem;color:var(--muted);line-height:1.6;}
.suggest-drop{position:absolute;top:calc(100% + 3px);left:0;z-index:60;background:var(--panel);border:1px solid var(--border);border-radius:7px;width:210px;box-shadow:0 8px 24px rgba(0,0,0,.5);}
.sug-item{display:flex;align-items:center;gap:7px;padding:7px 10px;cursor:pointer;font-size:.63rem;border-bottom:1px solid rgba(26,35,64,.4);}
.sug-item:last-child{border-bottom:none;}
.sug-item:hover{background:rgba(0,245,196,.05);}
.api-error{margin:16px 22px;padding:14px;background:rgba(255,61,113,.08);border:1px solid rgba(255,61,113,.2);border-radius:8px;color:var(--white);}
.api-error-title{font-family:'Syne',sans-serif;font-weight:700;font-size:.82rem;margin-bottom:6px;color:var(--sell);}
.api-error-text{font-size:.66rem;line-height:1.7;margin-bottom:10px;}
.api-error-code{background:rgba(0,0,0,.3);padding:6px 9px;border-radius:5px;font-size:.6rem;font-family:'Space Mono',monospace;margin-top:8px;}
::-webkit-scrollbar{width:4px;height:4px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px;}
`;

const fmt = {
  usd: n => !n&&n!==0?'—':n>=1e9?`$${(n/1e9).toFixed(2)}B`:n>=1e6?`$${(n/1e6).toFixed(2)}M`:`$${n.toLocaleString('en-US',{maximumFractionDigits:4})}`,
  pct: n => n==null?'—':`${n>=0?'+':''}${n.toFixed(2)}%`,
  num: n => n==null?'—':n.toLocaleString('en-US'),
};
const PIE_COLORS=['#00f5c4','#7b61ff','#ff6b35','#00e676','#ff3d71','#ffb300','#00b4d8','#e040fb','#76ff03','#ff4081'];
function scoreColor(s){return s>=62?'var(--buy)':s<=40?'var(--sell)':'var(--hold)';}
function heatColor(p){const c=Math.max(-12,Math.min(12,p));if(c>=0){const t=c/12;return `rgba(${Math.round(t*10)},${Math.round(130+t*100)},${Math.round(80-t*60)},${.5+t*.35})`;}else{const t=(-c)/12;return `rgba(${Math.round(180+t*75)},${Math.round(50-t*50)},${Math.round(60)},${.5+t*.35})`;}}

function calcSignal(coin){
  let s=50;
  const{price_change_percentage_24h:d1,price_change_percentage_7d_in_currency:d7,market_cap_rank:rank,total_volume:vol,market_cap:mcap,ath_change_percentage:ath,circulating_supply:circ,total_supply:tot}=coin;
  if(d1>5)s+=12;else if(d1>2)s+=7;else if(d1>0)s+=3;else if(d1<-5)s-=12;else if(d1<-2)s-=7;else if(d1<0)s-=3;
  if(d7>15)s+=14;else if(d7>5)s+=8;else if(d7>0)s+=4;else if(d7<-15)s-=14;else if(d7<-5)s-=8;else if(d7<0)s-=4;
  if(mcap&&vol){const vr=vol/mcap;if(vr>.2)s+=8;else if(vr>.1)s+=4;else if(vr<.02)s-=5;}
  if(ath&&ath>-20)s-=5;if(ath&&ath<-60)s+=6;
  if(circ&&tot&&tot>0&&circ/tot>.8)s+=5;if(rank&&rank<=10)s+=5;
  s=Math.max(0,Math.min(100,s));
  return{score:Math.round(s),signal:s>=62?'BUY':s<=40?'SELL':'HOLD'};
}
function calcRisk(coin){
  const{market_cap_rank:rank,price_change_percentage_24h:d1,price_change_percentage_7d_in_currency:d7,market_cap:mcap}=coin;
  let r=0;
  if(!mcap||mcap<1e8)r+=40;else if(mcap<1e9)r+=25;else if(mcap<10e9)r+=15;else r+=5;
  const v=(Math.abs(d1||0)+Math.abs(d7||0)/7)/2;
  if(v>8)r+=30;else if(v>4)r+=15;else r+=5;
  if(rank&&rank<=10)r-=10;else if(rank&&rank<=50)r-=5;
  r=Math.max(0,Math.min(100,r));
  return{riskScore:Math.round(r),riskLevel:r>=60?'HIGH':r>=35?'MEDIUM':'LOW'};
}

async function callClaude(messages,system=''){
  // Get API key from environment variable
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file.');
  }

  const res=await fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body:JSON.stringify({
      model:'claude-sonnet-4-20250514',
      max_tokens:1000,
      ...(system&&{system}),
      messages
    })
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: 'Unknown error' } }));
    throw new Error(error.error?.message || `API Error: ${res.status}`);
  }

  const d=await res.json();
  return d.content?.map(b=>b.text||'').join('')||'';
}

function Donut({score,size=82}){
  const r=28,circ=2*Math.PI*r,fill=(score/100)*circ,color=scoreColor(score);
  return(<div className="donut-wrap" style={{width:size,height:size}}>
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6"/>
      <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" transform="rotate(-90 40 40)" style={{transition:'stroke-dasharray .8s'}}/>
    </svg>
    <div className="donut-label"><span className="donut-score" style={{color}}>{score}</span><span className="donut-text">/100</span></div>
  </div>);
}

function TVChart({symbol}){
  const sym=`BINANCE:${symbol?.toUpperCase()}USDT`;
  const src=`https://s.tradingview.com/widgetembed/?frameElementId=tv&symbol=${encodeURIComponent(sym)}&interval=D&theme=dark&style=1&locale=es&toolbar_bg=%230a0f1e&hide_side_toolbar=0&allow_symbol_change=0&save_image=0&withdateranges=1&hideideas=1`;
  return<div className="tv-container"><iframe src={src} title="Chart" allowTransparency allow="clipboard-write"/></div>;
}

function FearGreedWidget({data}){
  if(!data)return null;
  const val=parseInt(data.value);
  const color=val>=60?'var(--buy)':val>=40?'var(--hold)':'var(--sell)';
  return(<div className="fg-widget" title="Fear & Greed — alternative.me">
    <svg width="34" height="20" viewBox="0 0 34 20">
      <path d="M2 17 A15 15 0 0 1 32 17" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M2 17 A15 15 0 0 1 32 17" fill="none" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeDasharray={`${(val/100)*47.1} 47.1`}/>
    </svg>
    <div><div className="fg-label">FEAR & GREED</div><div className="fg-val" style={{color}}>{val} · {data.value_classification}</div></div>
  </div>);
}

function PieChart({items}){
  if(!items.length)return<div className="empty">Sin datos</div>;
  const total=items.reduce((s,i)=>s+i.value,0);
  let cum=-90;const size=130,cx=65,cy=65,r=50,ir=25;
  const slices=items.map((item,i)=>{
    const pct=item.value/total,angle=pct*360;
    const sa=cum*(Math.PI/180);cum+=angle;const ea=cum*(Math.PI/180);
    const x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa),x2=cx+r*Math.cos(ea),y2=cy+r*Math.sin(ea);
    const xi1=cx+ir*Math.cos(sa),yi1=cy+ir*Math.sin(sa),xi2=cx+ir*Math.cos(ea),yi2=cy+ir*Math.sin(ea);
    const la=angle>180?1:0;
    return{path:`M${xi1} ${yi1} L${x1} ${y1} A${r} ${r} 0 ${la} 1 ${x2} ${y2} L${xi2} ${yi2} A${ir} ${ir} 0 ${la} 0 ${xi1} ${yi1}Z`,
      color:PIE_COLORS[i%PIE_COLORS.length],pct:Math.round(pct*100),name:item.name};
  });
  return(<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s,i)=><path key={i} d={s.path} fill={s.color} opacity={.88}/>)}
      <circle cx={cx} cy={cy} r={ir-2} fill="var(--panel2)"/>
    </svg>
    <div className="pie-legend">{slices.map((s,i)=>(
      <div className="pie-row" key={i}><div className="pie-dot" style={{background:s.color}}/><span className="pie-name">{s.name}</span><span className="pie-pct">{s.pct}%</span></div>
    ))}</div>
  </div>);
}

function SentimentTab({coin}){
  const[data,setData]=useState(null);const[loading,setLoading]=useState(false);const[error,setError]=useState(null);const cache=useRef({});
  useEffect(()=>{
    if(!coin)return;if(cache.current[coin.id]){setData(cache.current[coin.id]);return;}
    setLoading(true);setData(null);setError(null);
    callClaude([{role:'user',content:`Sentimiento de mercado para ${coin.name} (${coin.symbol?.toUpperCase()}):
Precio: $${coin.current_price} | 24h: ${fmt.pct(coin.price_change_percentage_24h)} | 7d: ${fmt.pct(coin.price_change_percentage_7d_in_currency)} | Rank: #${coin.market_cap_rank} | Vol/MCap: ${((coin.total_volume/coin.market_cap)*100).toFixed(1)}% | ATH dist: ${fmt.pct(coin.ath_change_percentage)}
Responde SOLO JSON: {"score":0-100,"direction":"ALCISTA|BAJISTA|NEUTRO","factors":["f1","f2","f3","f4"],"summary":"2 oraciones"}`}],
      'Analista de sentimiento cripto. Responde SOLO JSON válido sin backticks ni texto adicional.')
    .then(txt=>{
      try{const d=JSON.parse(txt.replace(/```json|```/g,'').trim());cache.current[coin.id]=d;setData(d);}
      catch{const d={score:50,direction:'NEUTRO',factors:['Error al parsear respuesta'],summary:'No se pudo obtener el análisis de sentimiento.'};cache.current[coin.id]=d;setData(d);}
    }).catch(err=>{
      setError(err.message);
      const d={score:50,direction:'NEUTRO',factors:['Error de conexión'],summary:'Error al conectar con el análisis.'};
      cache.current[coin.id]=d;setData(d);
    })
    .finally(()=>setLoading(false));
  },[coin]);
  if(loading)return<div className="loading"><div className="spinner"/>Analizando sentimiento...</div>;
  if(error)return<div className="warn-box">⚠️ Error AI: {error}</div>;
  if(!data)return null;
  const color=data.direction==='ALCISTA'?'var(--buy)':data.direction==='BAJISTA'?'var(--sell)':'var(--hold)';
  const ndeg=-90+(data.score/100)*180;
  return(<div>
    <div className="sent-gauge">
      <div style={{position:'relative',width:170,height:95}}>
        <svg width="170" height="95" viewBox="0 0 170 95">
          <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ff3d71"/><stop offset="50%" stopColor="#ffb300"/><stop offset="100%" stopColor="#00e676"/></linearGradient></defs>
          <path d="M8 85 A77 77 0 0 1 162 85" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="11" strokeLinecap="round"/>
          <path d="M8 85 A77 77 0 0 1 162 85" fill="none" stroke="url(#sg)" strokeWidth="11" strokeLinecap="round" opacity=".7"/>
          <line x1="85" y1="85" x2="85" y2="14" stroke="var(--white)" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${ndeg} 85 85)`} style={{transition:'transform .9s cubic-bezier(.34,1.56,.64,1)'}}/>
          <circle cx="85" cy="85" r="5" fill="var(--white)"/>
        </svg>
        <div style={{position:'absolute',bottom:2,left:0,right:0,display:'flex',justifyContent:'space-between',fontSize:'.5rem',color:'var(--muted)',padding:'0 5px'}}>
          <span>PÁNICO</span><span>NEUTRO</span><span>EUFORIA</span>
        </div>
      </div>
      <div className="sent-score-big" style={{color}}>{data.score}</div>
      <div className="sent-dir" style={{background:`${color}18`,color,border:`1px solid ${color}40`}}>{data.direction}</div>
      <div style={{fontSize:'.64rem',color:'var(--text)',lineHeight:1.72,textAlign:'center',padding:'0 13px'}}>{data.summary}</div>
    </div>
    <div className="sent-factors">
      <div style={{fontSize:'.56rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:5}}>Factores detectados</div>
      {(data.factors||[]).map((f,i)=>(
        <div className="sf-row" key={i}><div className="sf-dot" style={{background:i<2?color:'var(--muted)'}}/><span style={{color:'var(--text)'}}>{f}</span></div>
      ))}
    </div>
  </div>);
}

function HeatmapView({coins,onSelect}){
  const processed=useMemo(()=>coins.map(c=>({...c,...calcSignal(c),...calcRisk(c)})),[coins]);
  const maxMcap=Math.max(...processed.map(c=>c.market_cap||0));
  if(!processed.length)return<div className="loading"><div className="spinner"/>Cargando heatmap...</div>;
  return(<div className="heatmap-wrap">
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
      <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.82rem',color:'var(--white)'}}>🌡️ Heatmap del Mercado</div>
      <div style={{fontSize:'.58rem',color:'var(--muted)'}}>Tamaño = Cap. de Mercado · Color = Cambio 24h · Click = Detalle</div>
    </div>
    <div className="heatmap-grid">
      {processed.map(c=>{
        const pct=c.price_change_percentage_24h||0;
        const w=Math.sqrt((c.market_cap||0)/maxMcap);
        const sz=Math.max(58,Math.min(55+w*175,168));
        return(<div key={c.id} className="hm-cell" onClick={()=>onSelect(c)} style={{background:heatColor(pct),width:sz,height:sz*.8,padding:'5px 3px'}}>
          <img src={c.image} alt={c.name} style={{width:sz*.24,height:sz*.24,borderRadius:'50%',marginBottom:2}}/>
          <div className="hm-sym" style={{fontSize:sz*.095}}>{c.symbol?.toUpperCase()}</div>
          <div className="hm-chg" style={{fontSize:sz*.082,fontWeight:700}}>{fmt.pct(pct)}</div>
          {sz>75&&<div style={{fontSize:sz*.07,color:'rgba(255,255,255,.6)'}}>{fmt.usd(c.current_price)}</div>}
          <span className={`signal ${c.signal}`} style={{fontSize:sz*.065,padding:'1px 4px',marginTop:2}}>{c.signal}</span>
        </div>);
      })}
    </div>
    <div style={{display:'flex',alignItems:'center',gap:8,marginTop:12,fontSize:'.57rem',color:'var(--muted)'}}>
      <span>-12%</span><div className="legend-bar"/><span>+12%</span>
      <span style={{marginLeft:14}}>{processed.length} activos mostrados</span>
    </div>
  </div>);
}

function PortfolioView({coins,portfolio,setPortfolio}){
  const[search,setSearch]=useState('');const[amount,setAmount]=useState('');const[buyP,setBuyP]=useState('');const[selC,setSelC]=useState(null);
  const sugg=useMemo(()=>search.length>1?coins.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.symbol?.toLowerCase().includes(search.toLowerCase())).slice(0,6):[],[search,coins]);
  function add(){
    if(!selC||!amount||isNaN(amount))return;
    setPortfolio(p=>[...p.filter(h=>h.coinId!==selC.id),{coinId:selC.id,name:selC.name,symbol:selC.symbol?.toUpperCase(),image:selC.image,amount:parseFloat(amount),buyPrice:buyP?parseFloat(buyP):selC.current_price,currentPrice:selC.current_price}]);
    setSearch('');setAmount('');setBuyP('');setSelC(null);
  }
  const holdings=portfolio.map(h=>{
    const live=coins.find(c=>c.id===h.coinId);const cp=live?.current_price||h.currentPrice;
    const value=cp*h.amount,cost=h.buyPrice*h.amount,pnl=value-cost;
    return{...h,currentPrice:cp,value,cost,pnl,pnlPct:cost>0?(pnl/cost*100):0};
  });
  const tv=holdings.reduce((s,h)=>s+h.value,0),tc=holdings.reduce((s,h)=>s+h.cost,0),tp=tv-tc,tpp=tc>0?(tp/tc*100):0;
  return(<div className="portfolio-wrap">
    <div className="card">
      <div className="panel-hdr"><span className="panel-title">➕ Agregar Posición</span></div>
      <div className="add-form">
        <div className="form-group" style={{position:'relative'}}>
          <label className="form-label">Moneda</label>
          <input type="text" value={search} onChange={e=>{setSearch(e.target.value);setSelC(null);}} placeholder="Bitcoin..." style={{width:155}}/>
          {sugg.length>0&&<div className="suggest-drop">{sugg.map(c=>(
            <div key={c.id} className="sug-item" onClick={()=>{setSelC(c);setSearch(c.name);}}>
              <img src={c.image} style={{width:15,height:15,borderRadius:'50%'}} alt=""/>
              <span style={{color:'var(--white)',flex:1}}>{c.name}</span>
              <span style={{color:'var(--muted)'}}>{c.symbol?.toUpperCase()}</span>
            </div>
          ))}</div>}
        </div>
        <div className="form-group"><label className="form-label">Cantidad</label><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.5" min="0" style={{width:100}}/></div>
        <div className="form-group"><label className="form-label">Precio Compra (opc.)</label><input type="number" value={buyP} onChange={e=>setBuyP(e.target.value)} placeholder="USD" min="0" style={{width:110}}/></div>
        <button className="btn btn-primary" onClick={add} disabled={!selC||!amount}>AGREGAR</button>
      </div>
    </div>
    {holdings.length>0?(<>
      <div className="portfolio-stats">
        {[['Valor Total',fmt.usd(tv),''],['P&L Total',fmt.usd(tp),tp>=0?'up':'down'],['P&L %',fmt.pct(tpp),tpp>=0?'up':'down'],['Posiciones',holdings.length,'']].map(([l,v,c])=>(
          <div className="p-stat" key={l}><div className="p-stat-label">{l}</div><div className="p-stat-value" style={{color:c==='up'?'var(--buy)':c==='down'?'var(--sell)':'var(--white)'}}>{v}</div></div>
        ))}
      </div>
      <div className="portfolio-body">
        <div className="ptable">
          <div className="panel-hdr"><span className="panel-title">Holdings</span></div>
          <table><thead><tr><th>Activo</th><th>Cant.</th><th>Valor</th><th>P&L</th><th>Señal</th><th/></tr></thead>
          <tbody>{holdings.map(h=>{
            const coin=coins.find(c=>c.id===h.coinId)||{};
            const{signal}=calcSignal({...coin,price_change_percentage_24h:coin.price_change_percentage_24h||0,price_change_percentage_7d_in_currency:coin.price_change_percentage_7d_in_currency||0,market_cap_rank:coin.market_cap_rank||99,total_volume:coin.total_volume||0,market_cap:coin.market_cap||0});
            return(<tr key={h.coinId}>
              <td><div className="coin-info"><img className="coin-img" src={h.image} alt=""/><div><div className="coin-name">{h.symbol}</div><div className="coin-sym">{fmt.usd(h.currentPrice)}</div></div></div></td>
              <td style={{color:'var(--text)'}}>{h.amount}</td>
              <td style={{color:'var(--white)',fontWeight:700}}>{fmt.usd(h.value)}</td>
              <td><span className={`change ${h.pnl>=0?'up':'down'}`}>{fmt.pct(h.pnlPct)}</span></td>
              <td><span className={`signal ${signal}`}>{signal}</span></td>
              <td><button className="del-btn" onClick={()=>setPortfolio(p=>p.filter(x=>x.coinId!==h.coinId))}>✕</button></td>
            </tr>);
          })}</tbody></table>
        </div>
        <div className="pie-card">
          <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'.76rem',color:'var(--white)'}}>Distribución</div>
          <PieChart items={holdings.map(h=>({name:h.symbol,value:h.value})).sort((a,b)=>b.value-a.value)}/>
        </div>
      </div>
    </>):(
      <div className="card"><div className="empty-port">
        💼 Tu portafolio está vacío<br/>Agrega monedas para ver análisis personalizados<br/>
        <span style={{fontSize:'.57rem',color:'var(--muted)'}}>El Chat IA usará tu portafolio como contexto una vez que lo completes</span>
      </div></div>
    )}
  </div>);
}

function ChatView({coins,portfolio,fearGreed}){
  const[msgs,setMsgs]=useState([{role:'assistant',text:`¡Hola! 👋 Soy tu asistente de análisis cripto con IA.\n\n${portfolio.length>0?`Tengo acceso a tu portafolio con ${portfolio.length} posición(es). Puedo analizar tu exposición al riesgo, sugerirte rebalanceos y responder cualquier pregunta sobre el mercado.`:'Aún no tienes posiciones en tu portafolio. Ve a la pestaña Portafolio para agregarlas y obtener un análisis personalizado.'}\n\nUsa los botones de acceso rápido o escribe tu pregunta.`,time:new Date()}]);
  const[input,setInput]=useState('');const[loading,setLoading]=useState(false);const[error,setError]=useState(null);const bottomRef=useRef();
  useEffect(()=>bottomRef.current?.scrollIntoView({behavior:'smooth'}),[msgs]);
  function buildSystem(){
    const top=coins.slice(0,20).map(c=>({...c,...calcSignal(c),...calcRisk(c)}));
    const buys=top.filter(c=>c.signal==='BUY').map(c=>c.name).join(', ')||'ninguna';
    const sells=top.filter(c=>c.signal==='SELL').map(c=>c.name).join(', ')||'ninguna';
    const portStr=portfolio.length>0?portfolio.map(h=>{const live=coins.find(c=>c.id===h.coinId);const cp=live?.current_price||h.currentPrice;const pp=((cp-h.buyPrice)/h.buyPrice*100).toFixed(2);return`${h.symbol}: ${h.amount} uds @ $${h.buyPrice} → $${cp} hoy (${pp>0?'+':''}${pp}%)`;}).join('\n'):'Sin posiciones registradas';
    return`Eres un experto asesor de criptomonedas. Responde en español, de forma clara, concisa y profesional. Siempre menciona que tus análisis son orientativos y no constituyen asesoría financiera.

CONTEXTO DE MERCADO (${new Date().toLocaleDateString('es-ES')}):
- Fear & Greed: ${fearGreed?`${fearGreed.value} (${fearGreed.value_classification})`:'No disponible'}
- Señales BUY: ${buys}
- Señales SELL: ${sells}
- Mejor score: ${top.sort((a,b)=>b.score-a.score)[0]?.name} (${top.sort((a,b)=>b.score-a.score)[0]?.score}/100)

PORTAFOLIO DEL USUARIO:
${portStr}`;
  }
  async function send(text){
    const msg=text||input.trim();if(!msg||loading)return;
    setInput('');setError(null);
    const newMsgs=[...msgs,{role:'user',text:msg,time:new Date()}];
    setMsgs(newMsgs);setLoading(true);
    try{
      const history=newMsgs.map(m=>({role:m.role==='user'?'user':'assistant',content:m.text}));
      const reply=await callClaude(history,buildSystem());
      setMsgs(m=>[...m,{role:'assistant',text:reply,time:new Date()}]);
    }catch(err){
      setError(err.message);
      setMsgs(m=>[...m,{role:'assistant',text:`⚠️ Error: ${err.message}\n\nPor favor verifica tu configuración de API o intenta de nuevo.`,time:new Date()}]);
    }
    setLoading(false);
  }
  const QUICK=['¿Debo rebalancear mi portafolio?','¿Cuál es mi mayor riesgo?','Resumen del mercado hoy','¿Qué comprar con $500?','¿Es buen momento para BTC?','Explícame el Fear & Greed'];
  return(<div className="card chat-wrap">
    <div className="chat-context">
      <svg width="7" height="7"><circle cx="3.5" cy="3.5" r="3.5" fill="var(--accent2)"/></svg>
      Chat IA · Contexto: mercado + portafolio ({portfolio.length} posiciones)
      {fearGreed&&<span style={{marginLeft:'auto'}}>F&G: {fearGreed.value} — {fearGreed.value_classification}</span>}
    </div>
    <div className="quick-btns">{QUICK.map(q=><button key={q} className="quick-btn" onClick={()=>send(q)} disabled={loading}>{q}</button>)}</div>
    <div className="chat-messages">
      {msgs.map((m,i)=>(
        <div key={i} className={`msg ${m.role}`}>
          <div className="msg-bubble" style={{whiteSpace:'pre-wrap'}}>{m.text}</div>
          <div className="msg-time">{m.time?.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}</div>
        </div>
      ))}
      {loading&&<div className="msg assistant"><div className="msg-bubble"><div style={{display:'flex',gap:6,alignItems:'center'}}><div className="spinner" style={{width:12,height:12,borderWidth:1.5}}/><span>Analizando...</span></div></div></div>}
      {error&&<div className="warn-box">⚠️ API Error: {error}</div>}
      <div ref={bottomRef}/>
    </div>
    <div className="chat-input-row">
      <textarea className="chat-input" rows={2} value={input} onChange={e=>setInput(e.target.value)} placeholder="Escribe tu pregunta... (Enter para enviar)" onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} disabled={loading}/>
      <button className="btn btn-primary" onClick={()=>send()} disabled={!input.trim()||loading} style={{alignSelf:'flex-end'}}>ENVIAR</button>
    </div>
  </div>);
}

function DetailPanel({sel,coins}){
  const[tab,setTab]=useState('tecnico');const[aiText,setAiText]=useState('');const[aiLoading,setAiLoading]=useState(false);const[aiError,setAiError]=useState(null);const aiCache=useRef({});
  const p={...sel,...calcSignal(sel),...calcRisk(sel)};
  useEffect(()=>{
    if(!sel)return;const key=sel.id;if(aiCache.current[key]){setAiText(aiCache.current[key]);return;}
    const{signal}=calcSignal(sel);const{riskLevel}=calcRisk(sel);setAiText('');setAiLoading(true);setAiError(null);
    callClaude([{role:'user',content:`Analiza brevemente ${sel.name} (${sel.symbol?.toUpperCase()}): $${sel.current_price}, 24h:${fmt.pct(sel.price_change_percentage_24h)}, 7d:${fmt.pct(sel.price_change_percentage_7d_in_currency)}, rank #${sel.market_cap_rank}, señal:${signal}, riesgo:${riskLevel}. 3-4 oraciones profesionales en español.`}])
    .then(t=>{aiCache.current[key]=t;setAiText(t);}).catch(err=>{setAiError(err.message);setAiText('Análisis no disponible.');}).finally(()=>setAiLoading(false));
  },[sel]);
  return(<div className="detail-grid">
    <div className="card">
      <div className="panel-hdr">
        <div style={{display:'flex',alignItems:'center',gap:7}}><img src={sel.image} alt={sel.name} style={{width:19,height:19,borderRadius:'50%'}}/><span className="panel-title">{sel.name} — Gráfico</span></div>
        <div style={{display:'flex',gap:5}}><span className={`signal ${p.signal}`}>{p.signal==='BUY'?'↑ COMPRAR':p.signal==='SELL'?'↓ VENDER':'⏸ ESPERAR'}</span><span className={`risk ${p.riskLevel}`}>{p.riskLevel==='LOW'?'BAJO':p.riskLevel==='MEDIUM'?'MEDIO':'ALTO'}</span></div>
      </div>
      <TVChart symbol={sel.symbol?.toUpperCase()}/>
      <div className="ai-box">
        <div className="ai-label"><svg width="7" height="7" viewBox="0 0 7 7"><circle cx="3.5" cy="3.5" r="3.5" fill="var(--accent2)"/></svg>Análisis IA</div>
        {aiLoading?<div style={{display:'flex',gap:6,alignItems:'center',color:'var(--muted)',fontSize:'.63rem'}}><div className="spinner" style={{width:11,height:11,borderWidth:1.5}}/>Generando...</div>:aiError?<div className="warn-box">⚠️ {aiError}</div>:<div className="ai-text">{aiText||'—'}</div>}
      </div>
    </div>
    <div className="card">
      <div className="tab-row">
        {[['tecnico','📊 Técnico'],['onchain','🔗 On-Chain'],['score','🎯 Score'],['sentiment','💬 Sentimiento']].map(([id,l])=>(
          <div key={id} className={`tab ${tab===id?'active':''}`} onClick={()=>setTab(id)}>{l}</div>
        ))}
      </div>
      {tab==='tecnico'&&<div className="metrics-grid">
        {[['Precio',fmt.usd(sel.current_price),''],['Cap. Mercado',fmt.usd(sel.market_cap),`Rank #${sel.market_cap_rank}`],['Volumen 24h',fmt.usd(sel.total_volume),`${((sel.total_volume/sel.market_cap)*100).toFixed(1)}% del mcap`],['Cambio 24h',fmt.pct(sel.price_change_percentage_24h),sel.price_change_percentage_24h>=0?'↑ Alcista':'↓ Bajista'],['Cambio 7d',fmt.pct(sel.price_change_percentage_7d_in_currency),'Momentum semanal'],['ATH',fmt.usd(sel.ath),`${fmt.pct(sel.ath_change_percentage)} desde máx.`],['ATL',fmt.usd(sel.atl),`${fmt.pct(sel.atl_change_percentage)} desde mín.`],['Supply Circ.',fmt.num(Math.round(sel.circulating_supply)),sel.total_supply?`${((sel.circulating_supply/sel.total_supply)*100).toFixed(0)}% del total`:'Sin cap máx.']].map(([l,v,s])=>(
          <div className="metric-cell" key={l}><div className="metric-label">{l}</div><div className="metric-value">{v}</div>{s&&<div className="metric-sub">{s}</div>}</div>
        ))}
      </div>}
      {tab==='onchain'&&<div>
        {[['Vol/MCap',`${((sel.total_volume/sel.market_cap)*100).toFixed(2)}%`,Math.min(1,sel.total_volume/(sel.market_cap*.2)),'Liquidez activa (>10% es saludable)'],['Presión 24h',sel.price_change_percentage_24h>0?'Compradora':'Vendedora',Math.min(1,Math.abs(sel.price_change_percentage_24h||0)/20),'Balance dominante de órdenes'],['Momentum 7d',sel.price_change_percentage_7d_in_currency>0?'Alcista':'Bajista',Math.min(1,Math.abs(sel.price_change_percentage_7d_in_currency||0)/30),'Tendencia semanal'],['Supply en circ.',sel.total_supply?`${((sel.circulating_supply/sel.total_supply)*100).toFixed(0)}%`:'Sin techo',sel.total_supply?sel.circulating_supply/sel.total_supply:.5,'Tokens en mercado vs total emitible'],['Distancia ATH',fmt.pct(sel.ath_change_percentage),Math.min(1,Math.max(0,(100+(sel.ath_change_percentage||0))/100)),sel.ath_change_percentage>-15?'Cerca del ATH → zona de resistencia':'Descuento significativo → potencial de recuperación'],['Categoría MCap',sel.market_cap_rank<=10?'Large Cap':sel.market_cap_rank<=50?'Mid Cap':'Small Cap',sel.market_cap_rank<=10?1:sel.market_cap_rank<=50?.6:.3,'Por capitalización de mercado'],['Actividad',sel.total_volume>sel.market_cap*.1?'Alta':sel.total_volume>sel.market_cap*.05?'Media':'Baja',Math.min(1,sel.total_volume/(sel.market_cap*.2)),'Nivel de trading activo'],['Riesgo estimado',p.riskLevel==='LOW'?'Bajo':p.riskLevel==='MEDIUM'?'Medio':'Alto',1-p.riskScore/100,'Basado en volatilidad y capitalización']].map(([n,v,r,h])=>(
          <div key={n}><div className="oc-row"><span className="oc-name">{n}</span><div className="oc-bar-wrap"><div className="oc-bar" style={{width:`${Math.min(100,r*100)}%`,background:r>.6?'var(--buy)':r>.3?'var(--hold)':'var(--sell)'}}/></div><span className="oc-val">{v}</span></div><div className="hint">{h}</div></div>
        ))}
      </div>}
      {tab==='score'&&<div>
        <div className="score-section">
          <Donut score={p.score} size={86}/>
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:7,minWidth:145}}>
            {[['Momentum 24h',Math.min(100,50+(sel.price_change_percentage_24h||0)*3),scoreColor(50+(sel.price_change_percentage_24h||0)*3)],['Momentum 7d',Math.min(100,50+(sel.price_change_percentage_7d_in_currency||0)*2),scoreColor(50+(sel.price_change_percentage_7d_in_currency||0)*2)],['Liquidez',Math.min(100,(sel.total_volume/sel.market_cap)*500),'var(--accent2)'],['Cap. Mercado',Math.min(100,sel.market_cap>1e10?90:sel.market_cap>1e9?65:35),'var(--accent)'],['Supply',sel.total_supply?Math.round((sel.circulating_supply/sel.total_supply)*100):70,'var(--hold)']].map(([l,v,c])=>(
              <div className="sb-row" key={l}><span className="sb-label">{l}</span><div className="sb-track"><div className="sb-fill" style={{width:`${Math.min(100,Math.max(0,v))}%`,background:c}}/></div><span className="sb-val">{Math.round(Math.min(100,Math.max(0,v)))}</span></div>
            ))}
          </div>
        </div>
        <div style={{padding:'0 14px 13px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
          {[['Señal',p.signal==='BUY'?'↑ COMPRAR':p.signal==='SELL'?'↓ VENDER':'⏸ ESPERAR',scoreColor(p.score)],['Riesgo',p.riskLevel==='LOW'?'🟢 BAJO':p.riskLevel==='MEDIUM'?'🟡 MEDIO':'🔴 ALTO',p.riskLevel==='LOW'?'var(--buy)':p.riskLevel==='MEDIUM'?'var(--hold)':'var(--sell)'],['Score',`${p.score}/100`,scoreColor(p.score)],['Risk Score',`${p.riskScore}/100`,p.riskScore<40?'var(--buy)':p.riskScore<65?'var(--hold)':'var(--sell)']].map(([l,v,c])=>(
            <div key={l} style={{background:'rgba(0,0,0,.25)',border:'1px solid var(--border)',borderRadius:7,padding:'9px 11px'}}>
              <div style={{fontSize:'.55rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>{l}</div>
              <div style={{fontSize:'.82rem',fontWeight:700,color:c}}>{v}</div>
            </div>
          ))}
        </div>
        <div className="warn-box">⚠️ <b style={{color:'var(--hold)'}}>Disclaimer:</b> Análisis orientativo. No es asesoría financiera. DYOR antes de invertir.</div>
      </div>}
      {tab==='sentiment'&&<SentimentTab coin={sel}/>}
    </div>
  </div>);
}

export default function CryptoAnalyzer(){
  const[view,setView]=useState('mercado');const[coins,setCoins]=useState([]);const[loading,setLoading]=useState(false);
  const[selected,setSelected]=useState(null);const[fearGreed,setFearGreed]=useState(null);const[portfolio,setPortfolio]=useState([]);
  const[sigF,setSigF]=useState('ALL');const[riskF,setRiskF]=useState('ALL');const[perPage,setPerPage]=useState(25);
  const[sortBy,setSortBy]=useState('market_cap_rank');const[sortDir,setSortDir]=useState(1);const[lastUpdate,setLastUpdate]=useState(null);
  const[apiError,setApiError]=useState(null);

  const fetchAll=useCallback(async()=>{
    setLoading(true);setApiError(null);
    try{
      const[cRes,fRes]=await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=7d`),
        fetch('https://api.alternative.me/fng/?limit=1')
      ]);
      const[cData,fData]=await Promise.all([cRes.json(),fRes.json()]);
      setCoins(cData);setFearGreed(fData.data?.[0]||null);setLastUpdate(new Date());
      if(!selected&&cData.length)setSelected(cData[0]);
    }catch(e){
      console.error(e);
      setApiError('Error loading market data. Please try again.');
    }
    setLoading(false);
  },[perPage,selected]);

  useEffect(()=>{fetchAll();},[fetchAll]);

  const processed=useMemo(()=>coins.map(c=>({...c,...calcSignal(c),...calcRisk(c)})),[coins]);
  const filtered=processed.filter(c=>sigF==='ALL'||c.signal===sigF).filter(c=>riskF==='ALL'||c.riskLevel===riskF);
  const sorted=[...filtered].sort((a,b)=>{const av=a[sortBy],bv=b[sortBy];if(av==null)return 1;if(bv==null)return-1;return sortDir*(av<bv?-1:av>bv?1:0);});
  const counts={BUY:0,SELL:0,HOLD:0,LOW:0,MEDIUM:0,HIGH:0};processed.forEach(c=>{counts[c.signal]++;counts[c.riskLevel]++;});
  const sel=selected?processed.find(c=>c.id===selected.id)||selected:null;
  function handleSort(col){if(sortBy===col)setSortDir(d=>-d);else{setSortBy(col);setSortDir(-1);}}

  // Check if API key is configured
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  return(<>
    <style>{CSS}</style>
    <div className="app">
      <header className="header">
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div className="logo">CRYPTO<span>SCAN</span> <span style={{fontSize:'.7rem',color:'var(--muted)',fontWeight:400}}>PRO</span></div>
          <nav className="nav">
            {[['mercado','📈 Mercado'],['heatmap','🌡️ Heatmap'],['portfolio','💼 Portafolio'],['chat','💬 Chat IA']].map(([id,l])=>(
              <button key={id} className={`nav-btn ${view===id?'active':''}`} onClick={()=>setView(id)}>{l}</button>
            ))}
          </nav>
        </div>
        <div className="header-right">
          {fearGreed&&<FearGreedWidget data={fearGreed}/>}
          <div className="live-badge"><span className="pulse-dot"/>LIVE {lastUpdate&&lastUpdate.toLocaleTimeString('es-ES')}</div>
        </div>
      </header>

      {!apiKey && (view === 'chat' || view === 'mercado') && (
        <div className="api-error">
          <div className="api-error-title">⚠️ Configuración Requerida</div>
          <div className="api-error-text">
            Para usar las funciones de IA (Chat y Análisis de Sentimiento), necesitas configurar tu API key de Anthropic:
          </div>
          <ol style={{fontSize:'.64rem',lineHeight:1.8,marginLeft:20}}>
            <li>Crea un archivo <code style={{background:'rgba(0,0,0,.4)',padding:'2px 5px',borderRadius:3}}>.env</code> en la raíz del proyecto</li>
            <li>Agrega: <code style={{background:'rgba(0,0,0,.4)',padding:'2px 5px',borderRadius:3}}>VITE_ANTHROPIC_API_KEY=tu-api-key-aqui</code></li>
            <li>Obtén tu API key en <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{color:'var(--accent)'}}>console.anthropic.com</a></li>
            <li>Reinicia el servidor de desarrollo</li>
          </ol>
        </div>
      )}

      {apiError && (
        <div className="api-error">
          <div className="api-error-title">⚠️ Error de Conexión</div>
          <div className="api-error-text">{apiError}</div>
        </div>
      )}

      <div className="stats-bar">
        {[['Activos',processed.length,''],['BUY',counts.BUY,'up'],['SELL',counts.SELL,'down'],['HOLD',counts.HOLD,''],['Riesgo Alto',counts.HIGH,'down'],['Riesgo Bajo',counts.LOW,'up'],
          ...(fearGreed?[['F&G Index',fearGreed.value,parseInt(fearGreed.value)>=60?'up':parseInt(fearGreed.value)>=40?'':'down']]:[])
        ].map(([l,v,c])=>(
          <div className="stat-item" key={l}><div className="stat-label">{l}</div><div className={`stat-value ${c}`}>{v}</div></div>
        ))}
      </div>

      {view==='mercado'&&<>
        <div className="controls">
          <div className="sel-wrap"><select value={perPage} onChange={e=>setPerPage(+e.target.value)}>{[10,25,50,100].map(n=><option key={n} value={n}>Top {n}</option>)}</select></div>
          <button className="btn btn-primary" onClick={fetchAll} disabled={loading}>{loading?'⟳ CARGANDO...':'⟳ ACTUALIZAR'}</button>
          <div className="filter-group">{['ALL','BUY','HOLD','SELL'].map(f=><button key={f} className={`btn btn-ghost ${sigF===f?'active':''}`} onClick={()=>setSigF(f)}>{f==='ALL'?'TODOS':f}</button>)}</div>
          <div className="filter-group">{['ALL','LOW','MEDIUM','HIGH'].map(r=><button key={r} className={`btn btn-ghost ${riskF===r?'active':''}`} onClick={()=>setRiskF(r)}>{r==='ALL'?'TODO RIESGO':r==='LOW'?'BAJO':r==='MEDIUM'?'MEDIO':'ALTO'}</button>)}</div>
        </div>
        <div className="summary-chips">
          <span className="chip chip-info">📊 {processed.length} activos</span>
          <span className="chip chip-buy">🟢 {counts.BUY} BUY</span>
          <span className="chip chip-hold">🟡 {counts.HOLD} HOLD</span>
          <span className="chip chip-sell">🔴 {counts.SELL} SELL</span>
          {fearGreed&&<span className="chip chip-info" style={{marginLeft:'auto'}}>😱 Mercado: {fearGreed.value_classification}</span>}
        </div>
      </>}

      <div className="main">
        {view==='mercado'&&<>
          <div className="table-panel">
            <div className="panel-hdr"><span className="panel-title">📈 Mercado en Tiempo Real</span><span className="badge">{sorted.length} resultados</span></div>
            <div className="scrollable">
              {loading?<div className="loading"><div className="spinner"/>Cargando datos...</div>:(
                <table>
                  <thead><tr>
                    <th onClick={()=>handleSort('market_cap_rank')}># {sortBy==='market_cap_rank'?'▾':''}</th>
                    <th>Activo</th>
                    <th onClick={()=>handleSort('current_price')}>Precio {sortBy==='current_price'?'▾':''}</th>
                    <th onClick={()=>handleSort('price_change_percentage_24h')}>24h {sortBy==='price_change_percentage_24h'?'▾':''}</th>
                    <th onClick={()=>handleSort('price_change_percentage_7d_in_currency')}>7d {sortBy==='price_change_percentage_7d_in_currency'?'▾':''}</th>
                    <th onClick={()=>handleSort('market_cap')}>Cap. Mcap {sortBy==='market_cap'?'▾':''}</th>
                    <th onClick={()=>handleSort('total_volume')}>Vol. 24h {sortBy==='total_volume'?'▾':''}</th>
                    <th onClick={()=>handleSort('score')}>Score {sortBy==='score'?'▾':''}</th>
                    <th onClick={()=>handleSort('signal')}>Señal {sortBy==='signal'?'▾':''}</th>
                    <th onClick={()=>handleSort('riskLevel')}>Riesgo {sortBy==='riskLevel'?'▾':''}</th>
                  </tr></thead>
                  <tbody>
                    {sorted.map(c=>(
                      <tr key={c.id} onClick={()=>setSelected(c)} className={sel?.id===c.id?'selected':''}>
                        <td style={{color:'var(--muted)',fontSize:'.6rem'}}>#{c.market_cap_rank}</td>
                        <td><div className="coin-info"><img className="coin-img" src={c.image} alt={c.name}/><div><div className="coin-name">{c.name}</div><div className="coin-sym">{c.symbol?.toUpperCase()}</div></div></div></td>
                        <td style={{color:'var(--white)',fontWeight:700}}>{fmt.usd(c.current_price)}</td>
                        <td><span className={`change ${c.price_change_percentage_24h>=0?'up':'down'}`}>{fmt.pct(c.price_change_percentage_24h)}</span></td>
                        <td><span className={`change ${c.price_change_percentage_7d_in_currency>=0?'up':'down'}`}>{fmt.pct(c.price_change_percentage_7d_in_currency)}</span></td>
                        <td>{fmt.usd(c.market_cap)}</td>
                        <td>{fmt.usd(c.total_volume)}</td>
                        <td><div className="score-bar"><div className="score-track"><div className="score-fill" style={{width:`${c.score}%`,background:scoreColor(c.score)}}/></div><span style={{fontSize:'.6rem',color:scoreColor(c.score)}}>{c.score}</span></div></td>
                        <td><span className={`signal ${c.signal}`}>{c.signal==='BUY'?'↑ COMPRAR':c.signal==='SELL'?'↓ VENDER':'⏸ ESPERAR'}</span></td>
                        <td><span className={`risk ${c.riskLevel}`}>{c.riskLevel==='LOW'?'BAJO':c.riskLevel==='MEDIUM'?'MEDIO':'ALTO'}</span></td>
                      </tr>
                    ))}
                    {sorted.length===0&&!loading&&<tr><td colSpan={10} className="empty">Sin resultados con los filtros actuales</td></tr>}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {sel&&<DetailPanel sel={sel} coins={coins}/>}
        </>}

        {view==='heatmap'&&(
          <div className="table-panel">
            <HeatmapView coins={coins} onSelect={c=>{setSelected(c);setView('mercado');}}/>
          </div>
        )}

        {view==='portfolio'&&(
          <div className="table-panel">
            <div className="panel-hdr"><span className="panel-title">💼 Mi Portafolio Personal</span>{portfolio.length>0&&<span className="badge">{portfolio.length} posiciones</span>}</div>
            <PortfolioView coins={coins} portfolio={portfolio} setPortfolio={setPortfolio}/>
          </div>
        )}

        {view==='chat'&&<ChatView coins={processed} portfolio={portfolio} fearGreed={fearGreed}/>}
      </div>
    </div>
  </>);
}
