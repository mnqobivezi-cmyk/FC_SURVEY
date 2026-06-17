import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qqikvklpnkfxauwavvmj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxaWt2a2xwbmtmeGF1d2F2dm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MTgwNzAsImV4cCI6MjA5MzI5NDA3MH0.R1iG33nxvomwTkWeERXncgK7MZ0tOB6bGUG5wD3atj0"
);

const FC_LOGO  = "https://static.wixstatic.com/media/4877d6_4bad42a571ec47e982d9b2ec2b4c9a22~mv2.jpeg";
const FC_VIDEO = "https://video.wixstatic.com/video/4877d6_d0e550fa2fc74401bce8384efdedea93/240p/mp4/file.mp4";
const GOLD     = "#f0b429";
const NAVY     = "#080e1f";
const ADMIN_PW = "2636";

/* ── Questions ─────────────────────────────────────────────── */
const Q = [
  { id:"used_app",   type:"radio",    label:"QUESTION 1 OF 8",
    title:"Did you use the Founders Cup app during the tournament?",
    hint:"Tap to select",
    opts:["Yes","No — I didn't use it"] },
  { id:"ease",       type:"scale",    label:"QUESTION 2 OF 8",
    title:"How easy was the app to use overall?",
    hint:"Drag up or down to select",
    opts:["Very easy","Easy","Okay","Difficult","Very difficult"] },
  { id:"live_scores",type:"iconlist", label:"QUESTION 3 OF 8",
    title:"How did the live scores and match timers help you follow the games?",
    hint:"Tap to select",
    opts:[{label:"Very helpful",icon:"check"},{label:"Somewhat helpful",icon:"minus"},{label:"Not helpful",icon:"x"},{label:"Didn't notice / didn't use",icon:"info"}],
    note:"Anything to add about the live scores? (optional)" },
  { id:"useful_feature",type:"chips", label:"QUESTION 4 OF 8",
    title:"Which part of the app did you find most useful?",
    hint:"Select all that apply",
    opts:["Live scores & match updates","News & announcements","Team & player info","Choir results","None of these"],
    other:true },
  { id:"tech_issues",type:"iconlist", label:"QUESTION 5 OF 8",
    title:"Did you experience any technical issues with the app?",
    hint:"Tap to select",
    opts:[{label:"No issues at all",icon:"check"},{label:"Minor issues",icon:"minus"},{label:"Major issues",icon:"x"}],
    note:"If yes, please describe briefly (optional)",
    showNoteIf:["Minor issues","Major issues"] },
  { id:"future_use", type:"radio",    label:"QUESTION 6 OF 8",
    title:"Would you like to use an app like this for future CHG events?",
    hint:"Tap to select",
    opts:["Yes, definitely","Maybe","No"] },
  { id:"suggestions",type:"textonly", label:"QUESTION 7 OF 8",
    title:"Any suggestions to improve the app for next time?",
    hint:"Optional — every idea helps" },
  { id:"overall",    type:"scale",    label:"QUESTION 8 OF 8",
    title:"Overall, how would you rate this year's Founders Cup tournament?",
    hint:"Drag up or down to select",
    opts:["Excellent","Very good","Good","Average","Poor"] },
];
const TOTAL = Q.length;
const CHART_COLORS = ["#f0b429","#7c3aed","#38d3c4","#fc8181","#68d391","#63b3ed","#f6ad55"];

/* ── Haptic (Android only) ─────────────────────────────────── */
function haptic(ms=18){
  try{ if(navigator.vibrate) navigator.vibrate(ms); }catch{}
}

/* ── Icon set (outlines only) ──────────────────────────────── */
function Ic({n,s=18,c="currentColor",w=1.6}){
  const p={fill:"none",stroke:c,strokeWidth:w,strokeLinecap:"round",strokeLinejoin:"round"};
  const paths={
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
    play:    <polygon fill={c} points="5,3 19,12 5,21"/>,
    volume:  <><path {...p} d="M11 5L6 9H2v6h4l5 4V5z"/><path {...p} d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></>,
    mute:    <><path {...p} d="M11 5L6 9H2v6h4l5 4V5z"/><path {...p} d="M23 9l-6 6M17 9l6 6"/></>,
    check2:  <path {...p} d="M22 11.08V12a10 10 0 11-5.93-9.14"/>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" style={{display:"block",flexShrink:0}}>{paths[n]||paths.info}</svg>;
}

/* ── CSS ───────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
html,body{background:${NAVY};color:#fff;font-family:'Barlow',sans-serif;overflow-x:hidden;}

/* ── video intro ── */
.fc-intro{position:fixed;inset:0;z-index:100;background:#000;display:flex;align-items:center;justify-content:center;}
.fc-intro video{width:100%;height:100%;object-fit:cover;}
.fc-intro-skip{position:absolute;bottom:28px;right:20px;font-family:'Barlow Condensed',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.4);cursor:pointer;padding:8px 14px;border:1px solid rgba(255,255,255,.15);border-radius:20px;background:rgba(0,0,0,.4);}
.fc-intro-bar{position:absolute;bottom:0;left:0;height:3px;background:${GOLD};transition:width .3s linear;}

/* ── outer wrap ── */
.fc-outer{position:relative;overflow:hidden;min-height:100vh;}

/* ── slide container ── */
.fc-slides{display:flex;width:100%;transition:transform .38s cubic-bezier(.4,0,.2,1);}
.fc-slide{min-width:100%;display:flex;align-items:center;justify-content:center;padding:28px 16px;min-height:100vh;background:${NAVY};background-image:radial-gradient(ellipse at 50% 0%,rgba(240,180,41,.06) 0%,transparent 55%);}

/* ── card ── */
.fc-card{width:100%;max-width:400px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);border-radius:18px;padding:26px 22px;backdrop-filter:blur(12px);}
.fc-card.glow{border-color:rgba(240,180,41,.28);box-shadow:0 0 0 1px rgba(240,180,41,.13),0 24px 64px rgba(0,0,0,.45);}

