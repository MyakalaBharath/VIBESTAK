import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, ArrowRight, Bot, Check, ChevronRight, CircleDot, Code2, Cpu, Database, FileCode2, GitBranch, Layers3, LayoutDashboard, LogIn, Menu, Play, Rocket, Search, Send, Settings, ShieldCheck, Sparkles, Terminal, TestTube2, X, Zap } from "lucide-react";

type Phase = "idle"|"idea"|"plan"|"build"|"run"|"test"|"failure"|"diagnose"|"fix"|"retest"|"verified"|"ship";
const phases: {id:Phase,label:string,short:string}[]=[
 {id:"idea",label:"IDEA",short:"Input"},{id:"plan",label:"PLAN",short:"Architecture"},{id:"build",label:"BUILD",short:"Generate"},
 {id:"run",label:"RUN",short:"Sandbox"},{id:"test",label:"TEST",short:"Verify"},{id:"failure",label:"FAIL",short:"Detect"},
 {id:"diagnose",label:"DIAGNOSE",short:"Trace"},{id:"fix",label:"FIX",short:"Patch"},{id:"retest",label:"RETEST",short:"Regression"},
 {id:"verified",label:"VERIFY",short:"Verified"},{id:"ship",label:"SHIP",short:"Deploy"}
];
const tests0=[
 ["Homepage loads","FUNCTIONAL"],["Navigation works","NAVIGATION"],["Registration API responds","API"],["Mobile layout","RESPONSIVENESS"],["Required fields validate","ERROR HANDLING"],["Basic accessibility","ACCESSIBILITY"],["Dependency scan","BASIC SECURITY"],["Initial performance","PERFORMANCE"]
];
const demoIdea="Build a student hackathon management dashboard where students discover hackathons, register, create teams and track submissions.";

function now(){return new Date().toLocaleTimeString([], {hour12:false});}
function usePersistent<T>(key:string, initial:T){
 const [v,setV]=useState<T>(()=>{try{const x=localStorage.getItem(key);return x?JSON.parse(x):initial}catch{return initial}});
 useEffect(()=>localStorage.setItem(key,JSON.stringify(v)),[key,v]);
 return [v,setV] as const;
}

