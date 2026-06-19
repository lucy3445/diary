/* data.jsx — emotion palette, conversation script, diary, todos, monthly */

// ── emotions ───────────────────────────────────────────
const EMO = {
  joy:   { key:'joy',   label:'뿌듯',  color:'var(--emo-joy)',   face:'◠‿◠' },
  calm:  { key:'calm',  label:'평온',  color:'var(--emo-calm)',  face:'◡' },
  focus: { key:'focus', label:'몰입',  color:'var(--emo-focus)', face:'◉' },
  tired: { key:'tired', label:'지침',  color:'var(--emo-tired)', face:'－' },
  anx:   { key:'anx',   label:'긴장',  color:'var(--emo-anx)',   face:'◠' },
  low:   { key:'low',   label:'가라앉음', color:'var(--emo-low)', face:'◡' },
};

// ── coaching conversation (scripted spine, AI-augmentable) ──
// each user turn carries the line the "voice" transcribes to.
const CONVO = [
  { role:'coach', text:'좋은 저녁이에요. 오늘 하루, 아침부터 떠오르는 대로 편하게 들려주세요.\n제가 옆에서 같이 정리해드릴게요.' },
  { role:'user',  text:'오늘 좀 정신없었어. 오전에 디자인 시안 발표가 있었는데 긴장을 많이 했어. 팀장님이 피드백을 많이 주셔서 처음엔 위축됐는데, 오후에 다시 수정해서 결국 마일스톤 하나를 마무리했어.' },
  { role:'coach', text:'마일스톤을 끝냈군요, 정말 고생 많았어요. 발표 전에 긴장했다고 하셨는데 — 그 긴장은 어떤 마음에서 왔던 것 같아요? 잘 보이고 싶었던 걸까요, 준비가 부족하게 느껴졌던 걸까요?', tag:'감정 들여다보기' },
  { role:'user',  text:'둘 다였던 것 같아. 완벽하게 보여주고 싶었는데, 전날 늦게까지 했는데도 뭔가 부족한 느낌이 들었어.' },
  { role:'coach', text:'완벽하게 해내고 싶은 마음이 컸군요. 그런데 결국 피드백을 받아 수정하고 마일스톤까지 마쳤잖아요. 그 과정에서 스스로에 대해 새롭게 알게 된 점이 있을까요?', tag:'인사이트 끌어내기' },
  { role:'user',  text:'피드백 받는 게 무섭다고만 생각했는데, 막상 받고 고치니까 결과물이 훨씬 좋아졌어. 혼자 끙끙대는 것보다 빨리 보여주는 게 낫다는 걸 또 느꼈어.' },
  { role:'coach', text:'정말 중요한 깨달음이네요 — "혼자 완벽하게"보다 "빨리 보여주고 함께 고치기". 오늘 감정을 돌아보면, 아침의 긴장에서 지금은 어떤 마음으로 바뀌어 있나요?', tag:'감정 돌보기' },
  { role:'user',  text:'지금은 좀 뿌듯하고 후련해. 근데 운동을 또 못 가서 그건 좀 아쉬워.' },
  { role:'coach', text:'뿌듯함과 작은 아쉬움이 함께 있네요. 그 아쉬움도 스스로를 챙기고 싶은 마음이라 소중해요. 오늘 이야기 충분히 들었어요. 이제 일기로 정리하고, 인사이트와 감정, 내일 이어갈 일들을 뽑아볼게요.', last:true },
];

// quick reply chips offered at certain steps (index into CONVO user turns)
const QUICK = {
  1: ['오늘 있었던 일 말하기', '바로 감정부터 얘기할래'],
  3: ['맞아, 둘 다였어', '준비가 부족했어'],
  5: ['빨리 공유하는 게 낫더라', '아직도 잘 모르겠어'],
  7: ['뿌듯하고 후련해', '아직 좀 지쳐있어'],
};

