import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qqikvklpnkfxauwavvmj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxaWt2a2xwbmtmeGF1d2F2dm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MTgwNzAsImV4cCI6MjA5MzI5NDA3MH0.R1iG33nxvomwTkWeERXncgK7MZ0tOB6bGUG5wD3atj0"
);

const FC_LOGO  = "https://static.wixstatic.com/media/4877d6_4bad42a571ec47e982d9b2ec2b4c9a22~mv2.jpeg";
const FC_VIDEO = "https://video.wixstatic.com/video/4877d6_d0e550fa2fc74401bce8384efdedea93/240p/mp4/file.mp4";
const GOLD = "#f0b429";
const NAVY = "#080e1f";
const ADMIN_PW = "2636";

const Q = [
  { id:"used_app",    type:"radio",    label:"QUESTION 1 OF 8", title:"Did you use the Founders Cup app during the tournament?", hint:"Tap to select", opts:["Yes","No — I didn't use it"] },
  { id:"ease",        type:"scale",    label:"QUESTION 2 OF 8", title:"How easy was the app to use overall?", hint:"Drag up or down to select", opts:["Very easy","Easy","Okay","Difficult","Very difficult"] },
  { id:"live_scores", type:"iconlist", label:"QUESTION 3 OF 8", title:"How did the live scores and match timers help you follow the games?", hint:"Tap to select", opts:[{label:"Very helpful",icon:"check"},{label:"Somewhat helpful",icon:"minus"},{label:"Not helpful",icon:"x"},{label:"Didn't notice / didn't use",icon:"info"}], note:"Anything to add about the live scores? (optional)" },
  { id:"useful_feature",type:"chips",  label:"QUESTION 4 OF 8", title:"Which part of the app did you find most useful?", hint:"Select all that apply", opts:["Live scores & match updates","News & announcements","Team & player info","Choir results","None of these"], other:true },
  { id:"tech_issues", type:"iconlist", label:"QUESTION 5 OF 8", title:"Did you experience any technical issues with the app?", hint:"Tap to select", opts:[{label:"No issues at all",icon:"check"},{label:"Minor issues",icon:"minus"},{label:"Major issues",icon:"x"}], note:"If yes, please describe briefly (optional)", showNoteIf:["Minor issues","Major issues"] },
  { id:"future_use",  type:"radio",    label:"QUESTION 6 OF 8", title:"Would you like to use an app like this for future CHG events?", hint:"Tap to select", opts:["Yes, definitely","Maybe","No"] },
  { id:"suggestions", type:"textonly", label:"QUESTION 7 OF 8", title:"Any suggestions to improve the app for next time?", hint:"Optional — every idea helps" },
  { id:"overall",     type:"scale",    label:"QUESTION 8 OF 8", title:"Overall, how would you rate this year's Founders Cup tournament?", hint:"Drag up or down to select", opts:["Excellent","Very good","Good","Average","Poor"] },
];
const TOTAL = Q.length;
const COLORS = ["#f0b429","#7c3aed","#38d3c4","#fc8181","#68d391","#63b3ed","#f6ad55"];

function haptic(ms = 18) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch {} }