/* ── progress ── */
.fc-prog-wrap{width:100%;max-width:400px;margin-bottom:10px;}
.fc-prog-track{height:3px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden;}
.fc-prog-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#7c3aed 0%,${GOLD} 60%,#ff6b9d 100%);transition:width .4s cubic-bezier(.25,.46,.45,.94);}
.fc-prog-lbl{text-align:right;font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:2px;color:rgba(255,255,255,.3);margin-top:5px;text-transform:uppercase;}

/* ── type ── */
.fc-eye{font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:3.5px;text-transform:uppercase;color:${GOLD};font-weight:700;margin-bottom:9px;}
.fc-title{font-family:'Barlow Condensed',sans-serif;font-size:19px;font-weight:800;line-height:1.3;color:#fff;margin-bottom:6px;}
.fc-hint{font-size:11.5px;color:rgba(255,255,255,.38);margin-bottom:16px;}

/* ── options ── */
.fc-opt{width:100%;text-align:left;padding:13px 15px;border-radius:11px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);color:#fff;font-size:13.5px;font-weight:500;cursor:pointer;transition:border-color .15s,background .15s;margin-bottom:9px;display:flex;align-items:center;gap:11px;font-family:'Barlow',sans-serif;}
.fc-opt:hover{border-color:rgba(240,180,41,.3);background:rgba(240,180,41,.04);}
.fc-opt.sel{border-color:${GOLD};background:rgba(240,180,41,.09);}
.fc-radio{width:20px;height:20px;border-radius:50%;border:1.5px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
.fc-radio.sel{border-color:${GOLD};background:${GOLD};color:${NAVY};}
.fc-iconbox{width:32px;height:32px;border-radius:8px;border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:rgba(255,255,255,.4);transition:all .15s;}
.fc-opt.sel .fc-iconbox{border-color:${GOLD};color:${GOLD};background:rgba(240,180,41,.1);}

/* ── chips ── */
.fc-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;}
.fc-chip{padding:8px 15px;border-radius:20px;border:1px solid rgba(255,255,255,.11);background:rgba(255,255,255,.02);color:rgba(255,255,255,.75);font-size:12.5px;font-weight:500;cursor:pointer;transition:all .15s;font-family:'Barlow',sans-serif;}
.fc-chip:hover{border-color:rgba(240,180,41,.3);}
.fc-chip.sel{border-color:${GOLD};background:${GOLD};color:${NAVY};font-weight:700;}

/* ── textarea ── */
.fc-ta{width:100%;min-height:80px;padding:11px 13px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.18);color:#fff;font-family:'Barlow',sans-serif;font-size:13px;resize:vertical;line-height:1.55;transition:border-color .15s;margin-top:4px;}
.fc-ta:focus{outline:none;border-color:${GOLD};}
.fc-ta::placeholder{color:rgba(255,255,255,.25);}

/* ── scale picker ── */
.fc-scale{position:relative;height:168px;margin:4px 0 14px;overflow:hidden;cursor:ns-resize;user-select:none;touch-action:none;}
.fc-scale-fade{pointer-events:none;position:absolute;left:0;right:0;z-index:2;}
.fc-scale-fade.top{top:0;height:56px;background:linear-gradient(to bottom,${NAVY},transparent);}
.fc-scale-fade.bot{bottom:0;height:56px;background:linear-gradient(to top,${NAVY},transparent);}
.fc-scale-pill{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);z-index:3;pointer-events:none;display:flex;align-items:center;justify-content:center;}
.fc-scale-pill-inner{padding:0 28px;height:42px;line-height:42px;border-radius:10px;border:1.5px solid ${GOLD};background:rgba(240,180,41,.08);font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;color:#fff;white-space:nowrap;}
.fc-scale-list{position:absolute;left:0;right:0;display:flex;flex-direction:column;align-items:center;}
.fc-scale-item{height:42px;display:flex;align-items:center;justify-content:center;width:100%;font-family:'Barlow Condensed',sans-serif;font-size:14px;color:rgba(255,255,255,.22);font-weight:600;cursor:pointer;}
.fc-scale-item.active{color:transparent;}

/* ── buttons ── */
.fc-btn{width:100%;padding:14px;border-radius:11px;border:none;font-family:'Barlow Condensed',sans-serif;font-size:13.5px;font-weight:800;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .18s;display:flex;align-items:center;justify-content:center;gap:8px;}
.fc-btn:active{transform:scale(.98);}
.fc-btn.gold{background:linear-gradient(90deg,${GOLD} 0%,#ffd166 100%);color:${NAVY};}
.fc-btn.gold:disabled{opacity:.3;cursor:not-allowed;transform:none;}
.fc-btn.ghost{background:transparent;border:1px solid rgba(255,255,255,.13);color:rgba(255,255,255,.6);}
.fc-btn.ghost:hover{border-color:rgba(240,180,41,.4);color:${GOLD};}
.fc-btn.danger{background:rgba(229,62,62,.07);border:1px solid rgba(229,62,62,.25);color:#fc8181;}
.fc-row{display:flex;gap:9px;margin-top:14px;}
.fc-row .fc-btn{flex:1;}

/* ── participate ── */
.fc-pc{padding:14px 15px;border-radius:11px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);cursor:pointer;transition:all .15s;margin-bottom:9px;}
.fc-pc:hover{border-color:rgba(240,180,41,.3);}
.fc-pc.sel{border-color:${GOLD};background:rgba(240,180,41,.07);}
.fc-pc-t{font-size:13.5px;font-weight:700;margin-bottom:3px;}
.fc-pc-d{font-size:11.5px;color:rgba(255,255,255,.4);}
.fc-link{text-align:center;margin-top:12px;font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.28);cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-weight:700;transition:color .15s;}
.fc-link:hover{color:${GOLD};}
.fc-input{width:100%;padding:12px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.18);color:#fff;font-family:'Barlow',sans-serif;font-size:14px;margin-bottom:10px;transition:border-color .15s;}
.fc-input:focus{outline:none;border-color:${GOLD};}
.fc-input::placeholder{color:rgba(255,255,255,.28);}
.fc-hr{height:1px;background:linear-gradient(90deg,transparent,rgba(240,180,41,.3),transparent);margin:14px 0;}

/* ── admin ── */
.fc-admin{width:100%;max-width:920px;padding:20px 16px;}
.fc-stat-row{display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;}
.fc-stat{flex:1;min-width:90px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:16px;text-align:center;}
.fc-stat-n{font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;color:${GOLD};line-height:1;}
.fc-stat-l{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-top:4px;font-family:'Barlow Condensed',sans-serif;}
.fc-panel{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px;margin-bottom:12px;}
.fc-panel-t{font-family:'Barlow Condensed',sans-serif;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;color:${GOLD};font-weight:700;margin-bottom:12px;}
.fc-brow{display:flex;align-items:center;gap:10px;margin-bottom:9px;}
.fc-brow-l{font-size:12px;color:rgba(255,255,255,.7);flex:0 0 148px;}
.fc-brow-t{flex:1;height:6px;border-radius:4px;background:rgba(255,255,255,.06);overflow:hidden;}
.fc-brow-f{height:100%;border-radius:4px;transition:width .5s ease;}
.fc-brow-n{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;width:22px;text-align:right;flex-shrink:0;color:rgba(255,255,255,.5);}
.fc-quote{padding:11px 13px;border-left:3px solid ${GOLD};background:rgba(255,255,255,.02);border-radius:0 8px 8px 0;font-size:13px;color:rgba(255,255,255,.78);margin-bottom:8px;line-height:1.55;}
.fc-resp{display:flex;align-items:center;gap:10px;padding:11px 13px;border:1px solid rgba(255,255,255,.06);border-radius:10px;margin-bottom:7px;cursor:pointer;}
.fc-resp:hover{border-color:rgba(240,180,41,.2);}
.fc-tag{padding:3px 9px;border-radius:20px;font-size:9.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:'Barlow Condensed',sans-serif;flex-shrink:0;}
.fc-tag.named{background:rgba(240,180,41,.1);color:${GOLD};border:1px solid rgba(240,180,41,.22);}
.fc-tag.anon{background:rgba(255,255,255,.04);color:rgba(255,255,255,.45);border:1px solid rgba(255,255,255,.09);}
.fc-legend{display:flex;align-items:center;gap:7px;font-size:12px;color:rgba(255,255,255,.7);margin-bottom:5px;}
.fc-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.fc-donut-wrap{display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.fc-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
@media(max-width:640px){.fc-grid2{grid-template-columns:1fr;}.fc-brow-l{flex:0 0 110px;font-size:11px;}}
`;

/* ── Video intro ────────────────────────────────────────────── */
function VideoIntro({ onDone }) {
  const vRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const v = vRef.current; if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
    const onTime = () => {
      if (v.duration) setProgress((v.currentTime / v.duration) * 100);
    };
    const onEnd = () => setTimeout(onDone, 300);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    return () => { v.removeEventListener("timeupdate", onTime); v.removeEventListener("ended", onEnd); };
  }, [onDone]);

  return (
    <div className="fc-intro">
      <video ref={vRef} src={FC_VIDEO} playsInline muted style={{width:"100%",height:"100%",objectFit:"cover"}}/>
      <div className="fc-intro-bar" style={{width:`${progress}%`}}/>
    </div>
  );
}

/* ── Scale picker with demo animation ──────────────────────── */
function ScalePicker({ opts, value, onChange }) {
  const IH = 42;
  const CENTER = 84 - IH / 2;
  const initIdx = value != null ? opts.indexOf(value) : Math.floor(opts.length / 2);
  const [dIdx, setDIdx] = useState(initIdx);
  const [animOffset, setAnimOffset] = useState(0); // extra px offset for demo
  const startY = useRef(null);
  const startI = useRef(initIdx);
  const prevIdx = useRef(initIdx);
  const demoRef = useRef(null);
  const hasInteracted = useRef(false);

  useEffect(() => { setDIdx(initIdx); }, [value]);

  // Demo animation: nudge down then up then settle, twice
  useEffect(() => {
    let cancelled = false;
    const STEP = IH;
    const run = async () => {
      const pause = (ms) => new Promise(r => setTimeout(r, ms));
      await pause(600);
      for (let rep = 0; rep < 2; rep++) {
        if (cancelled || hasInteracted.current) break;
        // move down (show "next harder" option)
        setAnimOffset(STEP);
        await pause(420);
        if (cancelled || hasInteracted.current) break;
        setAnimOffset(0);
        await pause(300);
        if (cancelled || hasInteracted.current) break;
        // move up (show "easier" option)
        setAnimOffset(-STEP);
        await pause(420);
        if (cancelled || hasInteracted.current) break;
        setAnimOffset(0);
        await pause(500);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  const commit = useCallback((i) => {
    const c = Math.max(0, Math.min(opts.length - 1, i));
    if (c !== prevIdx.current) { haptic(18); prevIdx.current = c; }
    setDIdx(c);
    onChange(opts[c]);
  }, [opts, onChange]);

  const onPD = (e) => {
    hasInteracted.current = true;
    setAnimOffset(0);
    startY.current = e.clientY;
    startI.current = dIdx;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPM = (e) => {
    if (startY.current === null) return;
    const delta = Math.round((startY.current - e.clientY) / IH);
    commit(startI.current + delta);
  };
  const onPU = () => { startY.current = null; };

  const translateY = CENTER - dIdx * IH - animOffset;

  return (
    <div className="fc-scale" onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} onPointerCancel={onPU}>
      <div className="fc-scale-fade top" />
      <div className="fc-scale-pill"><div className="fc-scale-pill-inner">{opts[dIdx]}</div></div>
      <div className="fc-scale-list" style={{ transform: `translateY(${translateY}px)`, transition: startY.current ? "none" : "transform .22s cubic-bezier(.25,.46,.45,.94)" }}>
        {opts.map((o, i) => (
          <div key={o} className={`fc-scale-item${i === dIdx ? " active" : ""}`} onClick={() => { hasInteracted.current = true; commit(i); }}>{o}</div>
        ))}
      </div>
      <div className="fc-scale-fade bot" />
    </div>
  );
}

/* ── Participate card ───────────────────────────────────────── */
function Participate({ mode, setMode, onBack, onContinue }) {
  return (
    <div className="fc-card">
      <div className="fc-eye">Before You Begin</div>
      <div className="fc-title">How would you like to participate?</div>
      <div className="fc-hint" style={{ marginBottom: 16 }}>Your honesty matters most. Choose what feels comfortable.</div>
      <div className={`fc-pc${mode === "named" ? " sel" : ""}`} onClick={() => { haptic(); setMode("named"); }}>
        <div className="fc-pc-t">Share my name</div>
        <div className="fc-pc-d">The organising team can follow up with you personally</div>
      </div>
      <div className={`fc-pc${mode === "anon" ? " sel" : ""}`} onClick={() => { haptic(); setMode("anon"); }}>
        <div className="fc-pc-t">Stay anonymous</div>
        <div className="fc-pc-d">Your responses stay private and aren't linked to you</div>
      </div>
      <div className="fc-row">
        <button className="fc-btn ghost" onClick={onBack}>Back</button>
        <button className="fc-btn gold" disabled={!mode} onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
}

/* ── Name entry ─────────────────────────────────────────────── */
function NameEntry({ name, setName, onBack, onContinue }) {
  return (
    <div className="fc-card">
      <div className="fc-eye">Almost There</div>
      <div className="fc-title">What's your name?</div>
      <div className="fc-hint">So the team knows who to thank</div>
      <input className="fc-input" placeholder="Your name" value={name} autoFocus
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === "Enter" && name.trim() && onContinue()} />
      <div className="fc-row">
        <button className="fc-btn ghost" onClick={onBack}>Back</button>
        <button className="fc-btn gold" disabled={!name.trim()} onClick={onContinue}>Continue</button>
      </div>
    </div>
  );
}

/* ── Question card ──────────────────────────────────────────── */
function QuestionCard({ q, step, answers, setAns, onBack, onNext, isLast }) {
  const val = answers[q.id];
  const noteVal = answers[q.id + "_note"] || "";
  const otherVal = answers[q.id + "_other"] || "";
  const showNote = q.showNoteIf ? q.showNoteIf.includes(val) : true;
  const canNext = q.type === "textonly" || q.type === "chips" ? true : val != null;

  useEffect(() => {
    if (q.type === "scale" && val == null)
      setAns(q.id, q.opts[Math.floor(q.opts.length / 2)]);
  }, [q.id]);

  return (
    <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", alignItems: "stretch" }}>
      <div className="fc-prog-wrap">
        <div className="fc-prog-track"><div className="fc-prog-fill" style={{ width: `${(step / TOTAL) * 100}%` }} /></div>
        <div className="fc-prog-lbl">{step} of {TOTAL}</div>
      </div>
      <div className="fc-card">
        <div className="fc-eye">{q.label}</div>
        <div className="fc-title">{q.title}</div>
        <div className="fc-hint">{q.hint}</div>

        {q.type === "radio" && q.opts.map(o => (
          <button key={o} className={`fc-opt${val === o ? " sel" : ""}`} onClick={() => { haptic(); setAns(q.id, o); }}>
            <span className={`fc-radio${val === o ? " sel" : ""}`}>{val === o && <Ic n="check" s={11} c={NAVY} />}</span>{o}
          </button>
        ))}

        {q.type === "iconlist" && (
          <>
            {q.opts.map(o => (
              <button key={o.label} className={`fc-opt${val === o.label ? " sel" : ""}`} onClick={() => { haptic(); setAns(q.id, o.label); }}>
                <span className="fc-iconbox"><Ic n={o.icon} s={15} /></span>{o.label}
              </button>
            ))}
            {q.note && showNote && (
              <textarea className="fc-ta" placeholder={q.note} value={noteVal}
                onChange={e => setAns(q.id + "_note", e.target.value)} />
            )}
          </>
        )}

        {q.type === "chips" && (
          <>
            <div className="fc-chips">
              {q.opts.map(o => {
                const list = Array.isArray(val) ? val : [];
                const on = list.includes(o);
                return (
                  <button key={o} className={`fc-chip${on ? " sel" : ""}`}
                    onClick={() => { haptic(); setAns(q.id, on ? list.filter(x => x !== o) : [...list, o]); }}>
                    {o}
                  </button>
                );
              })}
            </div>
            {q.other && (
              <input className="fc-input" placeholder="Other — please specify..."
                value={otherVal} onChange={e => setAns(q.id + "_other", e.target.value)} />
            )}
          </>
        )}

        {q.type === "scale" && (
          <ScalePicker opts={q.opts} value={val} onChange={v => setAns(q.id, v)} />
        )}

        {q.type === "textonly" && (
          <textarea className="fc-ta" style={{ minHeight: 116 }} placeholder="Type your thoughts here…"
            value={val || ""} onChange={e => setAns(q.id, e.target.value)} autoFocus />
        )}

        <div className="fc-row">
          <button className="fc-btn ghost" onClick={onBack}>Back</button>
          <button className="fc-btn gold" disabled={!canNext} onClick={onNext}>
            {isLast ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Thank you ──────────────────────────────────────────────── */
function Thanks({ onDone }) {
  return (
    <div className="fc-card glow" style={{ textAlign: "center" }}>
      <img src={FC_LOGO} alt="" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: `2px solid ${GOLD}`, boxShadow: "0 0 20px rgba(240,180,41,.3)", display: "block", margin: "0 auto 14px" }} />
      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, fontWeight: 900, textTransform: "uppercase", marginBottom: 4 }}>
        Thank <span style={{ color: GOLD }}>You!</span>
      </div>
      <div className="fc-hr" />
      <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.65, marginBottom: 20 }}>
        Your feedback has been received. We're grateful for everyone who made this year's Founders Cup such a special Biennial Championship — see you next time!
      </div>
      <button className="fc-btn ghost" onClick={onDone}>Done</button>
    </div>
  );
}

/* ── Admin login ────────────────────────────────────────────── */
function AdminLogin({ onLogin, onBack }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const go = () => {
    if (pw === ADMIN_PW) onLogin();
    else { setErr(true); setTimeout(() => setErr(false), 1400); }
  };
  return (
    <div className="fc-card">
      <img src={FC_LOGO} alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: `2px solid ${GOLD}`, display: "block", margin: "0 auto 12px" }} />
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div className="fc-eye" style={{ textAlign: "center" }}>Admin Access</div>
        <div className="fc-title" style={{ textAlign: "center" }}>Dashboard Login</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)" }}>Founders Cup Survey</div>
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 5 }}>Password</div>
      <input className="fc-input" type="password" placeholder="Enter admin password"
        value={pw} onChange={e => setPw(e.target.value)}
        onKeyDown={e => e.key === "Enter" && go()}
        style={err ? { borderColor: "#fc8181" } : {}} />
      {err && <div style={{ color: "#fc8181", fontSize: 11.5, textAlign: "center", marginBottom: 8 }}>Incorrect password</div>}
      <button className="fc-btn gold" onClick={go}><Ic n="lock" s={14} c={NAVY} /> Enter Dashboard</button>
      <div className="fc-link" onClick={onBack}>Back to survey</div>
    </div>
  );
}

/* ── Dashboard charts ───────────────────────────────────────── */
function BarPanel({ title, data }) {
  const max = Math.max(1, ...data.map(d => d.n));
  return (
    <div className="fc-panel">
      <div className="fc-panel-t">{title}</div>
      {data.map((d, i) => (
        <div className="fc-brow" key={d.label}>
          <div className="fc-brow-l">{d.label}</div>
          <div className="fc-brow-t"><div className="fc-brow-f" style={{ width: `${(d.n / max) * 100}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} /></div>
          <div className="fc-brow-n">{d.n}</div>
        </div>
      ))}
    </div>
  );
}

