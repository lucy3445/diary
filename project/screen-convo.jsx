/* screen-convo.jsx — voice coaching conversation (core) */
const { useState, useRef, useEffect, useCallback } = React;

// breathing coach orb
function CoachOrb({ size = 30, active }) {
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', flexShrink:0, position:'relative',
      background:'radial-gradient(circle at 32% 30%, #E89A6B 0%, #C5613A 55%, #A84E2C 100%)',
      boxShadow:'0 3px 8px rgba(168,78,44,0.34), inset 0 1px 2px rgba(255,255,255,0.4)',
      animation: active ? 'breathe 2.6s ease-in-out infinite' : 'none' }}>
      <div style={{ position:'absolute', top:'24%', left:'26%', width:'22%', height:'22%',
        borderRadius:'50%', background:'rgba(255,255,255,0.55)' }} />
    </div>
  );
}

function LiveWave({ color = '#fff' }) {
  const bars = [0.4,0.7,1,0.55,0.85,0.45,0.95,0.6,0.75,0.4,0.9,0.5,0.8];
  return (
    <span className="wf" style={{ color, height:22 }}>
      {bars.map((v,i)=>(
        <i key={i} style={{ height:22*v, animation:`liveBar 0.7s ease-in-out ${i*0.06}s infinite alternate` }} />
      ))}
    </span>
  );
}