function Ic({ n, s = 18, c = "currentColor", w = 1.6 }) {
  const p = { fill:"none", stroke:c, strokeWidth:w, strokeLinecap:"round", strokeLinejoin:"round" };
  const d = {
    check:   <path {...p} d="M20 6L9 17l-5-5"/>,
    minus:   <path {...p} d="M5 12h14"/>,
    x:       <path {...p} d="M18 6L6 18M6 6l12 12"/>,
    info:    <><circle {...p} cx="12" cy="12" r="9"/><path {...p} d="M12 8h.01M11 12h1v4h1"/></>,
    trophy:  <><path {...p} d="M8 21h8M12 17v4M5 3H3a2 2 0 000 4c0 3 2 5 4 6M19 3h2a2 2 0 010 4c0 3-2 5-4 6"/><path {...p} d="M8 3h8v8a4 4 0 01-8 0V3z"/></>,
    lock:    <><rect {...p} x="3" y="11" width="18" height="11" rx="2"/><path {...p} d="M7 11V7a5 5 0 0110 0v4"/></>,
    user:    <><circle {...p} cx="12" cy="8" r="4"/><path {...p} d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/></>,
    shield:  <path {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    trash:   <><path {...p} d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path {...p} d="M10 11v6M14 11v6"/></>,
    sparkle: <><path {...p} d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></>,
    chevdown:<path {...p} d="M6 9l6 6 6-6"/>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" style={{display:"block",flexShrink:0}}>{d[n]||d.info}</svg>;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
html,body{background:${NAVY};color:#fff;font-family:'Barlow',sans-serif;min-height:100vh;overflow-x:hidden;}

/* intro */
.sv-intro{position:fixed;inset:0;z-index:200;background:#000;display:flex;flex-direction:column;}
.sv-intro video{flex:1;width:100%;object-fit:contain;background:#000;}
.sv-intro-bar{height:3px;background:rgba(255,255,255,.1);}
.sv-intro-fill{height:100%;background:${GOLD};transition:width .3s linear;}

/* page fade */
.sv-page{
  min-height:100vh;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:24px 16px 40px;
  background:${NAVY};
  background-image:radial-gradient(ellipse at 50% 0%,rgba(240,180,41,.07) 0%,transparent 55%);
  animation:svFade .3s ease both;
}
@keyframes svFade{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}

/* card */
.sv-card{width:100%;max-width:420px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:18px;padding:26px 20px;}
.sv-card.glow{border-color:rgba(240,180,41,.3);box-shadow:0 0 0 1px rgba(240,180,41,.12),0 20px 60px rgba(0,0,0,.4);}

/* progress */
.sv-prog{width:100%;max-width:420px;margin-bottom:12px;}
.sv-prog-track{height:3px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden;}
.sv-prog-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#7c3aed,${GOLD},#ff6b9d);transition:width .35s ease;}
.sv-prog-lbl{text-align:right;font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:2px;color:rgba(255,255,255,.3);margin-top:5px;text-transform:uppercase;}

/* type */
.sv-eye{font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:3.5px;text-transform:uppercase;color:${GOLD};font-weight:700;margin-bottom:8px;}
.sv-title{font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;line-height:1.3;color:#fff;margin-bottom:6px;}
.sv-hint{font-size:12px;color:rgba(255,255,255,.38);margin-bottom:16px;}

/* options */
.sv-opt{width:100%;text-align:left;padding:13px 15px;border-radius:11px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);color:#fff;font-size:14px;font-weight:500;cursor:pointer;transition:border-color .15s,background .15s;margin-bottom:9px;display:flex;align-items:center;gap:12px;font-family:'Barlow',sans-serif;}
.sv-opt:active{background:rgba(240,180,41,.06);}
.sv-opt.sel{border-color:${GOLD};background:rgba(240,180,41,.09);}
.sv-radio{width:21px;height:21px;border-radius:50%;border:1.5px solid rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
.sv-radio.sel{border-color:${GOLD};background:${GOLD};}
.sv-iconbox{width:33px;height:33px;border-radius:8px;border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:rgba(255,255,255,.45);transition:all .15s;}
.sv-opt.sel .sv-iconbox{border-color:${GOLD};color:${GOLD};background:rgba(240,180,41,.1);}

/* chips */
.sv-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;}
.sv-chip{padding:9px 15px;border-radius:20px;border:1px solid rgba(255,255,255,.11);background:rgba(255,255,255,.02);color:rgba(255,255,255,.75);font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;font-family:'Barlow',sans-serif;}
.sv-chip:active{background:rgba(240,180,41,.08);}
.sv-chip.sel{border-color:${GOLD};background:${GOLD};color:${NAVY};font-weight:700;}

/* textarea / input */
.sv-ta{width:100%;min-height:82px;padding:12px 13px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.2);color:#fff;font-family:'Barlow',sans-serif;font-size:14px;resize:vertical;line-height:1.55;transition:border-color .15s;margin-top:4px;}
.sv-ta:focus{outline:none;border-color:${GOLD};}
.sv-ta::placeholder{color:rgba(255,255,255,.25);}
.sv-input{width:100%;padding:12px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.2);color:#fff;font-family:'Barlow',sans-serif;font-size:14px;margin-bottom:10px;transition:border-color .15s;}
.sv-input:focus{outline:none;border-color:${GOLD};}
.sv-input::placeholder{color:rgba(255,255,255,.28);}

/* scale */
.sv-scale{position:relative;height:172px;margin:4px 0 14px;overflow:hidden;touch-action:none;user-select:none;cursor:ns-resize;}
.sv-scale-fade{pointer-events:none;position:absolute;left:0;right:0;z-index:2;}
.sv-scale-fade.top{top:0;height:58px;background:linear-gradient(to bottom,${NAVY},transparent);}
.sv-scale-fade.bot{bottom:0;height:58px;background:linear-gradient(to top,${NAVY},transparent);}
.sv-scale-pill{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);z-index:3;pointer-events:none;display:flex;justify-content:center;}
.sv-pill-inner{padding:0 32px;height:44px;line-height:44px;border-radius:11px;border:1.5px solid ${GOLD};background:rgba(240,180,41,.08);font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;color:#fff;white-space:nowrap;}
.sv-scale-list{position:absolute;left:0;right:0;display:flex;flex-direction:column;align-items:center;}
.sv-scale-item{height:44px;display:flex;align-items:center;justify-content:center;width:100%;font-family:'Barlow Condensed',sans-serif;font-size:14px;color:rgba(255,255,255,.2);font-weight:600;cursor:pointer;}
.sv-scale-item.sel{color:transparent;}

/* buttons */
.sv-btn{width:100%;padding:14px;border-radius:11px;border:none;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;letter-spacing:1px;text-transform:uppercase;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .15s;}
.sv-btn:active{opacity:.8;}
.sv-btn.gold{background:linear-gradient(90deg,${GOLD},#ffd166);color:${NAVY};}
.sv-btn.gold:disabled{opacity:.3;cursor:not-allowed;}
.sv-btn.ghost{background:transparent;border:1px solid rgba(255,255,255,.13);color:rgba(255,255,255,.6);}
.sv-btn.danger{background:rgba(229,62,62,.07);border:1px solid rgba(229,62,62,.25);color:#fc8181;}
.sv-row{display:flex;gap:9px;margin-top:14px;}
.sv-row .sv-btn{flex:1;}

/* participate */
.sv-pc{padding:14px 15px;border-radius:11px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);cursor:pointer;margin-bottom:9px;transition:border-color .15s;}
.sv-pc:active{background:rgba(240,180,41,.05);}
.sv-pc.sel{border-color:${GOLD};background:rgba(240,180,41,.07);}
.sv-pc-t{font-size:14px;font-weight:700;margin-bottom:3px;}
.sv-pc-d{font-size:12px;color:rgba(255,255,255,.4);}
.sv-link{text-align:center;margin-top:14px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.28);cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-weight:700;}
.sv-hr{height:1px;background:linear-gradient(90deg,transparent,rgba(240,180,41,.3),transparent);margin:14px 0;}

/* admin */
.sv-admin{width:100%;max-width:900px;padding:20px 16px;}
.sv-stat-row{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;}
.sv-stat{flex:1;min-width:80px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:16px;text-align:center;}
.sv-stat-n{font-family:'Barlow Condensed',sans-serif;font-size:34px;font-weight:900;color:${GOLD};line-height:1;}
.sv-stat-l{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-top:4px;font-family:'Barlow Condensed',sans-serif;}
.sv-panel{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px;margin-bottom:12px;}
.sv-panel-t{font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:${GOLD};font-weight:700;margin-bottom:12px;}
.sv-brow{display:flex;align-items:center;gap:10px;margin-bottom:9px;}
.sv-brow-l{font-size:12px;color:rgba(255,255,255,.7);flex:0 0 150px;}
.sv-brow-t{flex:1;height:6px;border-radius:4px;background:rgba(255,255,255,.06);overflow:hidden;}
.sv-brow-f{height:100%;border-radius:4px;transition:width .5s ease;}
.sv-brow-n{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;width:22px;text-align:right;color:rgba(255,255,255,.5);}
.sv-quote{padding:11px 13px;border-left:3px solid ${GOLD};background:rgba(255,255,255,.02);border-radius:0 8px 8px 0;font-size:13px;color:rgba(255,255,255,.78);margin-bottom:8px;line-height:1.55;}
.sv-resp{display:flex;align-items:center;gap:10px;padding:11px 13px;border:1px solid rgba(255,255,255,.06);border-radius:10px;margin-bottom:7px;cursor:pointer;}
.sv-tag{padding:3px 9px;border-radius:20px;font-size:9.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:'Barlow Condensed',sans-serif;flex-shrink:0;}
.sv-tag.named{background:rgba(240,180,41,.1);color:${GOLD};border:1px solid rgba(240,180,41,.22);}
.sv-tag.anon{background:rgba(255,255,255,.04);color:rgba(255,255,255,.45);border:1px solid rgba(255,255,255,.09);}
.sv-legend{display:flex;align-items:center;gap:7px;font-size:12px;color:rgba(255,255,255,.7);margin-bottom:5px;}
.sv-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.sv-donut-wrap{display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.sv-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
@media(max-width:580px){.sv-grid2{grid-template-columns:1fr;}.sv-brow-l{flex:0 0 110px;font-size:11px;}}
`;

/* ── Video intro ─────────────────────────────────── */
function VideoIntro({ onDone }) {
  const vRef = useRef(null);
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const v = vRef.current; if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
    const tick = () => { if (v.duration) setPct(v.currentTime / v.duration * 100); };
    const end  = () => setTimeout(onDone, 200);
    v.addEventListener("timeupdate", tick);
    v.addEventListener("ended", end);
    return () => { v.removeEventListener("timeupdate", tick); v.removeEventListener("ended", end); };
  }, [onDone]);
  return (
    <div className="sv-intro">
      <video ref={vRef} src={FC_VIDEO} playsInline muted preload="auto"/>
      <div className="sv-intro-bar"><div className="sv-intro-fill" style={{width:`${pct}%`}}/></div>
    </div>
  );
}

/* ── Scale picker ────────────────────────────────── */
function ScalePicker({ opts, value, onChange }) {
  const IH = 44;
  const midIdx = Math.floor(opts.length / 2);
  const curIdx = value != null ? opts.indexOf(value) : midIdx;
  const [idx, setIdx] = useState(curIdx < 0 ? midIdx : curIdx);
  const startY   = useRef(null);
  const startIdx = useRef(idx);
  const prevIdx  = useRef(idx);
  const interacted = useRef(false);

  useEffect(() => {
    const i = value != null ? opts.indexOf(value) : midIdx;
    setIdx(i < 0 ? midIdx : i);
  }, [value]);

  // demo animation — nudge down then up, twice
  useEffect(() => {
    let cancel = false;
    const wait = ms => new Promise(r => setTimeout(r, ms));
    (async () => {
      await wait(700);
      for (let rep = 0; rep < 2; rep++) {
        if (cancel || interacted.current) break;
        setIdx(i => Math.min(opts.length - 1, i + 1));
        await wait(380);
        if (cancel || interacted.current) break;
        setIdx(i => Math.max(0, i - 1));
        await wait(280);
        if (cancel || interacted.current) break;
        setIdx(i => Math.min(opts.length - 1, i + 1));
        await wait(380);
        if (cancel || interacted.current) break;
        setIdx(i => Math.max(0, i - 1));
        await wait(500);
      }
    })();
    return () => { cancel = true; };
  }, []);

  const commit = useCallback((i) => {
    const c = Math.max(0, Math.min(opts.length - 1, i));
    if (c !== prevIdx.current) { haptic(20); prevIdx.current = c; }
    setIdx(c);
    onChange(opts[c]);
  }, [opts, onChange]);

  const onPD = e => { interacted.current = true; startY.current = e.clientY; startIdx.current = idx; e.currentTarget.setPointerCapture(e.pointerId); };
  const onPM = e => { if (startY.current === null) return; const d = Math.round((startY.current - e.clientY) / IH); commit(startIdx.current + d); };
  const onPU = () => { startY.current = null; };

  const CENTER = 86 - IH / 2;
  const ty = CENTER - idx * IH;

  return (
    <div className="sv-scale" onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} onPointerCancel={onPU}>
      <div className="sv-scale-fade top"/>
      <div className="sv-scale-pill"><div className="sv-pill-inner">{opts[idx]}</div></div>
      <div className="sv-scale-list" style={{transform:`translateY(${ty}px)`,transition:startY.current?"none":"transform .2s cubic-bezier(.25,.46,.45,.94)"}}>
        {opts.map((o, i) => <div key={o} className={`sv-scale-item${i===idx?" sel":""}`} onClick={()=>{interacted.current=true;commit(i);}}>{o}</div>)}
      </div>
      <div className="sv-scale-fade bot"/>
    </div>
  );
}

/* ── Welcome ─────────────────────────────────────── */
function Welcome({ onStart, onAdmin }) {
  return (
    <div className="sv-page">
      <div className="sv-card glow">
        <img src={FC_LOGO} alt="" style={{width:58,height:58,borderRadius:"50%",objectFit:"cover",border:`2px solid ${GOLD}`,boxShadow:"0 0 22px rgba(240,180,41,.3)",display:"block",margin:"0 auto 12px"}}/>
        <div style={{textAlign:"center",marginBottom:4}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,letterSpacing:2,textTransform:"uppercase"}}>Founder's <span style={{color:GOLD}}>Cup</span></div>
          <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:GOLD,fontWeight:700,marginTop:3,fontFamily:"'Barlow Condensed',sans-serif"}}>Church of the Holy Ghost</div>
        </div>
        <div className="sv-hr"/>
        <div style={{fontSize:13,color:"rgba(255,255,255,.5)",textAlign:"center",lineHeight:1.65,marginBottom:20}}>
          The tournament may be over, but your voice matters. Share how the app worked for you and help us make the next Founders Cup even better — it'll take about 2 minutes.
        </div>
        <button className="sv-btn gold" onClick={onStart}><Ic n="trophy" s={15} c={NAVY}/> Start Survey</button>
        <div className="sv-link" onClick={onAdmin}>Admin</div>
      </div>
    </div>
  );
}

/* ── Participate ─────────────────────────────────── */
function Participate({ mode, setMode, onBack, onContinue }) {
  return (
    <div className="sv-page">
      <div className="sv-card">
        <div className="sv-eye">Before You Begin</div>
        <div className="sv-title">How would you like to participate?</div>
        <div className="sv-hint" style={{marginBottom:18}}>Your honesty matters most. Choose what feels comfortable.</div>
        <div className={`sv-pc${mode==="named"?" sel":""}`} onClick={()=>{haptic();setMode("named");}}>
          <div className="sv-pc-t">Share my name</div>
          <div className="sv-pc-d">The organising team can follow up with you personally</div>
        </div>
        <div className={`sv-pc${mode==="anon"?" sel":""}`} onClick={()=>{haptic();setMode("anon");}}>
          <div className="sv-pc-t">Stay anonymous</div>
          <div className="sv-pc-d">Your responses stay private and aren't linked to you</div>
        </div>
        <div className="sv-row">
          <button className="sv-btn ghost" onClick={onBack}>Back</button>
          <button className="sv-btn gold" disabled={!mode} onClick={onContinue}>Continue</button>
        </div>
      </div>
    </div>
  );
}

/* ── Name entry ──────────────────────────────────── */
function NameEntry({ name, setName, onBack, onContinue }) {
  return (
    <div className="sv-page">
      <div className="sv-card">
        <div className="sv-eye">Almost There</div>
        <div className="sv-title">What's your name?</div>
        <div className="sv-hint">So the team knows who to thank</div>
        <input className="sv-input" placeholder="Your name" value={name} autoFocus
          onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&name.trim()&&onContinue()}/>
        <div className="sv-row">
          <button className="sv-btn ghost" onClick={onBack}>Back</button>
          <button className="sv-btn gold" disabled={!name.trim()} onClick={onContinue}>Continue</button>
        </div>
      </div>
    </div>
  );
}

/* ── Question ────────────────────────────────────── */
function QuestionCard({ q, stepNum, answers, setAns, onBack, onNext, isLast }) {
  const val     = answers[q.id];
  const noteVal = answers[q.id+"_note"] || "";
  const otherVal= answers[q.id+"_other"] || "";
  const showNote= q.showNoteIf ? q.showNoteIf.includes(val) : true;
  const canNext = q.type==="textonly"||q.type==="chips" ? true : val!=null;

  useEffect(()=>{ if(q.type==="scale"&&val==null) setAns(q.id, q.opts[Math.floor(q.opts.length/2)]); },[q.id]);

  return (
    <div className="sv-page">
      <div className="sv-prog" style={{maxWidth:420}}>
        <div className="sv-prog-track"><div className="sv-prog-fill" style={{width:`${(stepNum/TOTAL)*100}%`}}/></div>
        <div className="sv-prog-lbl">{stepNum} of {TOTAL}</div>
      </div>
      <div className="sv-card">
        <div className="sv-eye">{q.label}</div>
        <div className="sv-title">{q.title}</div>
        <div className="sv-hint">{q.hint}</div>

        {q.type==="radio" && q.opts.map(o=>(
          <button key={o} className={`sv-opt${val===o?" sel":""}`} onClick={()=>{haptic();setAns(q.id,o);}}>
            <span className={`sv-radio${val===o?" sel":""}`}>{val===o&&<Ic n="check" s={11} c={NAVY}/>}</span>{o}
          </button>
        ))}

        {q.type==="iconlist" && <>
          {q.opts.map(o=>(
            <button key={o.label} className={`sv-opt${val===o.label?" sel":""}`} onClick={()=>{haptic();setAns(q.id,o.label);}}>
              <span className="sv-iconbox"><Ic n={o.icon} s={15}/></span>{o.label}
            </button>
          ))}
          {q.note && showNote && <textarea className="sv-ta" placeholder={q.note} value={noteVal} onChange={e=>setAns(q.id+"_note",e.target.value)}/>}
        </>}

        {q.type==="chips" && <>
          <div className="sv-chips">
            {q.opts.map(o=>{
              const list=Array.isArray(val)?val:[];
              const on=list.includes(o);
              return <button key={o} className={`sv-chip${on?" sel":""}`} onClick={()=>{haptic();setAns(q.id,on?list.filter(x=>x!==o):[...list,o]);}}>{o}</button>;
            })}
          </div>
          {q.other && <input className="sv-input" placeholder="Other — please specify..." value={otherVal} onChange={e=>setAns(q.id+"_other",e.target.value)}/>}
        </>}

        {q.type==="scale" && <ScalePicker opts={q.opts} value={val} onChange={v=>setAns(q.id,v)}/>}

        {q.type==="textonly" && <textarea className="sv-ta" style={{minHeight:120}} placeholder="Type your thoughts here…" value={val||""} onChange={e=>setAns(q.id,e.target.value)} autoFocus/>}

        <div className="sv-row">
          <button className="sv-btn ghost" onClick={onBack}>Back</button>
          <button className="sv-btn gold" disabled={!canNext} onClick={()=>{haptic(22);onNext();}}>
            {isLast?"Submit":"Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Thank you ───────────────────────────────────── */
function Thanks({ onDone }) {
  return (
    <div className="sv-page">
      <div className="sv-card glow" style={{textAlign:"center"}}>
        <img src={FC_LOGO} alt="" style={{width:58,height:58,borderRadius:"50%",objectFit:"cover",border:`2px solid ${GOLD}`,boxShadow:"0 0 22px rgba(240,180,41,.3)",display:"block",margin:"0 auto 14px"}}/>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,textTransform:"uppercase",marginBottom:4}}>Thank <span style={{color:GOLD}}>You!</span></div>
        <div className="sv-hr"/>
        <div style={{fontSize:13,color:"rgba(255,255,255,.5)",lineHeight:1.65,marginBottom:20}}>Your feedback has been received. We're grateful for everyone who made this year's Founders Cup such a special Biennial Championship — see you next time!</div>
        <button className="sv-btn ghost" onClick={onDone}>Done</button>
      </div>
    </div>
  );
}

/* ── Admin login ─────────────────────────────────── */
function AdminLogin({ onLogin, onBack }) {
  const [pw,setPw]=useState(""); const [err,setErr]=useState(false);
  const go=()=>{ if(pw===ADMIN_PW) onLogin(); else{setErr(true);setTimeout(()=>setErr(false),1400);} };
  return (
    <div className="sv-page">
      <div className="sv-card">
        <img src={FC_LOGO} alt="" style={{width:50,height:50,borderRadius:"50%",objectFit:"cover",border:`2px solid ${GOLD}`,display:"block",margin:"0 auto 14px"}}/>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div className="sv-eye" style={{textAlign:"center"}}>Admin Access</div>
          <div className="sv-title" style={{textAlign:"center"}}>Dashboard Login</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.35)"}}>Founders Cup Survey</div>
        </div>
        <input className="sv-input" type="password" placeholder="Enter admin password" value={pw}
          onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
          style={err?{borderColor:"#fc8181"}:{}}/>
        {err&&<div style={{color:"#fc8181",fontSize:12,textAlign:"center",marginBottom:8}}>Incorrect password</div>}
        <button className="sv-btn gold" onClick={go}><Ic n="lock" s={14} c={NAVY}/> Enter Dashboard</button>
        <div className="sv-link" onClick={onBack}>Back to survey</div>
      </div>
    </div>
  );
}

/* ── Dashboard charts ────────────────────────────── */
function BarPanel({title,data}){
  const max=Math.max(1,...data.map(d=>d.n));
  return <div className="sv-panel"><div className="sv-panel-t">{title}</div>{data.map((d,i)=><div className="sv-brow" key={d.label}><div className="sv-brow-l">{d.label}</div><div className="sv-brow-t"><div className="sv-brow-f" style={{width:`${(d.n/max)*100}%`,background:COLORS[i%COLORS.length]}}/></div><div className="sv-brow-n">{d.n}</div></div>)}</div>;
}
function DonutPanel({title,data}){
  const total=data.reduce((a,b)=>a+b.n,0)||1;let acc=0;
  const segs=data.map((d,i)=>{const f=d.n/total,s=acc;acc+=f;return{...d,s,e:acc,c:COLORS[i%COLORS.length]};});
  const r=50,cx=60,cy=60,sw=14,circ=2*Math.PI*r;
  return <div className="sv-panel"><div className="sv-panel-t">{title}</div><div className="sv-donut-wrap"><svg width="120" height="120" viewBox="0 0 120 120"><circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth={sw}/>{segs.map(s=><circle key={s.label} cx={cx} cy={cy} r={r} fill="none" stroke={s.c} strokeWidth={sw} strokeDasharray={`${circ*(s.e-s.s)} ${circ}`} strokeDashoffset={-circ*s.s} transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt"/>)}<text x={cx} y={cy+7} textAnchor="middle" fill="#fff" fontFamily="'Barlow Condensed',sans-serif" fontSize="22" fontWeight="900">{total}</text></svg><div>{segs.map(s=><div className="sv-legend" key={s.label}><span className="sv-dot" style={{background:s.c}}/>{s.label} ({s.n})</div>)}</div></div></div>;
}
function tally(rows,col,opts){const c={};opts.forEach(o=>c[o]=0);rows.forEach(r=>{const v=r[col];if(v&&c[v]!==undefined)c[v]++;});return opts.map(o=>({label:o,n:c[o]}));}
function tallyArr(rows,col,opts){const c={};opts.forEach(o=>c[o]=0);rows.forEach(r=>{const v=r[col];if(Array.isArray(v))v.forEach(x=>{if(c[x]!==undefined)c[x]++;});});return opts.map(o=>({label:o,n:c[o]}));}

/* ── Dashboard ───────────────────────────────────── */
function Dashboard({ onSignOut }) {
  const [rows,setRows]=useState([]); const [loading,setLoading]=useState(true);
  const [insights,setInsights]=useState(null); const [aiLoad,setAiLoad]=useState(false);
  const [exp,setExp]=useState(null);
  const load=async()=>{setLoading(true);const{data}=await supabase.from("fc_survey_responses").select("*").order("created_at",{ascending:false});setRows(data||[]);setLoading(false);};
  useEffect(()=>{load();},[]);
  const del=async id=>{await supabase.from("fc_survey_responses").delete().eq("id",id);load();};
  const resetAll=async()=>{if(!window.confirm("Delete ALL responses? This cannot be undone."))return;await supabase.from("fc_survey_responses").delete().neq("id","00000000-0000-0000-0000-000000000000");load();};
  const named=rows.filter(r=>r.mode==="named").length;
  const usedApp=tally(rows,"used_app",Q[0].opts);
  const ease=tally(rows,"ease",Q[1].opts);
  const liveScores=tally(rows,"live_scores",Q[2].opts.map(o=>o.label));
  const useful=tallyArr(rows,"useful_feature",Q[3].opts);
  const tech=tally(rows,"tech_issues",Q[4].opts.map(o=>o.label));
  const future=tally(rows,"future_use",Q[5].opts);
  const overall=tally(rows,"overall",Q[7].opts);
  const suggestions=rows.map(r=>r.suggestions).filter(s=>s&&s.trim());
  const techNotes=rows.map(r=>r.tech_issues_note).filter(s=>s&&s.trim());
  const genInsights=async()=>{
    setAiLoad(true);
    try{
      const summary={total:rows.length,usedApp,ease,liveScores,useful,tech,future,overall,suggestions:suggestions.slice(0,20),techNotes:techNotes.slice(0,10)};
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:`Post-tournament feedback survey data for Founders Cup app (Church of the Holy Ghost biennial sports tournament). Data: ${JSON.stringify(summary)}. Write 4-6 concise actionable bullet-point insights for the organising team: what worked well, what to improve, key themes from open feedback. Plain text, no markdown.`}]})});
      const d=await res.json();setInsights(d.content.filter(b=>b.type==="text").map(b=>b.text).join("\n"));
    }catch{setInsights("Could not generate insights — please try again.");}
    setAiLoad(false);
  };
  if(loading)return<div style={{minHeight:"100vh",background:NAVY,display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.4)",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2}}>Loading…</div>;
  return(
    <div style={{minHeight:"100vh",background:NAVY,backgroundImage:"radial-gradient(ellipse at 50% 0%,rgba(240,180,41,.05) 0%,transparent 55%)",display:"flex",justifyContent:"center",padding:"20px 0"}}>
      <div className="sv-admin">
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:18,gap:12,flexWrap:"wrap"}}>
          <div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900}}>Response Dashboard</div><div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginTop:2}}>Church of the Holy Ghost · Founders Cup</div></div>
          <button className="sv-btn ghost" style={{width:"auto",padding:"9px 16px"}} onClick={onSignOut}>Sign out</button>
        </div>
        <div className="sv-stat-row">
          <div className="sv-stat"><div className="sv-stat-n">{rows.length}</div><div className="sv-stat-l">Total Responses</div></div>
          <div className="sv-stat"><div className="sv-stat-n">{named}</div><div className="sv-stat-l">Named</div></div>
          <div className="sv-stat"><div className="sv-stat-n">{rows.length-named}</div><div className="sv-stat-l">Anonymous</div></div>
        </div>
        <button className="sv-btn ghost" style={{marginBottom:9,borderColor:"rgba(240,180,41,.35)",color:GOLD}} onClick={genInsights} disabled={aiLoad||!rows.length}><Ic n="sparkle" s={14} c={GOLD}/>{aiLoad?"Generating AI Insights…":"Generate AI Insights"}</button>
        {insights&&<div className="sv-panel" style={{whiteSpace:"pre-wrap",fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,.82)"}}>{insights}</div>}
        <button className="sv-btn danger" style={{marginBottom:14}} onClick={resetAll} disabled={!rows.length}><Ic n="trash" s={13}/> Reset — Delete All Responses</button>
        {!rows.length&&<div className="sv-panel" style={{textAlign:"center",color:"rgba(255,255,255,.35)",padding:28}}>No responses yet. Share the survey link with your congregation.</div>}
        {rows.length>0&&<>
          <div className="sv-grid2">
            <BarPanel title="Q1 — App Usage" data={usedApp}/>
            <BarPanel title="Q2 — Ease of Use" data={ease}/>
            <BarPanel title="Q3 — Live Scores Helpfulness" data={liveScores}/>
            <DonutPanel title="Q6 — Future Use Interest" data={future}/>
            <BarPanel title="Q5 — Technical Issues" data={tech}/>
            <BarPanel title="Q8 — Overall Tournament Rating" data={overall}/>
          </div>
          <BarPanel title="Q4 — Most Useful Feature (multi-select)" data={useful}/>
          {(suggestions.length>0||techNotes.length>0)&&<div className="sv-panel"><div className="sv-panel-t">Final Reflections</div>{suggestions.map((s,i)=><div className="sv-quote" key={"s"+i}>{s}</div>)}{techNotes.map((s,i)=><div className="sv-quote" key={"t"+i} style={{borderLeftColor:"#fc8181"}}>⚠ {s}</div>)}</div>}
          <div className="sv-panel"><div className="sv-panel-t">Individual Responses</div>
            {rows.map((r,i)=><div key={r.id}>
              <div className="sv-resp" onClick={()=>setExp(exp===i?null:i)}>
                <Ic n={r.mode==="named"?"user":"shield"} s={15} c={GOLD}/>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{r.mode==="named"?r.respondent_name:"Anonymous"}</div><div style={{fontSize:10.5,color:"rgba(255,255,255,.35)"}}>{new Date(r.created_at).toLocaleString()} · {r.device||"web"}</div></div>
                <span className={`sv-tag ${r.mode==="named"?"named":"anon"}`}>{r.mode==="named"?"Named":"Anon"}</span>
                <button className="sv-btn danger" style={{width:"auto",padding:"5px 10px",fontSize:9.5,borderRadius:7}} onClick={e=>{e.stopPropagation();del(r.id);}}>Delete</button>
                <Ic n="chevdown" s={13} c="rgba(255,255,255,.3)"/>
              </div>
              {exp===i&&<div style={{padding:"0 12px 12px 38px",fontSize:12,color:"rgba(255,255,255,.65)",lineHeight:1.8}}>{Q.map(q=>{const v=r[q.id];if(!v||(Array.isArray(v)&&!v.length)||v==="")return null;return<div key={q.id}><span style={{color:GOLD}}>{q.title.length>50?q.title.slice(0,50)+"…":q.title}</span>: {Array.isArray(v)?v.join(", "):String(v)}</div>;})}</div>}
            </div>)}
          </div>
        </>}
      </div>
    </div>
  );
}

/* ── Root App ────────────────────────────────────── */
export default function App() {
  const [screen,setScreen]=useState("intro"); // intro|welcome|participate|name|survey|thanks|admin-login|admin
  const [mode,setMode]=useState(null);
  const [name,setName]=useState("");
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState({});
  const [saving,setSaving]=useState(false);
  const [key,setKey]=useState(0); // forces re-mount for fade animation

  const setAns=(k,v)=>setAnswers(a=>({...a,[k]:v}));

  const go=(s,st=0)=>{ setKey(k=>k+1); setScreen(s); setStep(st); };

  const submit=async()=>{
    setSaving(true);
    try{
      await supabase.from("fc_survey_responses").insert({
        mode, respondent_name:mode==="named"?name:null,
        device:/Mobi|Android/i.test(navigator.userAgent)?"mobile":"web",
        used_app:answers.used_app||null, ease:answers.ease||null,
        live_scores:answers.live_scores||null, live_scores_note:answers.live_scores_note||null,
        useful_feature:answers.useful_feature||null, useful_feature_other:answers.useful_feature_other||null,
        tech_issues:answers.tech_issues||null, tech_issues_note:answers.tech_issues_note||null,
        future_use:answers.future_use||null, suggestions:answers.suggestions||null,
        overall:answers.overall||null,
      });
    }catch(e){console.warn("Submit error",e);}
    setSaving(false);
    go("thanks");
  };

  const reset=()=>{ setMode(null);setName("");setStep(0);setAnswers({});go("welcome"); };

  if(screen==="admin") return <><style>{CSS}</style><Dashboard onSignOut={()=>go("welcome")}/></>;

  return (
    <>
      <style>{CSS}</style>
      {screen==="intro" && <VideoIntro onDone={()=>go("welcome")}/>}
      {screen!=="intro" && (
        <div key={key}>
          {screen==="welcome"     && <Welcome onStart={()=>go("participate")} onAdmin={()=>go("admin-login")}/>}
          {screen==="participate" && <Participate mode={mode} setMode={setMode} onBack={()=>go("welcome")} onContinue={()=>go(mode==="named"?"name":"survey",0)}/>}
          {screen==="name"        && <NameEntry name={name} setName={setName} onBack={()=>go("participate")} onContinue={()=>go("survey",0)}/>}
          {screen==="survey"      && <QuestionCard key={`q${step}`} q={Q[step]} stepNum={step+1} answers={answers} setAns={setAns} isLast={step===TOTAL-1} onBack={()=>step===0?go(mode==="named"?"name":"participate"):go("survey",step-1)} onNext={()=>step===TOTAL-1?submit():go("survey",step+1)}/>}
          {screen==="thanks"      && <Thanks onDone={reset}/>}
          {screen==="admin-login" && <AdminLogin onLogin={()=>setScreen("admin")} onBack={()=>go("welcome")}/>}
        </div>
      )}
    </>
  );
}
