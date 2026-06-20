import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Animated, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Shadow, Radius } from '../constants/Colors';
import { CONVO, QUICK } from '../constants/Data';
import { useApp } from '../context/AppContext';
import { IcClose, IcMic, IcKeyb, IcArrowU, IcSpark, IcBook } from '../components/Icons';

// Breathing orb
function CoachOrb({ size = 28, active = false }: { size?: number; active?: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!active) { scale.setValue(1); return; }
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.07, duration: 1300, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1,    duration: 1300, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [active]);

  return (
    <Animated.View style={[styles.orb, { width: size, height: size, borderRadius: size / 2, transform: [{ scale }] }]}>
      <View style={styles.orbShine} />
    </Animated.View>
  );
}

// Animated blink dot
function BlinkDot() {
  const opacity = useRef(new Animated.Value(0.25)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.25, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  return <Animated.View style={[styles.recDot, { opacity }]} />;
}

type Mode = 'idle' | 'listening' | 'thinking';
interface Msg { id: number | string; role: 'coach' | 'user'; text: string; voice?: boolean; tag?: string; }

export default function ConvoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setTodayDone } = useApp();

  const [msgs, setMsgs] = useState<Msg[]>([{ ...CONVO[0], id: 0 }]);
  const [nextIdx, setNextIdx] = useState(1);
  const [mode, setMode] = useState<Mode>('idle');
  const [partial, setPartial] = useState('');
  const [kb, setKb] = useState(false);
  const [draft, setDraft] = useState('');
  const [done, setDone] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const T = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };

  const scrollDown = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  useEffect(scrollDown, [msgs, partial, mode, done]);

  const coachReply = useCallback((idx: number) => {
    setMode('thinking');
    const scripted = CONVO[idx]?.role === 'coach' ? CONVO[idx] : null;
    T(() => {
      const text = scripted?.text ?? '그 마음을 조금 더 들려주실 수 있어요?';
      const tag = scripted?.tag;
      setMsgs(m => [...m, { role: 'coach', text, tag, id: Date.now() + Math.random() }]);
      setMode('idle');
      if (scripted?.last) setDone(true);
      setNextIdx(idx + 1);
    }, 1100);
  }, []);

  const startListen = () => {
    if (mode !== 'idle' || done) return;
    const line = CONVO[nextIdx]?.role === 'user' ? CONVO[nextIdx].text : '오늘 있었던 일을 떠올려보고 있어요...';
    const words = line.split(' ');
    setMode('listening');
    setPartial('');
    let i = 0;
    const step = () => {
      i++;
      setPartial(words.slice(0, i).join(' '));
      if (i < words.length) T(step, 70 + Math.random() * 70);
      else T(() => commitSpeech(line), 500);
    };
    T(step, 350);
  };

  const stopListen = () => {
    if (mode !== 'listening') return;
    const line = CONVO[nextIdx]?.role === 'user' ? CONVO[nextIdx].text : partial || '...';
    commitSpeech(line);
  };

  const commitSpeech = (line: string) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPartial('');
    setMsgs(m => [...m, { role: 'user', voice: true, text: line, id: Date.now() }]);
    const ci = nextIdx + 1;
    setNextIdx(ci);
    T(() => coachReply(ci), 450);
  };

  const sendDraft = () => {
    const text = draft.trim();
    if (!text || mode === 'thinking') return;
    setDraft('');
    const scriptedUser = CONVO[nextIdx]?.role === 'user';
    setMsgs(m => [...m, { role: 'user', voice: false, text, id: Date.now() }]);
    const ci = scriptedUser ? nextIdx + 1 : nextIdx;
    setNextIdx(ci);
    T(() => coachReply(ci), 300);
  };

  const onQuick = (t: string) => {
    setMsgs(m => [...m, { role: 'user', voice: false, text: t, id: Date.now() }]);
    const sc = CONVO[nextIdx]?.role === 'user';
    const ci = sc ? nextIdx + 1 : nextIdx;
    setNextIdx(ci);
    T(() => coachReply(ci), 350);
  };

  const finishConvo = () => {
    setTodayDone(true);
    router.replace('/(tabs)/diary');
  };

  const quick = QUICK[nextIdx];
  const listening = mode === 'listening';
  const thinking = mode === 'thinking';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.closeBtn, Shadow.card]} onPress={() => router.back()} activeOpacity={0.8}>
            <IcClose size={18} color={Colors.ink2} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.headerTitle}>코치와 대화</Text>
            <View style={styles.headerSub}>
              <BlinkDot />
              <Text style={styles.headerSubText}>6월 14일 · 기록 중</Text>
            </View>
          </View>
          <View style={{ width: 38 }} />
        </View>

        {/* Chat */}
        <ScrollView ref={scrollRef} style={styles.chat} contentContainerStyle={{ padding: 18, gap: 16 }}
          showsVerticalScrollIndicator={false}>
          {msgs.map(m => (
            <View key={m.id}>
              {m.role === 'coach' ? (
                <View style={styles.coachRow}>
                  <CoachOrb size={28} />
                  <View style={{ maxWidth: '82%' }}>
                    {m.tag && (
                      <View style={styles.tagRow}>
                        <IcSpark size={12} color={Colors.terra} />
                        <Text style={styles.tagText}>{m.tag}</Text>
                      </View>
                    )}
                    <View style={[styles.coachBubble, Shadow.card]}>
                      <Text style={styles.coachText}>{m.text}</Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={styles.userRow}>
                  <View style={styles.userBubble}>
                    {m.voice && (
                      <View style={styles.voiceRow}>
                        <IcMic size={13} color="rgba(255,255,255,0.85)" />
                        <View style={styles.wavePlaceholder} />
                      </View>
                    )}
                    <Text style={styles.userText}>{m.text}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}

          {thinking && (
            <View style={styles.coachRow}>
              <CoachOrb size={28} active />
              <View style={[styles.coachBubble, Shadow.card, styles.thinkingBubble]}>
                {[0,1,2].map(i => <ThinkDot key={i} delay={i * 180} />)}
              </View>
            </View>
          )}

          {listening && (
            <View style={styles.userRow}>
              <View style={styles.userBubble}>
                <View style={styles.listeningRow}>
                  <View style={styles.waveAnim} />
                  <Text style={styles.listeningLabel}>듣는 중…</Text>
                </View>
                {partial ? <Text style={styles.userText}>{partial}｜</Text> : null}
              </View>
            </View>
          )}

          {done && (
            <View style={[styles.finishCard, Shadow.card]}>
              <View style={styles.finishIcon}>
                <IcBook size={24} color={Colors.terraD} />
              </View>
              <Text style={styles.finishTitle}>오늘 이야기, 잘 들었어요</Text>
              <Text style={styles.finishDesc}>나눈 이야기를 일기로 정리하고, 인사이트와 감정, 내일 이어갈 일들을 뽑아둘게요.</Text>
              <TouchableOpacity style={styles.finishBtn} onPress={finishConvo} activeOpacity={0.85}>
                <IcSpark size={18} color="#fff" />
                <Text style={styles.finishBtnText}>오늘의 일기 정리하기</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{ height: 8 }} />
        </ScrollView>

        {/* Dock */}
        {!done && (
          <View style={[styles.dock, { paddingBottom: insets.bottom + 12 }]}>
            {quick && mode === 'idle' && !kb && (
              <View style={styles.quickRow}>
                {quick.map(q => (
                  <TouchableOpacity key={q} style={styles.quickBtn} onPress={() => onQuick(q)} activeOpacity={0.8}>
                    <Text style={styles.quickText}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {kb ? (
              <View style={styles.kbRow}>
                <TouchableOpacity style={[styles.circleBtn, Shadow.card]} onPress={() => setKb(false)} activeOpacity={0.8}>
                  <IcMic size={20} color={Colors.terra} />
                </TouchableOpacity>
                <View style={[styles.inputBox, Shadow.card]}>
                  <TextInput
                    value={draft}
                    onChangeText={setDraft}
                    placeholder="직접 입력해 보세요…"
                    placeholderTextColor={Colors.ink3}
                    style={styles.textInput}
                    multiline
                    onSubmitEditing={sendDraft}
                  />
                  <TouchableOpacity
                    style={[styles.sendBtn, { backgroundColor: draft.trim() ? Colors.terra : Colors.line }]}
                    onPress={sendDraft}
                    activeOpacity={0.8}
                  >
                    <IcArrowU size={19} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.micRow}>
                <TouchableOpacity style={[styles.circleBtn, Shadow.card, { position: 'absolute', left: 0 }]} onPress={() => setKb(true)} activeOpacity={0.8}>
                  <IcKeyb size={20} color={Colors.ink2} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.micBtn, listening && styles.micBtnActive, thinking && { opacity: 0.5 }]}
                  onPress={listening ? stopListen : startListen}
                  disabled={thinking}
                  activeOpacity={0.85}
                >
                  {listening
                    ? <View style={styles.stopShape} />
                    : <IcMic size={30} color="#fff" />}
                </TouchableOpacity>
                <View style={{ position: 'absolute', right: 0, alignItems: 'center' }}>
                  <Text style={styles.tapHint}>탭하여</Text>
                  <Text style={styles.tapHint}>{listening ? '완료' : '말하기'}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function ThinkDot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.25)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, { toValue: 1, duration: 550, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.25, duration: 550, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  return <Animated.View style={[styles.thinkDot, { opacity }]} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.line2 },
  closeBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.paper, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 14.5, fontWeight: '700', color: Colors.ink },
  headerSub: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  recDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.terra },
  headerSubText: { fontSize: 11.5, color: Colors.ink3 },

  chat: { flex: 1 },
  coachRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  orb: { backgroundColor: Colors.terra, flexShrink: 0 },
  orbShine: { position: 'absolute', top: '24%', left: '26%', width: '22%', height: '22%', borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.55)' },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 5, marginLeft: 2 },
  tagText: { fontSize: 11, fontWeight: '700', color: Colors.terra },
  coachBubble: { backgroundColor: Colors.paper, borderRadius: 20, borderTopLeftRadius: 6, padding: 14 },
  coachText: { fontSize: 15, lineHeight: 24, color: Colors.ink },
  thinkingBubble: { flexDirection: 'row', gap: 5, alignItems: 'center', paddingVertical: 16 },
  thinkDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.ink3 },

  userRow: { alignItems: 'flex-end' },
  userBubble: { maxWidth: '82%', backgroundColor: Colors.terra, borderRadius: 20, borderBottomRightRadius: 6, padding: 13 },
  voiceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, opacity: 0.92 },
  wavePlaceholder: { flex: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 4 },
  userText: { fontSize: 15, lineHeight: 24, color: '#fff' },
  listeningRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  waveAnim: { width: 80, height: 20, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4 },
  listeningLabel: { fontSize: 11.5, fontWeight: '700', color: 'rgba(255,255,255,0.85)', marginLeft: 'auto' },

  finishCard: { backgroundColor: Colors.paper, borderRadius: Radius.md, padding: 22, marginTop: 16, alignItems: 'center' },
  finishIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: Colors.terraSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  finishTitle: { fontSize: 18, fontWeight: '600', fontFamily: 'NotoSerifKR_600SemiBold', color: Colors.ink },
  finishDesc: { fontSize: 13.5, color: Colors.ink2, lineHeight: 22, marginTop: 7, textAlign: 'center', maxWidth: 250 },
  finishBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.terra,
    borderRadius: 999, paddingHorizontal: 22, paddingVertical: 15, marginTop: 18, width: '100%', justifyContent: 'center' },
  finishBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  dock: { borderTopWidth: 1, borderTopColor: Colors.line2, backgroundColor: Colors.bg, paddingTop: 12, paddingHorizontal: 18 },
  quickRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 },
  quickBtn: { borderWidth: 1, borderColor: Colors.line, backgroundColor: Colors.paper, borderRadius: 999, paddingHorizontal: 15, paddingVertical: 9 },
  quickText: { fontSize: 13.5, fontWeight: '600', color: Colors.ink2 },

  kbRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 9 },
  circleBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.paper, alignItems: 'center', justifyContent: 'center' },
  inputBox: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', backgroundColor: Colors.paper, borderRadius: 24, paddingLeft: 16, padding: 4 },
  textInput: { flex: 1, fontSize: 15, color: Colors.ink, paddingVertical: 9, maxHeight: 90 },
  sendBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 1 },

  micRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  micBtn: { width: 74, height: 74, borderRadius: 37, backgroundColor: Colors.terra,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.terraD, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 8 },
  micBtnActive: { backgroundColor: Colors.terraD },
  stopShape: { width: 22, height: 22, borderRadius: 6, backgroundColor: '#fff' },
  tapHint: { fontSize: 10.5, fontWeight: '600', color: Colors.ink3, lineHeight: 16 },
});
