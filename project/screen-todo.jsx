/* screen-todo.jsx — todo list (conversation-linked) */
function TodoScreen({ todos, setTodos }) {
  const [carry, setCarry] = useState(window.TODOS_CARRY);
  const [adding, setAdding] = useState('');

  const toggle = (id) => setTodos(ts => ts.map(t => t.id===id ? {...t, done:!t.done} : t));
  const toggleCarry = (id) => setCarry(cs => cs.map(t => t.id===id ? {...t, done:!t.done} : t));
  const add = () => {
    const text = adding.trim(); if (!text) return;
    setTodos(ts => [...ts, { id:'n'+Date.now(), text, done:false, cat:'기타' }]);
    setAdding('');
  };
  const pullCarry = (id) => {
    const item = carry.find(c=>c.id===id); if(!item) return;
    setCarry(cs => cs.filter(c=>c.id!==id));
    setTodos(ts => [...ts, { ...item, id:'p'+Date.now() }]);
  };

  const done = todos.filter(t=>t.done).length;
  const tot = todos.length;
  const pct = tot ? Math.round(done/tot*100) : 0;

  return (
    <div className="screen" style={{ paddingBottom:118 }}>
      <div style={{ padding:'70px 22px 6px' }}>
        <div className="sec-label">오늘의 할 일</div>
        <h1 className="serif" style={{ margin:'8px 0 0', fontSize:28, fontWeight:600 }}>6월 14일</h1>
      </div>

      {/* progress */}
      <div style={{ padding:'16px 18px 0' }}>
        <div className="card" style={{ padding:'18px 20px', display:'flex', alignItems:'center', gap:18 }}>
          <ProgressRing pct={pct} />
          <div style={{ flex:1 }}>
            <div style={{ fontSize:16, fontWeight:700 }}>{done}개 완료 · {tot-done}개 남음</div>
            <div className="muted" style={{ fontSize:13.5, lineHeight:1.5, marginTop:4 }}>
              {pct===100 ? '오늘 할 일을 다 끝냈어요. 멋져요!' : '천천히 하나씩, 충분히 잘하고 있어요.'}
            </div>
          </div>
        </div>
      </div>

      {/* add */}
      <div style={{ padding:'16px 18px 0' }}>
        <div style={{ display:'flex', gap:9, alignItems:'center', background:'var(--paper)', borderRadius:18, boxShadow:'var(--shadow-card)', padding:'6px 6px 6px 16px' }}>
          <input value={adding} onChange={e=>setAdding(e.target.value)} placeholder="할 일 추가하기"
            onKeyDown={e=>{ if(e.key==='Enter') add(); }}
            style={{ flex:1, border:'none', outline:'none', background:'none', fontFamily:'var(--sans)', fontSize:15, padding:'10px 0', color:'var(--ink)' }} />
          <button className="tap" onClick={add} disabled={!adding.trim()} style={{ border:'none', width:40, height:40, borderRadius:'50%',
            background: adding.trim()?'var(--terra)':'var(--line)', color:'#fff', display:'grid', placeItems:'center', cursor:'pointer' }}>
            <window.IcPlus size={20}/>
          </button>
        </div>
      </div>

      {/* today list */}
      <div style={{ padding:'22px 18px 0' }}>
        <window.SectionHead label="할 일" />
        <div className="card" style={{ overflow:'hidden' }}>
          {todos.map((t,i)=>(
            <TodoRow key={t.id} t={t} last={i===todos.length-1} onToggle={()=>toggle(t.id)} />
          ))}
        </div>
      </div>

      {/* carried over */}
      {carry.length>0 && (
        <div style={{ padding:'22px 18px 0' }}>
          <window.SectionHead label="어제 못다 한 일" />
          <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
            {carry.map(t=>(
              <div key={t.id} className="card" style={{ padding:'13px 15px', display:'flex', alignItems:'center', gap:12 }}>
                <window.IcMoon size={17} style={{ color:'var(--emo-low)', flexShrink:0 }} />
                <span style={{ flex:1, fontSize:14.5 }}>{t.text}</span>
                <button className="tap" onClick={()=>pullCarry(t.id)} style={{ border:'none', cursor:'pointer',
                  background:'var(--paper-2)', color:'var(--terra)', borderRadius:999, padding:'7px 13px', fontSize:12.5, fontWeight:700,
                  display:'flex', alignItems:'center', gap:4 }}>
                  <window.IcArrowU size={14}/> 오늘로
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding:'22px 22px 0' }}>
        <div className="faint" style={{ fontSize:12.5, lineHeight:1.6, textAlign:'center' }}>
          <window.IcSpark size={13} style={{ verticalAlign:'-2px', marginRight:4 }} />
          할 일은 코치가 당신의 하루 맥락을 이해하는 데 쓰여요.
        </div>
      </div>
    </div>
  );
}

function TodoRow({ t, last, onToggle }) {
  return (
    <div className="tap" onClick={onToggle} style={{ display:'flex', alignItems:'center', gap:13, padding:'14px 16px',
      borderBottom: last?'none':'1px solid var(--line-2)', cursor:'pointer' }}>
      <span style={{ width:22, height:22, borderRadius:7, flexShrink:0, display:'grid', placeItems:'center',
        border: t.done?'none':'1.8px solid var(--line)', background: t.done?'var(--sage)':'transparent', transition:'all .15s' }}>
        {t.done && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5 9.5 18 20 6.5"/></svg>}
      </span>
      <span style={{ flex:1, fontSize:15, lineHeight:1.4, color: t.done?'var(--ink-3)':'var(--ink)',
        textDecoration: t.done?'line-through':'none', textDecorationColor:'var(--ink-3)' }}>{t.text}</span>
      {t.from==='대화' && <span className="pill" style={{ background:'var(--gold-soft)', color:'#9A7420', fontSize:10.5, padding:'3px 9px', gap:3 }}>
        <window.IcMic size={11}/> 대화</span>}
      <span className="faint" style={{ fontSize:11.5, fontWeight:600 }}>{t.cat}</span>
    </div>
  );
}

function ProgressRing({ pct }) {
  const r=26, c=2*Math.PI*r, off=c*(1-pct/100);
  return (
    <div style={{ position:'relative', width:64, height:64, flexShrink:0 }}>
      <svg width="64" height="64" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--paper-2)" strokeWidth="7" />
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--terra)" strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} style={{ transition:'stroke-dashoffset .5s ease' }} />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'grid', placeItems:'center', fontSize:15, fontWeight:700, color:'var(--terra)' }}>{pct}%</div>
    </div>
  );
}

Object.assign(window, { TodoScreen, ProgressRing });