function App(){
 const [view,setView]=useState("overview");
 const [idea,setIdea]=useState("");
 const [phase,setPhase]=useState<Phase>("idle");
 const [demo,setDemo]=useState(false);
 const [running,setRunning]=useState(false);
 const [tests,setTests]=useState(tests0.map(([name,cat],i)=>({name,cat,status:i===2?"idle":"idle"} as any)));
 const [events,setEvents]=useState<string[]>(["System online.","Sandbox ready.","Verification engine standing by."]);
 const [projects,setProjects]=usePersistent<any[]>("vibeloop-projects",[]);
 const [selectedNode,setSelectedNode]=useState("API");
 const [mobileNav,setMobileNav]=useState(false);
 const [chat,setChat]=useState<string[]>(["Engineering Agent online. Ask about the build, architecture, tests or patches."]);
 const [input,setInput]=useState("");
 const timers=useRef<number[]>([]);
 const activeIndex=phases.findIndex(x=>x.id===phase);
 const isLoop=running||phase!=="idle";
 const addEvent=(s:string)=>setEvents(e=>[`${now()}  ${s}`,...e].slice(0,16));
 const wait=(ms:number)=>new Promise(r=>setTimeout(r,ms));
 const clearTimers=()=>{timers.current.forEach(clearTimeout);timers.current=[]};

 useEffect(()=>()=>clearTimers(),[]);
 const startBuild=async (isDemo=false)=>{
   clearTimers(); setDemo(isDemo); setRunning(true); setIdea(isDemo?demoIdea:idea||demoIdea);
   setTests(tests0.map(([name,cat])=>({name,cat,status:"idle"})));
   setEvents([]); setChat(["Engineering Agent online. Requirement received."]);
   const seq: [Phase,string][]=[
    ["idea","Requirement captured and normalized."],["plan","Generating product plan and architecture."],
    ["build","Creating project structure and components."],["run","Starting isolated preview sandbox."],
    ["test","Running full verification suite."],["failure","Controlled demo failure detected in Registration API."],
    ["diagnose","Tracing request path to affected component."],["fix","Generating and applying minimal patch."],
    ["retest","Re-running failed test plus regression suite."],["verified","All critical checks passed."],["ship","Release package marked ready."]
   ];
   for(let i=0;i<seq.length;i++){
     const [p,msg]=seq[i]; setPhase(p); addEvent(msg); setChat(c=>[`${msg}`,...c].slice(0,6));
     if(p==="test"){
       setTests(t=>t.map((x,j)=>({...x,status:j<2?"pass":j===2?"running":"pass"})));
     }
     if(p==="failure"){
       setTests(t=>t.map((x,j)=>j===2?{...x,status:"fail"}:x));
     }
     if(p==="fix"){
       setTests(t=>t.map((x,j)=>j===2?{...x,status:"fixing"}:x));
     }
     if(p==="retest"){
       setTests(t=>t.map((x,j)=>({...x,status:j===2?"running":"pass"})));
     }
     if(p==="verified"){
       setTests(t=>t.map(x=>({...x,status:"pass"})));
     }
     await wait(p==="failure"?1000:650);
   }
   setRunning(false);
   const project={id:Date.now(),name:isDemo?"HackathonHub":(idea.slice(0,34)||"Untitled Build"),description:isDemo?demoIdea:idea||demoIdea,created:new Date().toLocaleDateString(),status:"VERIFIED",lastBuild:"Just now",tests:"8/8",fixes:isDemo?1:0,deploy:"READY"};
   setProjects(p=>[project,...p.filter(x=>x.name!==project.name)].slice(0,8));
   setView("overview");
 };
 const stop=()=>{clearTimers();setRunning(false);setPhase("idle");addEvent("Run stopped by user.");};
 const statusFor=(id:Phase)=>activeIndex>=phases.findIndex(x=>x.id===id);
 const nav=[
  ["overview","Overview",LayoutDashboard],["new","New Project",Sparkles],["projects","Projects",Layers3],["build","Build",Cpu],
  ["tests","Tests",TestTube2],["issues","Issues",AlertTriangle],["deploy","Deploy",Rocket],["activity","Activity",Activity],["settings","Settings",Settings]
 ] as const;

 const agentReply=(q:string)=>{
   const s=q.toLowerCase();
   if(s.includes("fail")) return "The controlled failure is isolated to the Registration API route. The demo traces the request path, applies a patch adapter, then runs regression checks.";
   if(s.includes("change")||s.includes("patch")) return "The demo patch restores the missing registration route contract. In a live provider integration, the exact repository diff would be generated and applied server-side.";
   if(s.includes("architecture")) return "The workspace models a client → API → backend → database flow. Node telemetry in this demo is simulated and labeled accordingly.";
   if(s.includes("performance")) return "The current demo reports performance as a verification category. A production adapter can connect Lighthouse, Playwright or a real sandbox runner.";
   return "I can explain the current workflow, test state, architecture, affected component, or deployment readiness.";
 };
 const send=()=>{if(!input.trim())return; const q=input.trim();setChat(c=>[q,...c]);setTimeout(()=>setChat(c=>[agentReply(q),...c].slice(0,8)),250);setInput("")};

 return <div className="app">
   <header className="topbar">
    <div className="brand" onClick={()=>setView("overview")}><div className="brandmark"><Zap size={16}/></div><span>VIBE<span>LOOP</span></span><em>ENGINEERING LOOP</em></div>
    <div className="top-status">{["AI ENGINE","BUILD","TEST ENGINE","SANDBOX","DEPLOYMENT"].map((x,i)=><div key={x} className="status"><i className={isLoop&&i<4?"active":""}/>{x}<b>{isLoop&&i===1?"RUNNING":"ONLINE"}</b></div>)}</div>
    <div className="top-actions"><button className="ghost demoBtn" onClick={()=>startBuild(true)}><Play size={14}/> START JUDGES DEMO</button><button className="iconBtn" onClick={()=>setMobileNav(!mobileNav)}><Menu size={18}/></button></div>
   </header>

   <div className="shell">
    <aside className={`sidebar ${mobileNav?"show":""}`}>
      <div className="workspace"><div className="avatar">BM</div><div><small>WORKSPACE</small><strong>VIBELOOP LAB</strong></div></div>
      <nav>{nav.map(([id,label,Icon])=><button key={id} className={view===id?"selected":""} onClick={()=>{setView(id);setMobileNav(false)}}><Icon size={16}/>{label}{id==="issues"&&phase==="failure"?<span className="badge">1</span>:null}</button>)}</nav>
      <div className="side-bottom"><div className="side-card"><ShieldCheck size={18}/><div><strong>Sandbox</strong><span>Demo-safe environment</span></div><i className="online"/></div><small>V1.0.0 • LOCAL STATE</small></div>
    </aside>

    <main className="main">
      {view==="overview" && <Overview phase={phase} activeIndex={activeIndex} start={()=>startBuild(true)} running={running} stop={stop} setView={setView} selectedNode={selectedNode} setSelectedNode={setSelectedNode}/>}
      {view==="new" && <NewProject idea={idea} setIdea={setIdea} start={()=>startBuild(false)} running={running}/>}
      {view==="projects" && <Projects projects={projects} setView={setView}/>}
      {view==="build" && <BuildConsole events={events} phase={phase} activeIndex={activeIndex}/>}
      {view==="tests" && <Tests tests={tests} phase={phase} run={()=>startBuild(false)}/>}
      {view==="issues" && <Issues phase={phase} setView={setView}/>}
      {view==="deploy" && <Deploy phase={phase}/>}
      {view==="activity" && <BuildConsole events={events} phase={phase} activeIndex={activeIndex}/>}
      {view==="settings" && <SettingsView/>}
    </main>

    <aside className="agent">
      <div className="panelTitle"><span><Bot size={17}/> ENGINEERING AGENT</span><i className="online"/></div>
      <div className="agentState"><div className="coreMini"><span/></div><div><strong>{running?"ACTIVE":"STANDBY"}</strong><small>{phase==="failure"?"Failure detected":phase==="fix"?"Applying patch":phase==="verified"?"System verified":"Monitoring workspace"}</small></div></div>
      <div className="chat">
       {chat.slice(0,6).map((m,i)=><div className={i===0?"agentMsg":"userMsg"} key={i}>{m}</div>)}
      </div>
      <div className="quick">{["Why did this test fail?","What did you change?","Explain architecture"].map(x=><button key={x} onClick={()=>{setInput(x);setTimeout(send,0)}}>{x}</button>)}</div>
      <div className="chatInput"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask the engineering agent..."/><button onClick={send}><Send size={15}/></button></div>
    </aside>
   </div>
   <div className="timeline"><div className="timelineInner">{phases.map((p,i)=><div key={p.id} className={`tl ${statusFor(p.id)?"done":""} ${phase===p.id?"current":""}`}><span>{statusFor(p.id)&&p.id!=="failure"?<Check size={10}/>:i+1}</span><label>{p.label}</label>{i<phases.length-1&&<i/>}</div>)}</div></div>
   <div className="footer"><span>VIBELOOP • AUTONOMOUS VERIFICATION LOOP</span><span><CircleDot size={10}/> DEMO TELEMETRY IS SIMULATED WHERE MARKED</span></div>
 </div>
}