function DonutPanel({ title, data }) {
  const total = data.reduce((a, b) => a + b.n, 0) || 1;
  let acc = 0;
  const segs = data.map((d, i) => { const f = d.n / total; const s = acc; acc += f; return { ...d, s, e: acc, c: CHART_COLORS[i % CHART_COLORS.length] }; });
  const r = 50, cx = 60, cy = 60, sw = 14, circ = 2 * Math.PI * r;
  return (
    <div className="fc-panel">
      <div className="fc-panel-t">{title}</div>
      <div className="fc-donut-wrap">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth={sw} />
          {segs.map(s => (
            <circle key={s.label} cx={cx} cy={cy} r={r} fill="none" stroke={s.c} strokeWidth={sw}
              strokeDasharray={`${circ * (s.e - s.s)} ${circ}`} strokeDashoffset={-circ * s.s}
              transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt" />
          ))}
          <text x={cx} y={cy + 7} textAnchor="middle" fill="#fff"
            fontFamily="'Barlow Condensed',sans-serif" fontSize="22" fontWeight="900">{total}</text>
        </svg>
        <div>{segs.map(s => <div className="fc-legend" key={s.label}><span className="fc-dot" style={{ background: s.c }} />{s.label} ({s.n})</div>)}</div>
      </div>
    </div>
  );
}

