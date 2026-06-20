import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Shadow, Radius } from '../../constants/Colors';
import { TODOS_CARRY } from '../../constants/Data';
import { useApp } from '../../context/AppContext';
import { IcPlus, IcMoon, IcArrowU, IcSpark, IcMic } from '../../components/Icons';

function ProgressRing({ pct }: { pct: number }) {
  const r = 26, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
  return (
    <View style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={64} height={64} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={32} cy={32} r={r} fill="none" stroke={Colors.paper2} strokeWidth={7} />
        <Circle cx={32} cy={32} r={r} fill="none" stroke={Colors.terra} strokeWidth={7}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
      </Svg>
      <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.terra }}>{pct}%</Text>
    </View>
  );
}

function SectionHead({ label }: { label: string }) {
  return <Text style={styles.secLabel}>{label}</Text>;
}

export default function TodoScreen() {
  const insets = useSafeAreaInsets();
  const { todos, setTodos } = useApp();
  const [carry, setCarry] = useState(TODOS_CARRY);
  const [adding, setAdding] = useState('');

  const toggle = (id: string) => setTodos(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const add = () => {
    const text = adding.trim();
    if (!text) return;
    setTodos(ts => [...ts, { id: 'n' + Date.now(), text, done: false, cat: '기타' }]);
    setAdding('');
  };
  const pullCarry = (id: string) => {
    const item = carry.find(c => c.id === id);
    if (!item) return;
    setCarry(cs => cs.filter(c => c.id !== id));
    setTodos(ts => [...ts, { ...item, id: 'p' + Date.now() }]);
  };

  const done = todos.filter(t => t.done).length;
  const pct = todos.length ? Math.round(done / todos.length * 100) : 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 22, paddingBottom: 6 }}>
        <Text style={styles.secLabelTop}>오늘의 할 일</Text>
        <Text style={styles.title}>6월 14일</Text>
      </View>

      {/* Progress */}
      <View style={styles.section}>
        <View style={[styles.card, styles.progressCard, Shadow.card]}>
          <ProgressRing pct={pct} />
          <View style={{ flex: 1 }}>
            <Text style={styles.progressTitle}>{done}개 완료 · {todos.length - done}개 남음</Text>
            <Text style={styles.progressSub}>
              {pct === 100 ? '오늘 할 일을 다 끝냈어요. 멋져요!' : '천천히 하나씩, 충분히 잘하고 있어요.'}
            </Text>
          </View>
        </View>
      </View>

      {/* Add */}
      <View style={styles.section}>
        <View style={[styles.addRow, Shadow.card]}>
          <TextInput
            value={adding}
            onChangeText={setAdding}
            placeholder="할 일 추가하기"
            placeholderTextColor={Colors.ink3}
            style={styles.addInput}
            onSubmitEditing={add}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={add} style={[styles.addBtn, { backgroundColor: adding.trim() ? Colors.terra : Colors.line }]} activeOpacity={0.8}>
            <IcPlus size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <View style={styles.section}>
        <SectionHead label="할 일" />
        <View style={[styles.card, Shadow.card, { overflow: 'hidden' }]}>
          {todos.map((t, i) => (
            <TouchableOpacity key={t.id} onPress={() => toggle(t.id)} activeOpacity={0.7}
              style={[styles.todoRow, i < todos.length - 1 && styles.todoBorder]}>
              <View style={[styles.check, t.done && styles.checkDone]}>
                {t.done && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.todoText, t.done && styles.todoDone]} numberOfLines={2}>{t.text}</Text>
              {t.from === '대화' && (
                <View style={styles.convoPill}>
                  <IcMic size={10} color="#9A7420" />
                  <Text style={styles.convoPillText}>대화</Text>
                </View>
              )}
              <Text style={styles.catText}>{t.cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Carry */}
      {carry.length > 0 && (
        <View style={styles.section}>
          <SectionHead label="어제 못다 한 일" />
          <View style={{ gap: 9 }}>
            {carry.map(t => (
              <View key={t.id} style={[styles.card, styles.carryRow, Shadow.card]}>
                <IcMoon size={17} color={Colors.emoLow} />
                <Text style={styles.carryText}>{t.text}</Text>
                <TouchableOpacity onPress={() => pullCarry(t.id)} style={styles.carryBtn} activeOpacity={0.8}>
                  <IcArrowU size={14} color={Colors.terra} />
                  <Text style={styles.carryBtnText}>오늘로</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={[styles.section, { alignItems: 'center' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <IcSpark size={13} color={Colors.ink3} />
          <Text style={styles.hint}>할 일은 코치가 당신의 하루 맥락을 이해하는 데 쓰여요.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  secLabelTop: { fontSize: 11.5, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.ink3 },
  title: { marginTop: 8, fontSize: 28, fontWeight: '600', fontFamily: 'NotoSerifKR_600SemiBold', color: Colors.ink },
  section: { paddingHorizontal: 18, marginTop: 16 },
  secLabel: { fontSize: 11.5, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.ink3, marginBottom: 11 },
  card: { backgroundColor: Colors.paper, borderRadius: Radius.md },
  progressCard: { padding: 18, flexDirection: 'row', alignItems: 'center', gap: 18 },
  progressTitle: { fontSize: 16, fontWeight: '700', color: Colors.ink },
  progressSub: { color: Colors.ink2, fontSize: 13.5, lineHeight: 20, marginTop: 4 },
  addRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.paper, borderRadius: 18,
    paddingLeft: 16, paddingRight: 6, paddingVertical: 6, gap: 9 },
  addInput: { flex: 1, fontSize: 15, color: Colors.ink, paddingVertical: 10 },
  addBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  todoRow: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, paddingHorizontal: 16 },
  todoBorder: { borderBottomWidth: 1, borderBottomColor: Colors.line2 },
  check: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.8, borderColor: Colors.line,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  checkDone: { backgroundColor: Colors.sage, borderColor: Colors.sage },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  todoText: { flex: 1, fontSize: 15, lineHeight: 21, color: Colors.ink },
  todoDone: { color: Colors.ink3, textDecorationLine: 'line-through' },
  convoPill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: Colors.goldSoft,
    borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 },
  convoPillText: { color: '#9A7420', fontSize: 10.5, fontWeight: '600' },
  catText: { fontSize: 11.5, color: Colors.ink3, fontWeight: '600' },
  carryRow: { padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 },
  carryText: { flex: 1, fontSize: 14.5, color: Colors.ink },
  carryBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.paper2,
    borderRadius: 999, paddingHorizontal: 13, paddingVertical: 7 },
  carryBtnText: { color: Colors.terra, fontSize: 12.5, fontWeight: '700' },
  hint: { fontSize: 12.5, color: Colors.ink3, lineHeight: 20 },
});