function Overview({phase,activeIndex,start,running,stop,setView,selectedNode,setSelectedNode}:{phase:Phase,activeIndex:number,start:()=>void,running:boolean,stop:()=>void,setView:(x:string)=>void,selectedNode:string,setSelectedNode:(x:string)=>void}){
 return <div className="page overview">
  <div className="heroCopy"><div className="eyebrow"><span/> AUTONOMOUS SOFTWARE ENGINEERING</div><h1>Don’t just generate code.<br/><strong>Build. Test. Fix. Ship.</strong></h1><p>VIBELOOP turns natural-language ideas into software that is continuously built, tested, diagnosed, repaired and verified.</p><div className="heroActions"><button className="primary" onClick={()=>setView("new")}><Sparkles size={16}/> Start Building</button><button className="secondary" onClick={start}><Play size={15}/> Watch the Loop</button></div></div>
  <div className="engineStage">
    <div className="stageGrid"/>
    <div className="orbit orbit1"/><div className="orbit orbit2"/><div className={`engineCore ${running?"processing":""} ${phase==="failure"?"error":""} ${phase==="verified"||phase==="ship"?"verified":""}`}><div className="coreRing"/><div className="coreGlyph"><Cpu size={28}/></div><span>AI ENGINE</span><small>{phase==="idle"?"STANDBY":phase.toUpperCase()}</small></div>
    {phases.slice(0,8).map((p,i)=>{const a=(i/8)*Math.PI*2-Math.PI/2;const x=50+41*Math.cos(a),y=50+42*Math.sin(a);return <button key={p.id} onClick={()=>setSelectedNode(p.label)} className={`node ${activeIndex>=i?"lit":""} ${phase===p.id?"nodeCurrent":""}`} style={{left:`${x}%`,top:`${y}%`}}><span>{i<3?<Sparkles size={12}/>:i<5?<TestTube2 size={12}/>:i<7?<Search size={12}/>:<Rocket size={12}/>}</span>{p.label}</button>})}
    <svg className="links" viewBox="0 0 100 100"><defs><linearGradient id="g"><stop/><stop offset="1" stopOpacity="0"/></linearGradient></defs>{phases.slice(0,8).map((_,i)=>{const a=(i/8)*Math.PI*2-Math.PI/2;const x=50+41*Math.cos(a),y=50+42*Math.sin(a);return <line key={i} x1="50" y1="50" x2={x} y2={y} className={activeIndex>=i?"lineActive":""}/>})}</svg>
    <div className="stageInfo"><span>SELECTED NODE</span><strong>{selectedNode}</strong><small>STATUS • {phase==="failure"&&selectedNode==="API"?"DEGRADED":"HEALTHY"} · DEMO TELEMETRY</small></div>
  </div>
  <div className="metrics"><Metric label="LOOP STATUS" value={phase==="verified"||phase==="ship"?"VERIFIED":phase==="idle"?"READY":"IN PROGRESS"} icon={Activity}/><Metric label="TESTS" value={phase==="verified"||phase==="ship"?"8 / 8":"—"} icon={TestTube2}/><Metric label="FIXES" value={phase==="verified"||phase==="ship"?"1":"—"} icon={Zap}/><Metric label="SHIP" value={phase==="ship"?"READY":"GATED"} icon={Rocket}/></div>
  <div className="sectionGrid"><div className="panel loopPanel"><div className="panelTitle"><span><GitBranch size={16}/> THE DIFFERENCE</span><small>PROMPT → VERIFIED SOFTWARE</small></div><div className="flowLine">{["PROMPT","UNDERSTAND","BUILD","TEST","DETECT","DIAGNOSE","FIX","RETEST","VERIFY","SHIP"].map((x,i)=><div className={activeIndex>=i-1?"flowActive":""} key={x}><span>{i+1}</span><b>{x}</b>{i<9&&<ArrowRight size={12}/>}</div>)}</div></div><div className="panel selectedPanel"><div className="panelTitle"><span><Database size={16}/> ARCHITECTURE</span><button onClick={()=>setView("build")}>Inspect <ChevronRight size={13}/></button></div><ArchDiagram selected={selectedNode} onSelect={setSelectedNode}/></div></div>
  <div className="demoBanner"><div><strong>2–3 MIN JUDGES DEMO</strong><span>Watch a controlled failure travel through the loop, get diagnosed, patched, retested and verified.</span></div><button className="primary" onClick={running?stop:start}>{running?<><X size={15}/> Stop Demo</>:<><Play size={15}/> Start Judges Demo</>}</button></div>
 </div>
}
function Metric({label,value,icon:Icon}:{label:string,value:string,icon:any}){return <div className="metric"><Icon size={16}/><small>{label}</small><strong>{value}</strong></div>}
function ArchDiagram({selected,onSelect}:{selected:string,onSelect:(x:string)=>void}){return <div className="arch"><div className="archNode" onClick={()=>onSelect("USER")}><span>USER</span><b><Layers3 size={15}/></b></div><ArrowRight/><div className={`archNode ${selected==="FRONTEND"?"sel":""}`} onClick={()=>onSelect("FRONTEND")}><span>FRONTEND</span><b><Code2 size={15}/></b></div><ArrowRight/><div className={`archNode ${selected==="API"?"sel":""}`} onClick={()=>onSelect("API")}><span>API</span><b><Zap size={15}/></b></div><ArrowRight/><div className={`archNode ${selected==="DATABASE"?"sel":""}`} onClick={()=>onSelect("DATABASE")}><span>DATABASE</span><b><Database size={15}/></b></div></div>}

