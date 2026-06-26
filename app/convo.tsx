import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Animated, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Shadow, Radius } from '../constants/Colors';
import { useApp } from '../context/AppContext';
import { IcClose, IcMic, IcKeyb, IcArrowU, IcSpark, IcBook } from '../components/Icons';
import { sendToCoach, ChatTurn } from '../services/gemini';

const OPENING = '안녕하세요! 오늘 하루 어떠셨어요? 기억에 남는 일이 있으면 편하게 이야기해 주세요.';
const QUICK_CHIPS = ['좋았어요', '힘들었어요', '그냥 그랬어요', '바빴어요'];

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

type Mode = 'idle' | 'thinking';
interface Msg { id: number | string; role: 'coach' | 'user'; text: string; }

export default function ConvoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setTodayDone } = useApp();

  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, role: 'coach', text: OPENING }]);
  const [geminiHistory, setGeminiHistory] = useState<ChatTurn[]>([]);
  const [mode, setMode] = useState<Mode>('idle');
  const [kb, setKb] = useState(true);
  const [draft, setDraft] = useState('');
  const [done, setDone] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  const scrollDown = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  useEffect(scrollDown, [msgs, mode, done]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || mode === 'thinking' || done) return;
    setShowQuick(false);
    setDraft('');

    const userMsg: Msg = { id: Date.now(), role: 'user', text };
    setMsgs(m => [...m, userMsg]);
    setMode('thinking');

    try {
      const { text: coachText, done: isDone } = await sendToCoach(geminiHistory, text);

      const newHistory: ChatTurn[] = [
        ...geminiHistory,
        { role: 'user', text },
        { role: 'model', text: coachText },
      ];
      setGeminiHistory(newHistory);

      setMsgs(m => [...m, { id: Date.now() + 1, role: 'coach', text: coachText }]);
      if (isDone) setDone(true);
    } catch (e: any) {
      const msg = String(e?.message || e).replace(/key=[^&\s]+/, 'key=***');
      setMsgs(m => [...m, {
        id: Date.now() + 1,
        role: 'coach',
        text: `[오류] ${msg}`,
      }]);
    } finally {
      setMode('idle');
    }
  };

  const finishConvo = () => {
    setTodayDone(true);
    router.replace('/(tabs)/diary');
  };

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
              <Text style={styles.headerSubText}>기록 중</Text>
            </View>
          </View>
          <View style={{ width: 38 }} />
        </View>

        {/* Chat */}
        <ScrollView
          ref={scrollRef}
          style={styles.chat}
          contentContainerStyle={{ padding: 18, gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {msgs.map(m => (
            <View key={m.id}>
              {m.role === 'coach' ? (
                <View style={styles.coachRow}>
                  <CoachOrb size={28} />
                  <View style={[styles.coachBubble, Shadow.card]}>
                    <Text style={styles.coachText}>{m.text}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.userRow}>
                  <View style={styles.userBubble}>
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
                {[0, 1, 2].map(i => <ThinkDot key={i} delay={i * 180} />)}
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
            {showQuick && mode === 'idle' && (
              <View style={styles.quickRow}>
                {QUICK_CHIPS.map(q => (
                  <TouchableOpacity key={q} style={styles.quickBtn} onPress={() => sendMessage(q)} activeOpacity={0.8}>
                    <Text style={styles.quickText}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.kbRow}>
              <View style={[styles.inputBox, Shadow.card]}>
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  placeholder="오늘 하루를 이야기해 주세요…"
                  placeholderTextColor={Colors.ink3}
                  style={styles.textInput}
                  multiline
                  editable={!thinking}
                />
                <TouchableOpacity
                  style={[styles.sendBtn, { backgroundColor: draft.trim() && !thinking ? Colors.terra : Colors.line }]}
                  onPress={() => sendMessage(draft)}
                  activeOpacity={0.8}
                  disabled={thinking || !draft.trim()}
                >
                  <IcArrowU size={19} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
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
  coachBubble: { backgroundColor: Colors.paper, borderRadius: 20, borderTopLeftRadius: 6, padding: 14, maxWidth: '82%' },
  coachText: { fontSize: 15, lineHeight: 24, color: Colors.ink },
  thinkingBubble: { flexDirection: 'row', gap: 5, alignItems: 'center', paddingVertical: 16 },
  thinkDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.ink3 },

  userRow: { alignItems: 'flex-end' },
  userBubble: { maxWidth: '82%', backgroundColor: Colors.terra, borderRadius: 20, borderBottomRightRadius: 6, padding: 13 },
  userText: { fontSize: 15, lineHeight: 24, color: '#fff' },

  finishCard: { backgroundColor: Colors.paper, borderRadius: Radius.md, padding: 22, marginTop: 16, alignItems: 'center' },
  finishIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: Colors.terraSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  finishTitle: { fontSize: 18, fontWeight: '600', fontFamily: 'NotoSerifKR_600SemiBold', color: Colors.ink },
  finishDesc: { fontSize: 13.5, color: Colors.ink2, lineHeight: 22, marginTop: 7, textAlign: 'center', maxWidth: 250 },
  finishBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.terra,
    borderRadius: 999, paddingHorizontal: 22, paddingVertical: 15, marginTop: 18, width: '100%', justifyContent: 'center' },
  finishBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  dock: { borderTopWidth: 1, borderTopColor: Colors.line2, backgroundColor: Colors.bg, paddingTop: 12, paddingHorizontal: 18 },
  quickRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 10 },
  quickBtn: { borderWidth: 1, borderColor: Colors.line, backgroundColor: Colors.paper, borderRadius: 999, paddingHorizontal: 15, paddingVertical: 9 },
  quickText: { fontSize: 13.5, fontWeight: '600', color: Colors.ink2 },

  kbRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 9 },
  inputBox: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', backgroundColor: Colors.paper, borderRadius: 24, paddingLeft: 16, padding: 4 },
  textInput: { flex: 1, fontSize: 15, color: Colors.ink, paddingVertical: 9, maxHeight: 90 },
  sendBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 1 },
});
