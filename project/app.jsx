/* app.jsx — shell, tab navigation, state */
function TabBar({ tab, setTab, onRecord }) {
  const items = [
    { key:'home',    label:'홈',   Icon: window.IcHome },
    { key:'todo',    label:'할 일', Icon: window.IcCheck },
    { key:'__fab',   label:'',     Icon: null },
    { key:'monthly', label:'회고', Icon: window.IcCal },
    { key:'diary',   label:'일기', Icon: window.IcBook },
  ];
  return (
    <div style={{ position:'absolute', left:0, right:0, bottom:0, zIndex:40, paddingBottom:14, paddingInline:14,
      pointerEvents:'none' }}>
      <div style={{ position:'relative', pointerEvents:'auto', display:'flex', alignItems:'center',
        background:'rgba(251,247,239,0.86)', backdropFilter:'blur(18px) saturate(160%)', WebkitBackdropFilter:'blur(18px) saturate(160%)',
        borderRadius:30, boxShadow:'0 6px 24px rgba(51,48,43,0.14), 0 0 0 1px rgba(51,48,43,0.04)', padding:'9px 8px 8px' }}>
        {items.map(it => {
          if (it.key==='__fab') return <div key="fab" style={{ width:70 }} />;
          const on = tab===it.key;
          return (
            <button key={it.key} className="tap" onClick={()=>setTab(it.key)} style={{ flex:1, border:'none', background:'none',
              display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer', padding:'4px 0',
              color: on?'var(--terra)':'var(--ink-3)' }}>
              <it.Icon size={23} sw={on?2.1:1.8} />
              <span style={{ fontSize:10.5, fontWeight: on?700:600 }}>{it.label}</span>
            </button>
          );
        })}
        {/* center FAB */}
        <button className="tap" onClick={onRecord} style={{ position:'absolute', left:'50%', top:-20, transform:'translateX(-50%)',
          width:62, height:62, borderRadius:'50%', border:'4px solid var(--bg)', cursor:'pointer',
          background:'linear-gradient(135deg,#C5613A,#A84E2C)', color:'#fff', display:'grid', placeItems:'center',
          boxShadow:'0 8px 20px rgba(168,78,44,0.42)' }}>
          <window.IcMic size={26}/>
        </button>
      </div>
    </div>
  );
}

function DiaryEmpty({ onRecord }) {
  return (
    <div className="screen" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 40px 80px' }}>
      <div style={{ width:74, height:74, borderRadius:24, display:'grid', placeItems:'center', background:'var(--paper)', boxShadow:'var(--shadow-card)', color:'var(--terra)', marginBottom:20 }}>
        <window.IcBook size={36}/>
      </div>
      <div className="serif" style={{ fontSize:20, fontWeight:600 }}>아직 오늘 일기가 없어요</div>
      <div className="muted" style={{ fontSize:14, lineHeight:1.6, marginTop:8 }}>코치와 잠깐 이야기하면<br/>일기와 인사이트로 정리해드려요.</div>
      <button className="btn btn-primary" onClick={onRecord} style={{ marginTop:22 }}>
        <window.IcMic size={18}/> 오늘 기록 시작하기
      </button>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState('home');
  const [overlay, setOverlay] = useState(null);   // 'convo' | 'diary' | null
  const [todayDone, setTodayDone] = useState(false);
  const [todos, setTodos] = useState(window.TODOS_TODAY);
  const [addedTodos, setAddedTodos] = useState([]);

  const record = () => setOverlay('convo');
  const finishConvo = () => {
    setTodayDone(true);
    setOverlay('diary');
  };
  const addTodoFromDiary = (text) => {
    setAddedTodos(a => [...a, text]);
    setTodos(ts => [...ts, { id:'d'+Date.now(), text, done:false, cat: text.includes('걷')||text.includes('운동')?'건강':'업무', from:'대화' }]);
  };

  let screen;
  if (tab==='home') screen = <window.HomeScreen todayDone={todayDone} todos={todos}
    onRecord={record} onOpenDiary={()=>setOverlay('diary')} onGoTodo={()=>setTab('todo')} onGoMonthly={()=>setTab('monthly')} />;
  else if (tab==='todo') screen = <window.TodoScreen todos={todos} setTodos={setTodos} />;
  else if (tab==='monthly') screen = <window.MonthlyScreen />;
  else if (tab==='diary') screen = todayDone
    ? <window.DiaryScreen onBack={()=>setTab('home')} onAddTodos={addTodoFromDiary} addedTodos={addedTodos} />
    : <DiaryEmpty onRecord={record} />;

  return (
    <div className="app-root" style={{ position:'relative', height:'100%' }}>
      {screen}
      <TabBar tab={tab} setTab={setTab} onRecord={record} />

      {overlay==='convo' && <window.ConvoScreen onClose={()=>setOverlay(null)} onFinish={finishConvo} />}
      {overlay==='diary' && (
        <Sheet z={70}>
          <window.DiaryScreen onBack={()=>{ setOverlay(null); setTab('home'); }} onAddTodos={addTodoFromDiary} addedTodos={addedTodos} />
        </Sheet>
      )}
    </div>
  );
}

function Sheet({ z = 70, children }) {
  return (
    <div style={{ position:'absolute', inset:0, zIndex:z, background:'var(--bg)' }}>
      {children}
    </div>
  );
}

Object.assign(window, { App, TabBar });