function NewProject({idea,setIdea,start,running}:{idea:string,setIdea:(x:string)=>void,start:()=>void,running:boolean}){return <div className="page"><div className="pageHead"><div><div className="eyebrow"><span/> NEW PROJECT</div><h2>What do you want to build?</h2><p>Describe the outcome. VIBELOOP will turn it into a plan before it writes code.</p></div></div><div className="projectComposer"><textarea value={idea} onChange={e=>setIdea(e.target.value)} placeholder="Describe your application in plain English… e.g. Build a college hackathon management platform where students can discover hackathons, register for events, create teams and track submissions."/><div className="composerTools"><button>＋ Upload sketch</button><button>＋ Specification</button><select defaultValue="React + TypeScript"><option>React + TypeScript</option><option>Next.js</option><option>Vanilla HTML/CSS/JS</option></select><select defaultValue="Demo Sandbox"><option>Demo Sandbox</option><option>Supabase</option><option>PostgreSQL</option></select></div><div className="planPreview"><div><span>PLANNING PIPELINE</span><strong>UNDERSTAND → ARCHITECT → BUILD → VERIFY</strong></div><button className="primary" onClick={start} disabled={running}><Sparkles size={15}/>{running?"BUILDING…":"Start Vibe Build"}</button></div></div><div className="infoGrid">{["PROJECT UNDERSTANDING","FEATURES","DATA MODEL","TEST PLAN"].map((x,i)=><div key={x}><small>0{i+1}</small><strong>{x}</strong><span>{i===0?"AI extracts intent before implementation.":i===1?"Requirements become buildable units.":i===2?"Entities and relationships are mapped.":"Verification starts before deployment."}</span></div>)}</div></div>}

