/* screen-monthly.jsx — monthly review */
function MonthlyScreen() {
  const days = window.MONTH_DAYS;
  const dist = window.MONTH_EMO_DIST;
  const cats = window.MONTH_CATS;
  const total = dist.reduce((s,d)=>s+d.n,0);
  const maxN = Math.max(...dist.map(d=>d.n));
  // pad calendar: June 2026 starts on Monday (1=Mon). col offset.
  const firstDow = 1; // Mon
  const recorded = days.filter(d=>d.mood).length;

  return (
    <div className="screen" style={{ paddingBottom:118 }}>
      <div style={{ padding:'70px 22px 6px' }}>
        <div className="sec-label">월별 회고</div>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:8 }}>
          <window.IcChevL size={20} style={{ color:'var(--ink-3)' }} />
          <h1 className="serif" style={{ margin:0, fontSize:28, fontWeight:600 }}>2026 · 6월</h1>
          <window.IcChevR size={20} style={{ color:'var(--ink-3)' }} />
        </div>
        <div className="muted" style={{ fontSize:13.5, marginTop:6 }}>이번 달 <b style={{color:'var(--terra)'}}>{recorded}일</b> 기록했어요. 꾸준함이 쌓이고 있어요.</div>
      </div>

      {/* mood calendar */}
      <div style={{ padding:'16px 18px 0' }}>
        <div className="card" style={{ padding:'18px 18px 20px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6, marginBottom:8 }}>
            {['월','화','수','목','금','토','일'].map(d=>(
              <div key={d} className="faint" style={{ textAlign:'center', fontSize:11, fontWeight:600 }}>{d}</div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6 }}>
            {Array.from({length:firstDow}).map((_,i)=><div key={'p'+i} />)}
            {days.map(d=>{
              const e = d.mood ? window.EMO[d.mood] : null;
              const today = d.day===14;
              return (
                <div key={d.day} style={{ aspectRatio:'1', borderRadius:11, display:'grid', placeItems:'center', position:'relative',
                  background: e ? `color-mix(in srgb, ${e.color} 20%, var(--paper))` : 'var(--paper-2)',
                  border: today ? '2px solid var(--terra)' : '1px solid transparent' }}>
                  <span style={{ fontSize:12, fontWeight: today?700:600, color: e ? `color-mix(in srgb, ${e.color} 55%, var(--ink))` : 'var(--ink-3)' }}>{d.day}</span>
                  {e && <span style={{ position:'absolute', bottom:5, width:5, height:5, borderRadius:'50%', background:e.color }} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* emotion distribution */}
      <div style={{ padding:'22px 18px 0' }}>
        <window.SectionHead label="이번 달 감정 분포" />
        <div className="card" style={{ padding:'18px 19px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
            {dist.map(d=>{
              const e = window.EMO[d.key];
              return (
                <div key={d.key} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:42, fontSize:13, fontWeight:600, color:'var(--ink-2)' }}>{e.label}</div>
                  <div style={{ flex:1, height:10, borderRadius:6, background:'var(--paper-2)', overflow:'hidden' }}>
                    <div style={{ width:`${(d.n/maxN)*100}%`, height:'100%', borderRadius:6, background:e.color,
                      transition:'width .6s ease' }} />
                  </div>
                  <div className="faint" style={{ width:30, textAlign:'right', fontSize:12.5, fontWeight:600 }}>{d.n}일</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* category insights */}
      <div style={{ padding:'24px 18px 0' }}>
        <window.SectionHead label="카테고리별 흐름" />
        <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
          {cats.map((c,i)=>(
            <div key={i} className="card" style={{ padding:'17px 18px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:9 }}>
                <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                  <span style={{ width:10, height:10, borderRadius:3, background:c.color }} />
                  <span style={{ fontSize:15, fontWeight:700 }}>{c.name}</span>
                </div>
                <span className="faint" style={{ fontSize:12.5, fontWeight:600 }}>{c.n}개 기록</span>
              </div>
              <div style={{ fontSize:13.5, lineHeight:1.62, color:'var(--ink)', display:'flex', gap:8 }}>
                <window.IcSpark size={15} style={{ color:c.color, flexShrink:0, marginTop:2 }} />
                <span>{c.insight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* keywords */}
      <div style={{ padding:'24px 18px 0' }}>
        <window.SectionHead label="이번 달의 단어들" />
        <div className="card" style={{ padding:'18px 18px 20px' }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:9 }}>
            {window.MONTH_KEYWORDS.map((k,i)=>{
              const sizes=[22,16,19,15,18,15];
              return <span key={k} className="serif" style={{ fontSize:sizes[i%sizes.length], fontWeight:600,
                color:`color-mix(in srgb, var(--terra) ${30+ (i%3)*22}%, var(--ink))` }}>{k}</span>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { MonthlyScreen });
