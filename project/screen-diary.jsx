/* screen-diary.jsx — today's generated diary, insights, emotions */
function DiaryScreen({ onBack, onAddTodos, addedTodos }) {
  const D = window.DIARY;
  const e = window.EMO[D.primary];

  return (
    <div className="screen" style={{ paddingBottom:40 }}>
      {/* hero header */}
      <div style={{ background:`linear-gradient(165deg, ${`color-mix(in srgb, ${e.color} 22%, #FBF7EF)`} 0%, var(--bg) 78%)`,
        padding:'58px 22px 22px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button className="tap" onClick={onBack} style={{ border:'none', background:'var(--paper)', width:38, height:38,
            borderRadius:'50%', display:'grid', placeItems:'center', boxShadow:'var(--shadow-card)', color:'var(--ink-2)', cursor:'pointer' }}>
            <window.IcChevL size={19}/>
          </button>
          <span className="pill" style={{ background:'var(--paper)', boxShadow:'var(--shadow-card)', color:'var(--ink-2)' }}>
            <window.IcBook size={13}/> 오늘의 일기
          </span>
          <div style={{ width:38 }} />
        </div>
        <div style={{ marginTop:20 }}>
          <div className="faint" style={{ fontSize:13, fontWeight:600 }}>{D.dateLabel}</div>
          <h1 className="serif" style={{ margin:'8px 0 0', fontSize:25, fontWeight:600, lineHeight:1.38, letterSpacing:'-0.01em' }}>{D.title}</h1>
          <div style={{ marginTop:15 }}><window.MoodArc arc={D.moodArc} /></div>
        </div>
      </div>

      {/* diary body */}
      <div style={{ padding:'8px 20px 0' }}>
        <div className="card" style={{ padding:'22px 21px', position:'relative' }}>
          <window.IcQuote size={26} style={{ color:'var(--terra-soft)', position:'absolute', top:16, right:18 }} />
          <p className="serif" style={{ margin:0, fontSize:15.5, lineHeight:1.95, whiteSpace:'pre-line', color:'#403A32' }}>{D.body}</p>
          <div style={{ display:'flex', gap:7, marginTop:18, flexWrap:'wrap' }}>
            {D.tags.map(t=><window.Tag key={t}>{t}</window.Tag>)}
          </div>
        </div>
      </div>

      {/* insights */}
      <div style={{ padding:'26px 20px 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:13, padding:'0 2px' }}>
          <window.IcSpark size={17} style={{ color:'var(--terra)' }} />
          <span className="sec-label" style={{ color:'var(--ink-2)' }}>오늘 길어올린 것</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
          {D.insights.map((ins,i)=><window.InsightCard key={i} ins={ins} delay={i*90} />)}
        </div>
      </div>

      {/* emotion care */}
      <div style={{ padding:'26px 20px 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:13, padding:'0 2px' }}>
          <window.IcHeart size={17} style={{ color:'var(--terra)' }} />
          <span className="sec-label" style={{ color:'var(--ink-2)' }}>감정 돌봄</span>
        </div>
        <div className="card" style={{ padding:'19px 20px', display:'flex', gap:16, alignItems:'center' }}>
          <div style={{ width:58, height:58, borderRadius:'50%', flexShrink:0, display:'grid', placeItems:'center',
            background:`color-mix(in srgb, ${e.color} 18%, var(--paper))`, color:e.color, fontSize:22 }}>
            <window.IcSun size={28}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:e.color }}>지금의 마음 · {e.label}</div>
            <div style={{ fontSize:14, lineHeight:1.6, marginTop:5, color:'var(--ink)' }}>
              긴장으로 시작했지만 <b>뿌듯함과 후련함</b>으로 마무리했어요. 운동을 못 한 작은 아쉬움도 스스로를 챙기려는 마음이에요.
            </div>
          </div>
        </div>
      </div>

      {/* carry-over todos */}
      <div style={{ padding:'26px 20px 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7, padding:'0 2px' }}>
          <window.IcCheck size={17} style={{ color:'var(--terra)' }} />
          <span className="sec-label" style={{ color:'var(--ink-2)' }}>내일로 이어갈 일</span>
        </div>
        <div className="faint" style={{ fontSize:12.5, lineHeight:1.5, padding:'0 2px', marginBottom:12 }}>대화에서 코치가 제안했어요. 추가하면 내일 할 일에 담겨요.</div>
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {D.carryTodos.map((t,i)=>{
            const added = addedTodos.includes(t);
            return (
              <div key={i} className="card" style={{ padding:'13px 15px', display:'flex', alignItems:'center', gap:12 }}>
                <window.IcSeed size={18} style={{ color:'var(--sage)', flexShrink:0 }} />
                <span style={{ flex:1, fontSize:14.5, lineHeight:1.45 }}>{t}</span>
                <button className="tap" onClick={()=>!added && onAddTodos(t)} style={{ border:'none', cursor: added?'default':'pointer',
                  background: added?'var(--sage-soft)':'var(--terra)', color: added?'var(--sage-d)':'#fff',
                  borderRadius:999, padding:'7px 13px', fontSize:12.5, fontWeight:700, display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
                  {added ? <>담김 ✓</> : <><window.IcPlus size={14}/>추가</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding:'28px 20px 0' }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ width:'100%' }}>홈으로 돌아가기</button>
      </div>
    </div>
  );
}
Object.assign(window, { DiaryScreen });