function Projects({projects,setView}:{projects:any[],setView:(x:string)=>void}){return <div className="page"><div className="pageHead"><div><div className="eyebrow"><span/> PROJECT MEMORY</div><h2>Projects</h2><p>Local project state persists in this browser for the hackathon demo.</p></div><button className="primary" onClick={()=>setView("new")}><Sparkles size={15}/> New Project</button></div>{projects.length===0?<Empty text="No projects yet. Run the Judges Demo or start a new build."/>:<div className="projectList">{projects.map(p=><div className="projectRow" key={p.id}><div className="projectIcon"><Code2 size={18}/></div><div className="grow"><strong>{p.name}</strong><span>{p.description}</span></div><div><small>BUILD</small><b>✓</b></div><div><small>TEST</small><b>✓ {p.tests}</b></div><div><small>FIXES</small><b>{p.fixes}</b></div><div><small>DEPLOY</small><b>{p.deploy}</b></div></div>)}</div>}</div>}
function Empty({text}:{text:string}){return <div className="empty"><Layers3 size={25}/><strong>{text}</strong></div>}

function BuildConsole({events,phase,activeIndex}:{events:string[],phase:Phase,activeIndex:number}){return <div className="page"><div className="pageHead"><div><div className="eyebrow"><span/> BUILD ENGINE</div><h2>Constructing the application</h2><p>Each stage advances the same persistent workflow state.</p></div><div className="pill"><i className="online"/> {phase==="idle"?"READY":phase.toUpperCase()}</div></div><div className="buildGrid"><div className="buildStages">{phases.slice(0,5).map((p,i)=><div className={`buildStage ${activeIndex>=i?"done":""}`} key={p.id}><div className="stageIcon">{activeIndex>i?<Check size={16}/>:<span>0{i+1}</span>}</div><div><strong>{p.label}</strong><span>{p.short}</span></div><div className="bar"><i style={{width:activeIndex>=i?"100%":"12%"}}/></div></div>)}</div><div className="terminal"><div className="termHead"><span><Terminal size={14}/> LIVE BUILD STREAM</span><small>DEMO RUNTIME</small></div>{events.map((e,i)=><div className={e.includes("failed")?"termFail":e.includes("passed")?"termPass":""} key={i}><span>{e.slice(0,8)}</span>{e.slice(10)}</div>)}</div></div><div className="previewPanel"><div className="previewHead"><span><Layers3 size={15}/> LIVE APPLICATION PREVIEW</span><div><button>CODE</button><button className="active">PREVIEW</button><button>TERMINAL</button></div></div><div className="fakeApp"><div className="fakeNav"><strong>HACKATHON<span>HUB</span></strong><span>Discover</span><span>My Teams</span><span>Submissions</span><button>Join Event</button></div><div className="fakeHero"><small>STUDENT BUILDER NETWORK</small><h3>Find your next challenge.</h3><p>Discover hackathons, build teams and ship ideas.</p><div><button>Explore Hackathons</button><button>View Dashboard</button></div></div><div className="fakeCards">{["AI Builders Sprint","Campus Innovation Day","Open Source Weekend"].map((x,i)=><div key={x}><small>ACTIVE • {i+2} DAYS</small><strong>{x}</strong><span>Teams · Projects · Prizes</span></div>)}</div></div></div></div>}

