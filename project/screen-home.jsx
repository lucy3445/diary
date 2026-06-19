/* screen-home.jsx — dashboard */
function HomeScreen({ todayDone, onRecord, onOpenDiary, onGoTodo, onGoMonthly, todos }) {
  const D = window.DIARY;
  const openCount = todos.filter(t=>!t.done).length;
  const doneCount = todos.filter(t=>t.done).length;

  return (
    <div className="screen" style={{ paddingBottom:118 }}>
      {/* header */}
      <div style={{ padding:'70px 22px 8px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:7, color:'var(--ink-3)', fontSize:13.5, fontWeight:600 }}>
              <window.IcMoon size={15}/> 6월 14일 토요일 저녁
            </div>
            <h1 className="serif" style={{ margin:'10px 0 0', fontSize:27, fontWeight:600, lineHeight:1.3, letterSpacing:'-0.01em' }}>
              오늘 하루,<br/>같이 정리해볼까요?
            </h1>
          </div>
          <div className="pill tap" style={{ background:'var(--paper)', boxShadow:'var(--shadow-card)', color:'var(--terra)', padding:'8px 12px', fontWeight:700 }}>
            <window.IcFlame size={16}/> 12일
          </div>
        </div>
      </div>

      {/* record / today entry */}
      <div style={{ padding:'14px 18px 0' }}>
        {!todayDone ? (
          <button className="tap" onClick={onRecord} style={{
            width:'100%', border:'none', textAlign:'left', cursor:'pointer',
            background:'linear-gradient(135deg, #C5613A 0%, #B0512E 100%)',
            borderRadius:'var(--r-lg)', padding:'22px 22px 24px', color:'#fff',
            boxShadow:'0 10px 28px rgba(176,81,46,0.36)', position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', right:-26, top:-26, width:150, height:150, borderRadius:'50%',
              background:'rgba(255,255,255,0.10)' }} />
            <div style={{ position:'absolute', right:18, bottom:14, width:84, height:84, borderRadius:'50%',
              background:'rgba(255,255,255,0.08)' }} />
            <div style={{ display:'flex', alignItems:'center', gap:9, fontSize:13, fontWeight:700, opacity:.92 }}>
              <window.IcMic size={17}/> 음성으로 기록하기
            </div>
            <div className="serif" style={{ fontSize:21, fontWeight:600, marginTop:12, lineHeight:1.45, maxWidth:230 }}>
              말만 해주세요. 코치가<br/>질문하며 같이 정리해요.
            </div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginTop:18,
              background:'rgba(255,255,255,0.18)', borderRadius:999, padding:'10px 16px', fontSize:14.5, fontWeight:700 }}>
              대화 시작하기 <window.IcChevR size={15}/>
            </div>
          </button>
        ) : (
          <button className="tap card" onClick={onOpenDiary} style={{
            width:'100%', border:'none', textAlign:'left', cursor:'pointer',
            padding:'18px 19px 20px', display:'block',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:11 }}>
              <span className="pill" style={{ background:'var(--terra-soft)', color:'var(--terra-d)' }}>
                <window.IcBook size={13}/> 오늘의 일기
              </span>
              <window.MoodArc arc={D.moodArc} />
            </div>
            <div className="serif" style={{ fontSize:19, fontWeight:600, lineHeight:1.4 }}>{D.title}</div>
            <div className="muted" style={{ fontSize:13.5, lineHeight:1.6, marginTop:8,
              display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
              {D.body.split('\n')[0]}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:13, color:'var(--terra)', fontSize:13.5, fontWeight:700 }}>
              일기와 인사이트 보기 <window.IcChevR size={14}/>
            </div>
          </button>
        )}
      </div>

      {/* todo glance */}
      <div style={{ padding:'20px 18px 0' }}>
        <SectionHead label="오늘의 할 일" right={`${doneCount}/${doneCount+openCount}`} onRight={onGoTodo} />
        <button className="tap card" onClick={onGoTodo} style={{ width:'100%', border:'none', textAlign:'left', cursor:'pointer', padding:'15px 17px', display:'block' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
            {todos.slice(0,3).map(t=>(
              <div key={t.id} style={{ display:'flex', alignItems:'center', gap:11 }}>
                <span style={{ width:19, height:19, borderRadius:6, flexShrink:0, display:'grid', placeItems:'center',
                  border: t.done ? 'none' : '1.7px solid var(--line)',
                  background: t.done ? 'var(--sage)' : 'transparent', color:'#fff' }}>
                  {t.done && <window.IcClose style={{display:'none'}}/>}
                  {t.done && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5 9.5 18 20 6.5"/></svg>}
                </span>
                <span style={{ flex:1, fontSize:14.5, color: t.done ? 'var(--ink-3)' : 'var(--ink)',
                  textDecoration: t.done ? 'line-through' : 'none', textDecorationColor:'var(--ink-3)' }}>{t.text}</span>
                {t.from && <span className="pill" style={{ background:'var(--gold-soft)', color:'#9A7420', fontSize:10.5, padding:'3px 8px' }}>대화</span>}
              </div>
            ))}
          </div>
        </button>
      </div>

      {/* recent entries */}
      <div style={{ padding:'22px 18px 0' }}>
        <SectionHead label="지난 기록" right="회고 보기" onRight={onGoMonthly} />
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {window.RECENT.map((r,i)=>(
            <div key={i} className="card tap" style={{ padding:'13px 15px', display:'flex', alignItems:'center', gap:13 }}>
              <div style={{ width:44, flexShrink:0, textAlign:'center' }}>
                <div className="serif" style={{ fontSize:20, fontWeight:600, lineHeight:1 }}>{r.d}</div>
                <div className="faint" style={{ fontSize:11, marginTop:2 }}>{r.day}</div>
              </div>
              <div style={{ width:1, height:30, background:'var(--line)' }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:600, lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.title}</div>
                <div style={{ display:'flex', gap:6, marginTop:5 }}>
                  {r.cats.map(c=><span key={c} className="faint" style={{ fontSize:11.5, fontWeight:600 }}>#{c}</span>)}
                </div>
              </div>
              <window.MoodDot mood={r.mood} size={11} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionHead({ label, right, onRight }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:11, padding:'0 2px' }}>
      <span className="sec-label">{label}</span>
      {right && <button className="tap" onClick={onRight} style={{ border:'none', background:'none', color:'var(--ink-2)', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:3 }}>
        {right} <window.IcChevR size={13}/>
      </button>}
    </div>
  );
}

Object.assign(window, { HomeScreen, SectionHead });