// ── today's generated diary ────────────────────────────
const DIARY = {
  dateLabel: '6월 14일 토요일',
  title: '부딪히고, 고치고, 끝내 마무리한 하루',
  moodArc: ['anx','focus','joy'],
  primary: 'joy',
  body: `오전 디자인 시안 발표를 앞두고 잔뜩 긴장했다. 완벽하게 보여주고 싶은 마음에 전날 늦게까지 매달렸지만, 발표 자리에서 팀장님의 피드백이 쏟아지자 처음엔 위축됐다. 그래도 오후에 마음을 다잡고 하나씩 수정했고, 결국 미뤄두었던 마일스톤 하나를 마무리했다.\n\n돌아보니 두려워하던 피드백이 결과물을 훨씬 좋게 만들었다. 혼자 끙끙 앓기보다 빨리 보여주고 함께 고치는 편이 낫다는 걸 다시 한 번 몸으로 배웠다. 마무리한 지금은 뿌듯하고 후련하다. 다만 오늘도 운동을 건너뛴 건 조금 아쉽다.`,
  insights: [
    { type:'learn', text:'피드백은 위협이 아니라 결과물을 끌어올리는 재료다. 두려움은 대부분 "받기 전"에 가장 크다.' },
    { type:'keep',  text:'완성도가 낮아 보여도 빨리 공유하고 함께 다듬는 방식. 오늘도 이게 통했다.' },
    { type:'fix',   text:'발표 전날 몰아서 준비하는 습관. 미리 중간 점검을 받았다면 긴장이 덜했을 것.' },
  ],
  tags: ['업무', '성장', '건강'],
  carryTodos: [
    '디자인 시안 2차 수정안 팀에 공유하기',
    '다음 발표는 3일 전 중간 리뷰 잡기',
    '저녁 30분 가볍게 걷기',
  ],
};

// ── todos ──────────────────────────────────────────────
const TODOS_TODAY = [
  { id:'t1', text:'디자인 시안 발표 준비 마무리', done:true,  cat:'업무' },
  { id:'t2', text:'마일스톤 1 리뷰 반영', done:true,  cat:'업무' },
  { id:'t3', text:'시안 2차 수정안 팀에 공유', done:false, cat:'업무', from:'대화' },
  { id:'t4', text:'저녁 30분 가볍게 걷기', done:false, cat:'건강', from:'대화' },
  { id:'t5', text:'엄마 생신 선물 알아보기', done:false, cat:'관계' },
];
const TODOS_CARRY = [
  { id:'c1', text:'헬스장 PT 일정 다시 잡기', done:false, cat:'건강' },
];

// ── recent entries (home) ──────────────────────────────
const RECENT = [
  { d:'13', day:'금', mood:'tired', title:'끝이 안 보이던 회의들, 그래도 버틴 날', cats:['업무'] },
  { d:'12', day:'목', mood:'calm',  title:'오랜만에 산책하며 머리를 비운 저녁', cats:['건강','관계'] },
  { d:'11', day:'수', mood:'focus', title:'몰입이 잘 되던, 코드가 술술 풀린 하루', cats:['업무','성장'] },
];

// ── monthly ────────────────────────────────────────────
// 6월: day -> emotion key (sample). null = no entry
const MONTH_DAYS = (() => {
  const seq = {
    1:'calm',2:'focus',3:'tired',4:'anx',5:'joy',6:'calm',7:'low',
    8:'focus',9:'focus',10:'tired',11:'focus',12:'calm',13:'tired',14:'joy',
  };
  const arr = [];
  for (let i=1;i<=30;i++) arr.push({ day:i, mood: seq[i] || null });
  return arr;
})();

const MONTH_EMO_DIST = [
  { key:'focus', n:5 }, { key:'calm', n:4 }, { key:'joy', n:3 },
  { key:'tired', n:4 }, { key:'anx', n:2 }, { key:'low', n:1 },
];

const MONTH_CATS = [
  { name:'업무·성장', n:11, color:'var(--terra)',
    insight:'"빨리 공유하고 함께 고치기"가 이번 달 반복된 성공 공식. 혼자 완벽을 좇을수록 더뎌졌다.' },
  { name:'건강·몸', n:6, color:'var(--sage)',
    insight:'운동을 미루는 패턴이 9일 반복. 일이 바쁜 주에 가장 먼저 건너뛴다.' },
  { name:'관계·마음', n:5, color:'var(--gold)',
    insight:'사람들과 대화한 날의 기분이 확연히 좋았다. 고립될수록 가라앉는 경향.' },
];

const MONTH_KEYWORDS = ['피드백', '마일스톤', '완벽주의', '산책', '몰입', '아쉬움'];

Object.assign(window, {
  EMO, CONVO, QUICK, DIARY, TODOS_TODAY, TODOS_CARRY, RECENT,
  MONTH_DAYS, MONTH_EMO_DIST, MONTH_CATS, MONTH_KEYWORDS,
});