function Tests({tests,phase,run}:{tests:any[],phase:Phase,run:()=>void}){return <div className="page"><div className="pageHead"><div><div className="eyebrow"><span/> AI TEST ENGINE</div><h2>Full verification</h2><p>Checks are represented as real workflow state; production adapters can connect Playwright, API runners, Lighthouse and security scanners.</p></div><button className="primary" onClick={run}><Play size={15}/> Run Full Verification</button></div><div className="testSummary"><strong>{tests.filter(x=>x.status==="pass").length}</strong><span>passed</span><i/><strong>{tests.filter(x=>x.status==="fail").length}</strong><span>failed</span><i/><strong>{tests.filter(x=>x.status==="idle").length}</strong><span>pending</span></div><div className="testGrid">{tests.map((t:any,i:number)=><div className={`testRow ${t.status}`} key={t.name}><div className="testIcon">{t.status==="pass"?<Check/>:t.status==="fail"?<X/>:t.status==="fixing"?<Zap/>:<CircleDot/>}</div><div className="grow"><strong>{t.name}</strong><span>{t.cat}</span></div><b>{t.status==="pass"?"PASSED":t.status==="fail"?"FAILED":t.status==="fixing"?"FIXING":t.status==="running"?"RUNNING":"PENDING"}</b></div>)}</div>{phase==="failure"&&<div className="issueCallout"><AlertTriangle size={18}/><div><strong>Registration API failed</strong><span>Root cause: demo sandbox route contract is unavailable. Affected component: /api/register.</span></div><button onClick={run}>Fix Automatically</button></div>}{phase==="verified"||phase==="ship"?<div className="verifiedBox"><ShieldCheck size={24}/><div><strong>SYSTEM VERIFIED</strong><span>Critical verification suite passed after repair and regression testing.</span></div></div>:null}</div>}