function tally(rows, col, opts) {
  const c = {}; opts.forEach(o => c[o] = 0);
  rows.forEach(r => { const v = r[col]; if (v && c[v] !== undefined) c[v]++; });
  return opts.map(o => ({ label: o, n: c[o] }));
}
function tallyArr(rows, col, opts) {
  const c = {}; opts.forEach(o => c[o] = 0);
  rows.forEach(r => { const v = r[col]; if (Array.isArray(v)) v.forEach(x => { if (c[x] !== undefined) c[x]++; }); });
  return opts.map(o => ({ label: o, n: c[o] }));
}

/* ── Dashboard ──────────────────────────────────────────────── */
function Dashboard({ onSignOut }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [exp, setExp] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("fc_survey_responses").select("*").order("created_at", { ascending: false });
    setRows(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const deleteOne = async (id) => { await supabase.from("fc_survey_responses").delete().eq("id", id); load(); };
  const resetAll = async () => { if (!window.confirm("Delete ALL responses? This cannot be undone.")) return; await supabase.from("fc_survey_responses").delete().neq("id", "00000000-0000-0000-0000-000000000000"); load(); };

  const named = rows.filter(r => r.mode === "named").length;
  const anon = rows.length - named;

  const usedApp    = tally(rows, "used_app",   Q[0].opts);
  const ease       = tally(rows, "ease",        Q[1].opts);
  const liveScores = tally(rows, "live_scores", Q[2].opts.map(o => o.label));
  const useful     = tallyArr(rows, "useful_feature", Q[3].opts);
  const tech       = tally(rows, "tech_issues", Q[4].opts.map(o => o.label));
  const future     = tally(rows, "future_use",  Q[5].opts);
  const overall    = tally(rows, "overall",     Q[7].opts);
  const suggestions = rows.map(r => r.suggestions).filter(s => s && s.trim());
  const techNotes   = rows.map(r => r.tech_issues_note).filter(s => s && s.trim());

  const genInsights = async () => {
    setAiLoading(true);
    try {
      const summary = { total: rows.length, usedApp, ease, liveScores, useful, tech, future, overall, suggestions: suggestions.slice(0, 20), techNotes: techNotes.slice(0, 10) };
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: `Post-tournament feedback survey data for Founders Cup app (Church of the Holy Ghost biennial sports tournament). Data: ${JSON.stringify(summary)}. Write 4-6 concise actionable bullet-point insights for the organising team: what worked well, what to improve, key themes from open feedback. Plain text, no markdown.` }] })
      });
      const d = await res.json();
      setInsights(d.content.filter(b => b.type === "text").map(b => b.text).join("\n"));
    } catch { setInsights("Could not generate insights — please try again."); }
    setAiLoading(false);
  };

  if (loading) return <div style={{ color: "rgba(255,255,255,.4)", fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 2, textAlign: "center", padding: 48 }}>Loading responses…</div>;

  return (
    <div className="fc-admin">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 900 }}>Response Dashboard</div>
          <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.4)", marginTop: 2 }}>Church of the Holy Ghost · Founders Cup</div>
        </div>
        <button className="fc-btn ghost" style={{ width: "auto", padding: "9px 16px" }} onClick={onSignOut}>Sign out</button>
      </div>

      <div className="fc-stat-row">
        <div className="fc-stat"><div className="fc-stat-n">{rows.length}</div><div className="fc-stat-l">Total Responses</div></div>
        <div className="fc-stat"><div className="fc-stat-n">{named}</div><div className="fc-stat-l">Named</div></div>
        <div className="fc-stat"><div className="fc-stat-n">{anon}</div><div className="fc-stat-l">Anonymous</div></div>
      </div>

      <button className="fc-btn ghost" style={{ marginBottom: 9, borderColor: "rgba(240,180,41,.35)", color: GOLD }} onClick={genInsights} disabled={aiLoading || !rows.length}>
        <Ic n="sparkle" s={14} c={GOLD} />{aiLoading ? "Generating AI Insights…" : "Generate AI Insights"}
      </button>
      {insights && <div className="fc-panel" style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,.82)" }}>{insights}</div>}

      <button className="fc-btn danger" style={{ marginBottom: 14 }} onClick={resetAll} disabled={!rows.length}>
        <Ic n="trash" s={13} /> Reset — Delete All Responses
      </button>

      {!rows.length && <div className="fc-panel" style={{ textAlign: "center", color: "rgba(255,255,255,.35)", padding: 28 }}>No responses yet. Share the survey link with your congregation.</div>}

      {rows.length > 0 && (
        <>
          <div className="fc-grid2">
            <BarPanel title="Q1 — App Usage" data={usedApp} />
            <BarPanel title="Q2 — Ease of Use" data={ease} />
            <BarPanel title="Q3 — Live Scores Helpfulness" data={liveScores} />
            <DonutPanel title="Q6 — Future Use Interest" data={future} />
            <BarPanel title="Q5 — Technical Issues" data={tech} />
            <BarPanel title="Q8 — Overall Tournament Rating" data={overall} />
          </div>
          <BarPanel title="Q4 — Most Useful Feature (multi-select)" data={useful} />

          {(suggestions.length > 0 || techNotes.length > 0) && (
            <div className="fc-panel">
              <div className="fc-panel-t">Final Reflections</div>
              {suggestions.map((s, i) => <div className="fc-quote" key={"s" + i}>{s}</div>)}
              {techNotes.map((s, i) => <div className="fc-quote" key={"t" + i} style={{ borderLeftColor: "#fc8181" }}>⚠ {s}</div>)}
            </div>
          )}

          <div className="fc-panel">
            <div className="fc-panel-t">Individual Responses</div>
            {rows.map((r, i) => (
              <div key={r.id}>
                <div className="fc-resp" onClick={() => setExp(exp === i ? null : i)}>
                  <Ic n={r.mode === "named" ? "user" : "shield"} s={15} c={GOLD} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{r.mode === "named" ? r.respondent_name : "Anonymous"}</div>
                    <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.35)" }}>{new Date(r.created_at).toLocaleString()} · {r.device || "web"}</div>
                  </div>
                  <span className={`fc-tag ${r.mode === "named" ? "named" : "anon"}`}>{r.mode === "named" ? "Named" : "Anon"}</span>
                  <button className="fc-btn danger" style={{ width: "auto", padding: "5px 10px", fontSize: 9.5, borderRadius: 7 }}
                    onClick={e => { e.stopPropagation(); deleteOne(r.id); }}>Delete</button>
                  <Ic n="chevdown" s={13} c="rgba(255,255,255,.3)" />
                </div>
                {exp === i && (
                  <div style={{ padding: "0 12px 12px 38px", fontSize: 12, color: "rgba(255,255,255,.65)", lineHeight: 1.8 }}>
                    {Q.map(q => {
                      const v = r[q.id];
                      if (!v || (Array.isArray(v) && !v.length) || v === "") return null;
                      return <div key={q.id}><span style={{ color: GOLD }}>{q.title.length > 55 ? q.title.slice(0, 55) + "…" : q.title}</span>: {Array.isArray(v) ? v.join(", ") : String(v)}</div>;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Slide shell — handles the left-to-right slide transitions ── */
const SCREENS = ["welcome", "participate", "name", ...Q.map((_, i) => `q${i}`), "thanks"];

function SlideShell({ children, activeIdx }) {
  return (
    <div className="fc-outer">
      <div className="fc-slides" style={{ transform: `translateX(-${activeIdx * 100}%)` }}>
        {children}
      </div>
    </div>
  );
}

/* ── Welcome card ────────────────────────────────────────────── */
function Welcome({ onStart, onAdmin }) {
  return (
    <div className="fc-card glow">
      <img src={FC_LOGO} alt="FC" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: `2px solid ${GOLD}`, boxShadow: "0 0 20px rgba(240,180,41,.3)", display: "block", margin: "0 auto 12px" }} />
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 26, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>Founder's <span style={{ color: GOLD }}>Cup</span></div>
        <div style={{ fontSize: 10, letterSpacing: 3.5, textTransform: "uppercase", color: GOLD, fontWeight: 700, marginTop: 3, fontFamily: "'Barlow Condensed',sans-serif" }}>Church of the Holy Ghost</div>
      </div>
      <div className="fc-hr" />
      <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", textAlign: "center", lineHeight: 1.65, marginBottom: 20 }}>
        The tournament may be over, but your voice matters. Share how the app worked for you and help us make the next Founders Cup even better — it'll take about 2 minutes.
      </div>
      <button className="fc-btn gold" onClick={onStart}><Ic n="trophy" s={15} c={NAVY} /> Start Survey</button>
      <div className="fc-link" onClick={onAdmin}>Admin</div>
    </div>
  );
}

/* ── Root App ────────────────────────────────────────────────── */
export default function App() {
  const [introPlaying, setIntroPlaying] = useState(true);
  const [view, setView] = useState("welcome"); // welcome | participate | name | survey | thanks | admin-login | admin
  const [slideIdx, setSlideIdx] = useState(0);
  const [mode, setMode] = useState(null);
  const [name, setName] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);

  const setAns = (k, v) => setAnswers(a => ({ ...a, [k]: v }));

  // Map view → slide index for the horizontal slide rail
  const viewToSlide = useCallback((v, s) => {
    if (v === "welcome")     return 0;
    if (v === "participate") return 1;
    if (v === "name")        return 2;
    if (v === "survey")      return 3 + s;
    if (v === "thanks")      return 3 + TOTAL;
    return 0;
  }, []);

  const go = (newView, newStep = 0) => {
    setView(newView);
    setStep(newStep);
    setSlideIdx(viewToSlide(newView, newStep));
  };

  const submit = async () => {
    setSaving(true);
    try {
      await supabase.from("fc_survey_responses").insert({
        mode,
        respondent_name: mode === "named" ? name : null,
        device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "web",
        used_app:              answers.used_app || null,
        ease:                  answers.ease || null,
        live_scores:           answers.live_scores || null,
        live_scores_note:      answers.live_scores_note || null,
        useful_feature:        answers.useful_feature || null,
        useful_feature_other:  answers.useful_feature_other || null,
        tech_issues:           answers.tech_issues || null,
        tech_issues_note:      answers.tech_issues_note || null,
        future_use:            answers.future_use || null,
        suggestions:           answers.suggestions || null,
        overall:               answers.overall || null,
      });
    } catch (e) { console.warn("Submit error", e); }
    setSaving(false);
    go("thanks");
  };

  const reset = () => { setMode(null); setName(""); setStep(0); setAnswers({}); go("welcome"); };

  if (introPlaying) return (
    <>
      <style>{CSS}</style>
      <VideoIntro onDone={() => setIntroPlaying(false)} />
    </>
  );

  if (view === "admin-login") return (
    <div style={{ minHeight: "100vh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <style>{CSS}</style>
      <AdminLogin onLogin={() => setView("admin")} onBack={() => go("welcome")} />
    </div>
  );

  if (view === "admin") return (
    <div style={{ minHeight: "100vh", background: NAVY, padding: "20px 0", backgroundImage: "radial-gradient(ellipse at 50% 0%,rgba(240,180,41,.05) 0%,transparent 55%)" }}>
      <style>{CSS}</style>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Dashboard onSignOut={() => go("welcome")} />
      </div>
    </div>
  );

  // Build all slides
  const slides = [
    // 0: welcome
    <div key="welcome" className="fc-slide">
      <Welcome onStart={() => go("participate")} onAdmin={() => setView("admin-login")} />
    </div>,
    // 1: participate
    <div key="participate" className="fc-slide">
      <Participate mode={mode} setMode={setMode} onBack={() => go("welcome")} onContinue={() => go(mode === "named" ? "name" : "survey", 0)} />
    </div>,
    // 2: name
    <div key="name" className="fc-slide">
      <NameEntry name={name} setName={setName} onBack={() => go("participate")} onContinue={() => go("survey", 0)} />
    </div>,
    // 3..3+TOTAL-1: questions
    ...Q.map((q, i) => (
      <div key={`q${i}`} className="fc-slide">
        <QuestionCard
          q={q} step={i + 1} answers={answers} setAns={setAns}
          isLast={i === TOTAL - 1}
          onBack={() => {
            if (i === 0) go(mode === "named" ? "name" : "participate");
            else go("survey", i - 1);
          }}
          onNext={() => {
            haptic(22);
            if (i === TOTAL - 1) submit();
            else go("survey", i + 1);
          }}
        />
      </div>
    )),
    // 3+TOTAL: thanks
    <div key="thanks" className="fc-slide">
      <Thanks onDone={reset} />
    </div>,
  ];

  return (
    <>
      <style>{CSS}</style>
      <SlideShell activeIdx={slideIdx}>
        {slides}
      </SlideShell>
    </>
  );
}