function ConvoScreen({ onClose, onFinish }) {
  const C = window.CONVO;
  const [msgs, setMsgs] = useState([{ ...C[0], id:0 }]);
  const [nextIdx, setNextIdx] = useState(1);
  const [mode, setMode] = useState('idle');       // idle | listening | thinking
  const [partial, setPartial] = useState('');
  const [kb, setKb] = useState(false);
  const [draft, setDraft] = useState('');
  const [done, setDone] = useState(false);
  const scrollRef = useRef(null);
  const timers = useRef([]);

  const scrollDown = useCallback(() => {
    const el = scrollRef.current;
    if (el) requestAnimationFrame(() => { el.scrollTop = el.scrollHeight + 400; });
  }, []);
  useEffect(scrollDown, [msgs, partial, mode, done]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const T = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); return id; };

  // reveal coach reply after a user turn
  const coachReply = useCallback((idx, userText, viaAI) => {
    setMode('thinking');
    const scripted = C[idx] && C[idx].role === 'coach' ? C[idx] : null;
    const commit = (text, tag) => {
      setMsgs(m => [...m, { role:'coach', text, tag: tag, id: Date.now()+Math.random() }]);
      setMode('idle');
      if (scripted && scripted.last) setDone(true);
      setNextIdx(idx + 1);
    };
    if (viaAI && window.claude && window.claude.complete) {
      const ctx = C.slice(0, idx).concat([{role:'user',text:userText}])
        .map(m => `${m.role==='coach'?'코치':'나'}: ${m.text}`).join('\n');
      window.claude.complete({ messages:[{ role:'user', content:
`너는 따뜻하고 통찰력 있는 일기 코치야. 사용자가 하루를 이야기하면, 감정을 돌보고 인사이트를 끌어내는 "질문 하나"만 짧게(2문장 이내) 한국어 반말 존댓말 섞지 말고 부드러운 존댓말로 해. 설명·요약 금지, 오직 질문.\n\n[대화]\n${ctx}\n\n코치의 다음 질문:` }] })
        .then(r => commit((r||'').trim() || (scripted?scripted.text:'그 마음을 조금 더 들려주실 수 있어요?'), '감정 돌보기'))
        .catch(() => commit(scripted?scripted.text:'그 마음을 조금 더 들려주실 수 있어요?', scripted?scripted.tag:null));
    } else {
      T(() => commit(scripted?scripted.text:'그 마음을 조금 더 들려주실 수 있어요?', scripted?scripted.tag:null), 1100);
    }
  }, []);

  // user speaks (mic): animate partial transcript of the scripted line, then commit
  const startListen = () => {
    if (mode !== 'idle' || done) return;
    const line = (C[nextIdx] && C[nextIdx].role==='user') ? C[nextIdx].text : '오늘 있었던 일을 떠올려보고 있어요...';
    const words = line.split(' ');
    setMode('listening'); setPartial('');
    let i = 0;
    const step = () => {
      i++;
      setPartial(words.slice(0,i).join(' '));
      if (i < words.length) T(step, 70 + Math.random()*70);
      else T(() => commitSpeech(line), 500);
    };
    T(step, 350);
  };
  const stopListen = () => { // tap again to finish immediately
    if (mode !== 'listening') return;
    const line = (C[nextIdx] && C[nextIdx].role==='user') ? C[nextIdx].text : partial || '...';
    commitSpeech(line);
  };
  const commitSpeech = (line) => {
    timers.current.forEach(clearTimeout); timers.current = [];
    setPartial('');
    setMsgs(m => [...m, { role:'user', voice:true, text:line, id:Date.now() }]);
    const ci = nextIdx + 1;            // coach turn after this user turn
    setNextIdx(ci);
    T(() => coachReply(ci, line, false), 450);
  };

  // user types
  const sendDraft = () => {
    const text = draft.trim();
    if (!text || mode==='thinking') return;
    setDraft('');
    const scriptedUserHere = (C[nextIdx] && C[nextIdx].role==='user');
    setMsgs(m => [...m, { role:'user', voice:false, text, id:Date.now() }]);
    const ci = scriptedUserHere ? nextIdx+1 : nextIdx;
    setNextIdx(ci);
    T(() => coachReply(ci, text, true), 300);
  };

  const quick = window.QUICK[nextIdx];

  return (
    <div style={{ position:'absolute', inset:0, zIndex:80, background:'var(--bg)',
      display:'flex', flexDirection:'column' }}>
      {/* header */}
      <div style={{ paddingTop:58, paddingBottom:12, paddingInline:18, display:'flex', alignItems:'center',
        justifyContent:'space-between', borderBottom:'1px solid var(--line-2)', background:'var(--bg)' }}>
        <button className="tap" onClick={onClose} style={{ border:'none', background:'var(--paper)', width:38, height:38,
          borderRadius:'50%', display:'grid', placeItems:'center', boxShadow:'var(--shadow-card)', color:'var(--ink-2)', cursor:'pointer' }}>
          <window.IcClose size={18}/>
        </button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:14.5, fontWeight:700 }}>코치와 대화</div>
          <div className="faint" style={{ fontSize:11.5, display:'flex', alignItems:'center', gap:5, justifyContent:'center', marginTop:1 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--terra)', animation:'blink 1.6s infinite' }} />
            6월 14일 · 기록 중
          </div>
        </div>
        <div style={{ width:38 }} />
      </div>

      {/* chat */}
      <div ref={scrollRef} className="screen" style={{ flex:1, padding:'20px 18px 8px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {msgs.map(m => <Bubble key={m.id} m={m} />)}
          {mode==='thinking' && (
            <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
              <CoachOrb size={28} active />
              <div className="card" style={{ padding:'13px 16px', display:'flex', gap:5, borderTopLeftRadius:6 }}>
                {[0,1,2].map(i=><span key={i} style={{ width:7, height:7, borderRadius:'50%', background:'var(--ink-3)', animation:`blink 1.1s ${i*0.18}s infinite` }} />)}
              </div>
            </div>
          )}
          {mode==='listening' && (
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <div style={{ maxWidth:'82%', background:'var(--terra)', color:'#fff', padding:'14px 16px',
                borderRadius:'20px 20px 6px 20px', boxShadow:'0 6px 16px rgba(197,97,58,0.3)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom: partial?9:0 }}>
                  <LiveWave /><span style={{ fontSize:11.5, fontWeight:700, opacity:.85, marginLeft:'auto' }}>듣는 중…</span>
                </div>
                {partial && <div style={{ fontSize:15, lineHeight:1.55 }}>{partial}<span style={{ opacity:.6 }}>｜</span></div>}
              </div>
            </div>
          )}
        </div>
        {done && <FinishCard onFinish={onFinish} />}
        <div style={{ height:12 }} />
      </div>

      {/* dock */}
      {!done && <Dock {...{ mode, kb, setKb, draft, setDraft, sendDraft, startListen, stopListen, quick, setDraftPick:(t)=>{ setDraft(''); /* send as voice-ish */ } }} onQuick={(t)=>{ setMsgs(m=>[...m,{role:'user',voice:false,text:t,id:Date.now()}]); const sc=(C[nextIdx]&&C[nextIdx].role==='user'); const ci=sc?nextIdx+1:nextIdx; setNextIdx(ci); setTimeout(()=>coachReply(ci,t,false),350); }} />}
    </div>
  );
}

function Bubble({ m }) {
  if (m.role === 'coach') {
    return (
      <div className="rise" style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
        <CoachOrb size={28} />
        <div style={{ maxWidth:'82%' }}>
          {m.tag && <div style={{ display:'inline-flex', alignItems:'center', gap:5, marginBottom:6, marginLeft:2,
            fontSize:11, fontWeight:700, color:'var(--terra)' }}><window.IcSpark size={12}/>{m.tag}</div>}
          <div className="card" style={{ padding:'14px 16px', borderTopLeftRadius:6, fontSize:15, lineHeight:1.62, whiteSpace:'pre-line' }}>{m.text}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="rise" style={{ display:'flex', justifyContent:'flex-end' }}>
      <div style={{ maxWidth:'82%', background:'var(--terra)', color:'#fff', padding:'13px 16px',
        borderRadius:'20px 20px 6px 20px', boxShadow:'0 5px 14px rgba(197,97,58,0.26)' }}>
        {m.voice && (
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:9, opacity:.92 }}>
            <window.IcMic size={14}/><window.WaveBars n={20} h={16} color="rgba(255,255,255,0.85)" seed={String(m.text).length}/>
          </div>
        )}
        <div style={{ fontSize:15, lineHeight:1.6 }}>{m.text}</div>
      </div>
    </div>
  );
}

function Dock({ mode, kb, setKb, draft, setDraft, sendDraft, startListen, stopListen, quick, onQuick }) {
  return (
    <div style={{ background:'var(--bg)', borderTop:'1px solid var(--line-2)', padding:'12px 18px 30px' }}>
      {quick && mode==='idle' && !kb && (
        <div style={{ display:'flex', gap:8, marginBottom:13, flexWrap:'wrap', justifyContent:'center' }}>
          {quick.map(q=>(
            <button key={q} className="tap" onClick={()=>onQuick(q)} style={{ border:'1px solid var(--line)', background:'var(--paper)',
              color:'var(--ink-2)', borderRadius:999, padding:'9px 15px', fontSize:13.5, fontWeight:600, cursor:'pointer', fontFamily:'var(--sans)' }}>{q}</button>
          ))}
        </div>
      )}

      {kb ? (
        <div style={{ display:'flex', alignItems:'flex-end', gap:9 }}>
          <button className="tap" onClick={()=>setKb(false)} style={{ border:'none', background:'var(--paper)', width:46, height:46, borderRadius:'50%',
            display:'grid', placeItems:'center', boxShadow:'var(--shadow-card)', color:'var(--terra)', cursor:'pointer', flexShrink:0 }}>
            <window.IcMic size={20}/>
          </button>
          <div style={{ flex:1, display:'flex', alignItems:'flex-end', background:'var(--paper)', borderRadius:24, boxShadow:'var(--shadow-card)', padding:'4px 4px 4px 16px' }}>
            <textarea value={draft} onChange={e=>setDraft(e.target.value)} rows={1} placeholder="직접 입력해 보세요…"
              onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendDraft(); } }}
              style={{ flex:1, border:'none', outline:'none', resize:'none', background:'none', fontFamily:'var(--sans)',
                fontSize:15, lineHeight:1.5, padding:'9px 0', maxHeight:90, color:'var(--ink)' }} />
            <button className="tap" onClick={sendDraft} disabled={!draft.trim()} style={{ border:'none', width:38, height:38, borderRadius:'50%', flexShrink:0,
              background: draft.trim()?'var(--terra)':'var(--line)', color:'#fff', display:'grid', placeItems:'center', cursor:'pointer', marginBottom:1 }}>
              <window.IcArrowU size={19}/>
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, position:'relative' }}>
          <button className="tap" onClick={()=>setKb(true)} style={{ position:'absolute', left:0, border:'none', background:'var(--paper)', width:46, height:46, borderRadius:'50%',
            display:'grid', placeItems:'center', boxShadow:'var(--shadow-card)', color:'var(--ink-2)', cursor:'pointer' }}>
            <window.IcKeyb size={20}/>
          </button>
          <MicButton mode={mode} onStart={startListen} onStop={stopListen} />
          <div style={{ position:'absolute', right:0, textAlign:'center', width:46 }}>
            <div className="faint" style={{ fontSize:10.5, fontWeight:600, lineHeight:1.35 }}>
              <div>탭하여</div><div>{mode==='listening' ? '완료' : '말하기'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MicButton({ mode, onStart, onStop }) {
  const listening = mode==='listening';
  const busy = mode==='thinking';
  return (
    <button className="tap" disabled={busy} onClick={listening?onStop:onStart} style={{
      position:'relative', width:74, height:74, borderRadius:'50%', border:'none', cursor: busy?'default':'pointer',
      background: listening ? 'linear-gradient(135deg,#A84E2C,#8f3f22)' : 'linear-gradient(135deg,#C5613A,#A84E2C)',
      boxShadow:'0 10px 24px rgba(168,78,44,0.4)', display:'grid', placeItems:'center', color:'#fff', opacity: busy?.5:1 }}>
      {listening && [0,1].map(i=>(
        <span key={i} style={{ position:'absolute', inset:0, borderRadius:'50%', border:'2px solid var(--terra)',
          animation:`ring 1.8s ${i*0.9}s ease-out infinite` }} />
      ))}
      {listening
        ? <span style={{ width:22, height:22, borderRadius:6, background:'#fff' }} />
        : <window.IcMic size={30}/>}
    </button>
  );
}

function FinishCard({ onFinish }) {
  return (
    <div className="rise card" style={{ marginTop:22, padding:'22px 20px', textAlign:'center',
      background:'linear-gradient(160deg, #FBF7EF, #F4E7D8)' }}>
      <div style={{ width:46, height:46, borderRadius:15, margin:'0 auto 12px', display:'grid', placeItems:'center',
        background:'var(--terra-soft)', color:'var(--terra-d)' }}><window.IcBook size={24}/></div>
      <div className="serif" style={{ fontSize:18, fontWeight:600 }}>오늘 이야기, 잘 들었어요</div>
      <div className="muted" style={{ fontSize:13.5, lineHeight:1.6, marginTop:7, maxWidth:250, marginInline:'auto' }}>
        나눈 이야기를 일기로 정리하고, 인사이트와 감정, 내일 이어갈 일들을 뽑아둘게요.
      </div>
      <button className="btn btn-primary" onClick={onFinish} style={{ marginTop:18, width:'100%' }}>
        <window.IcSpark size={18}/> 오늘의 일기 정리하기
      </button>
    </div>
  );
}

Object.assign(window, { ConvoScreen });