function Issues({phase,setView}:{phase:Phase,setView:(x:string)=>void}){return <div className="page"><div className="pageHead"><div><div className="eyebrow"><span/> DIAGNOSTICS</div><h2>Issues & root cause</h2><p>Engineering diagnostics are concise and inspectable — never hidden chain-of-thought.</p></div></div>{phase==="failure"||phase==="diagnose"||phase==="fix"?<div className="diagnostic"><div className="trace"><div>USER ACTION</div><ArrowRight/><div>UI</div><ArrowRight/><div className="bad">API <X size={12}/></div><ArrowRight/><div>BACKEND</div></div><div className="diagGrid"><div><small>ERROR</small><strong>Registration request failed</strong></div><div><small>ROOT CAUSE</small><strong>Unavailable /api/register route contract</strong></div><div><small>AFFECTED FILE</small><strong>server/routes/register.ts</strong></div><div><small>SEVERITY</small><strong>HIGH · BLOCKING</strong></div></div><div className="patch"><div className="patchHead"><span>AI PATCH</span><b>{phase==="fix"?"APPLIED":"READY"}</b></div><pre>{`- router.post("/register", legacyHandler)
+ router.post("/register", validateRegistration)
+ return createSession(user)`}</pre><div><button className="secondary">Open Code</button><button className="primary" onClick={()=>setView("tests")}><Zap size={14}/> Fix Automatically</button></div></div></div>:<Empty text="No active failures. Run the Judges Demo to see the diagnostic loop."/>}</div>}

function Deploy({phase}:{phase:Phase}){const ready=phase==="verified"||phase==="ship";return <div className="page"><div className="pageHead"><div><div className="eyebrow"><span/> RELEASE CONTROL</div><h2>Deploy</h2><p>Deployment adapters are separated from the demo runtime. No credentials are stored in the browser.</p></div></div><div className="deployPipeline">{["LOCAL","BUILD","VERIFY","CONTAINER","DEPLOY","LIVE"].map((x,i)=><div className={ready||phase==="ship"&&i<6?"deployStep active":""} key={x}><div><span>{i+1}</span></div><strong>{x}</strong>{i<5&&<ArrowRight/>}</div>)}</div><div className="deployCards">{["BUILD STATUS","TEST STATUS","SECURITY STATUS","DEPLOYMENT STATUS"].map((x,i)=><div key={x}><small>{x}</small><strong>{ready?"READY":"GATED"}</strong><span>{i===3?(ready?"Demo release package ready":"Requires verified tests"):"Demo telemetry · adapter ready"}</span></div>)}</div><div className="adapters"><span>DEPLOYMENT ADAPTERS</span>{["Vercel","Netlify","Render"].map(x=><button key={x}>{x}<small>adapter</small></button>)}</div></div>}
function SettingsView(){return <div className="page"><div className="pageHead"><div><div className="eyebrow"><span/> SETTINGS</div><h2>Runtime configuration</h2><p>Provider and infrastructure interfaces are prepared for server-side integration.</p></div></div><div className="settingsGrid">{[["AI_PROVIDER","adapter://llm"],["SANDBOX","demo://isolated"],["DATABASE","localStorage"],["DEPLOYMENT","adapter://release"]].map(([a,b])=><div key={a}><small>{a}</small><strong>{b}</strong><span>Configuration interface only · no secret exposed in client code.</span></div>)}</div></div>}

export default App;
