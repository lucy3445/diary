/* ui.jsx — shared small components */

const EMO_LIST = ['joy','calm','focus','tired','anx','low'];

// solid mood dot
function MoodDot({ mood, size = 12 }) {
  const e = window.EMO[mood];
  return <span style={{ width:size, height:size, borderRadius:'50%',
    background:e ? e.color : 'var(--ink-3)', display:'inline-block', flexShrink:0 }} />;
}

// mood chip with label
function MoodChip({ mood, faded }) {
  const e = window.EMO[mood];
  if (!e) return null;
  return (
    <span className="pill" style={{
      background: faded ? 'var(--paper-2)' : `color-mix(in srgb, ${e.color} 16%, var(--paper))`,
      color: faded ? 'var(--ink-2)' : `color-mix(in srgb, ${e.color} 62%, var(--ink))`,
    }}>
      <MoodDot mood={mood} size={9} />{e.label}
    </span>
  );
}

// emotion arc:  a → b → c
function MoodArc({ arc }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
      {arc.map((m,i) => (
        <React.Fragment key={i}>
          <MoodChip mood={m} />
          {i < arc.length-1 && (
            <window.IcChevR size={14} style={{ color:'var(--ink-3)' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// static waveform (for recorded voice bubble)
function WaveBars({ n = 22, color = 'currentColor', h = 18, seed = 1 }) {
  const bars = React.useMemo(() => {
    const a = [];
    let s = seed * 9301 + 49297;
    for (let i=0;i<n;i++){ s = (s*9301+49297)%233280; a.push(0.25 + (s/233280)*0.75); }
    return a;
  }, [n, seed]);
  return (
    <span className="wf" style={{ color, height:h }}>
      {bars.map((v,i)=><i key={i} style={{ height: Math.round(v*h) }} />)}
    </span>
  );
}

// insight category meta
const INSIGHT_META = {
  learn: { label:'오늘 배운 점', Icon: () => <window.IcSpark size={18}/>, color:'var(--gold)' },
  keep:  { label:'이어갈 점',   Icon: () => <window.IcLeaf  size={18}/>, color:'var(--sage)' },
  fix:   { label:'고칠 점',     Icon: () => <window.IcTool  size={18}/>, color:'var(--terra)' },
};

function InsightCard({ ins, delay = 0 }) {
  const m = INSIGHT_META[ins.type];
  return (
    <div className="card rise" style={{ padding:'16px 17px', display:'flex', gap:13, animationDelay:`${delay}ms` }}>
      <div style={{ width:34, height:34, borderRadius:11, flexShrink:0, display:'grid', placeItems:'center',
        background:`color-mix(in srgb, ${m.color} 15%, var(--paper))`, color:m.color }}>
        <m.Icon />
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:12.5, fontWeight:700, color:m.color, marginBottom:4, letterSpacing:'-0.01em' }}>{m.label}</div>
        <div style={{ fontSize:14.5, lineHeight:1.55, color:'var(--ink)' }}>{ins.text}</div>
      </div>
    </div>
  );
}

// category tag
function Tag({ children }) {
  return <span className="pill" style={{ background:'var(--paper-2)', color:'var(--ink-2)', fontWeight:600 }}>#{children}</span>;
}

Object.assign(window, { EMO_LIST, MoodDot, MoodChip, MoodArc, WaveBars, InsightCard, INSIGHT_META, Tag });
