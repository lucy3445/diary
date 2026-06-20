import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Shadow, Radius } from '../../constants/Colors';
import { DIARY, EMO } from '../../constants/Data';
import { useApp } from '../../context/AppContext';
import { IcBook, IcMic, IcChevL, IcSpark, IcHeart, IcCheck, IcSeed, IcPlus, IcSun, IcQuote } from '../../components/Icons';
import { MoodArc } from '../../components/MoodChip';
import { InsightCard } from '../../components/InsightCard';

function DiaryEmpty() {
  const router = useRouter();
  return (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, Shadow.card]}>
        <IcBook size={36} color={Colors.terra} />
      </View>
      <Text style={styles.emptyTitle}>아직 오늘 일기가 없어요</Text>
      <Text style={styles.emptyDesc}>코치와 잠깐 이야기하면{'\n'}일기와 인사이트로 정리해드려요.</Text>
      <TouchableOpacity style={styles.startBtn} onPress={() => router.push('/convo')} activeOpacity={0.85}>
        <IcMic size={18} color="#fff" />
        <Text style={styles.startBtnText}>오늘 기록 시작하기</Text>
      </TouchableOpacity>
    </View>
  );
}

function DiaryDetail() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addedTodos, addTodoFromDiary } = useApp();
  const D = DIARY;
  const e = EMO[D.primary];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={[styles.hero, { paddingTop: insets.top + 16 }]}>
        <View style={styles.heroNav}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, Shadow.card]} activeOpacity={0.8}>
            <IcChevL size={19} color={Colors.ink2} />
          </TouchableOpacity>
          <View style={[styles.heroPill, Shadow.card]}>
            <IcBook size={13} color={Colors.ink2} />
            <Text style={styles.heroPillText}>오늘의 일기</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.dateLabel}>{D.dateLabel}</Text>
          <Text style={styles.diaryTitle}>{D.title}</Text>
          <View style={{ marginTop: 15 }}>
            <MoodArc arc={D.moodArc} />
          </View>
        </View>
      </View>

      {/* Body */}
      <View style={styles.section}>
        <View style={[styles.card, Shadow.card, { padding: 22 }]}>
          <View style={styles.quoteIcon}>
            <IcQuote size={26} color={Colors.terraSoft} />
          </View>
          <Text style={styles.diaryBody}>{D.body}</Text>
          <View style={styles.tags}>
            {D.tags.map(t => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>#{t}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Insights */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <IcSpark size={17} color={Colors.terra} />
          <Text style={styles.secLabel}>오늘 길어올린 것</Text>
        </View>
        <View style={{ gap: 11 }}>
          {D.insights.map((ins, i) => <InsightCard key={i} type={ins.type} text={ins.text} />)}
        </View>
      </View>

      {/* Emotion Care */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <IcHeart size={17} color={Colors.terra} />
          <Text style={styles.secLabel}>감정 돌봄</Text>
        </View>
        <View style={[styles.card, Shadow.card, { padding: 19, flexDirection: 'row', gap: 16, alignItems: 'center' }]}>
          <View style={[styles.emoIcon, { backgroundColor: e.color + '30' }]}>
            <IcSun size={28} color={e.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.emoLabel, { color: e.color }]}>지금의 마음 · {e.label}</Text>
            <Text style={styles.emoText}>
              긴장으로 시작했지만 <Text style={{ fontWeight: '700' }}>뿌듯함과 후련함</Text>으로 마무리했어요. 운동을 못 한 작은 아쉬움도 스스로를 챙기려는 마음이에요.
            </Text>
          </View>
        </View>
      </View>

      {/* Carry Todos */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <IcCheck size={17} color={Colors.terra} />
          <Text style={styles.secLabel}>내일로 이어갈 일</Text>
        </View>
        <Text style={styles.carryHint}>대화에서 코치가 제안했어요. 추가하면 내일 할 일에 담겨요.</Text>
        <View style={{ gap: 9, marginTop: 12 }}>
          {D.carryTodos.map((t, i) => {
            const added = addedTodos.includes(t);
            return (
              <View key={i} style={[styles.card, Shadow.card, { padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
                <IcSeed size={18} color={Colors.sage} />
                <Text style={styles.carryText}>{t}</Text>
                <TouchableOpacity
                  onPress={() => !added && addTodoFromDiary(t)}
                  style={[styles.addTodoBtn, added && styles.addedBtn]}
                  activeOpacity={0.8}
                >
                  {added
                    ? <Text style={[styles.addTodoBtnText, { color: Colors.sageD }]}>담김 ✓</Text>
                    : <>
                        <IcPlus size={14} color="#fff" />
                        <Text style={styles.addTodoBtnText}>추가</Text>
                      </>
                  }
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.section, { paddingBottom: 0 }]}>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={styles.homeBtnText}>홈으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function DiaryTab() {
  const { todayDone } = useApp();
  return todayDone ? <DiaryDetail /> : <DiaryEmpty />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: Colors.bg, paddingBottom: 80 },
  emptyIcon: { width: 74, height: 74, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.paper, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '600', fontFamily: 'NotoSerifKR_600SemiBold', color: Colors.ink },
  emptyDesc: { fontSize: 14, color: Colors.ink2, lineHeight: 22, marginTop: 8, textAlign: 'center' },
  startBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.terra,
    borderRadius: 999, paddingHorizontal: 22, paddingVertical: 15, marginTop: 22 },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  hero: { padding: 22, paddingBottom: 22 },
  heroNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.paper, alignItems: 'center', justifyContent: 'center' },
  heroPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.paper,
    borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  heroPillText: { color: Colors.ink2, fontSize: 13, fontWeight: '600' },
  dateLabel: { fontSize: 13, fontWeight: '600', color: Colors.ink3 },
  diaryTitle: { marginTop: 8, fontSize: 25, fontWeight: '600', lineHeight: 35, letterSpacing: -0.2,
    fontFamily: 'NotoSerifKR_600SemiBold', color: Colors.ink },

  section: { paddingHorizontal: 20, marginTop: 8, marginBottom: 18 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 13 },
  secLabel: { fontSize: 11.5, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.ink2 },
  card: { backgroundColor: Colors.paper, borderRadius: Radius.md },

  quoteIcon: { position: 'absolute', top: 16, right: 18 },
  diaryBody: { fontSize: 15.5, lineHeight: 30, color: '#403A32', fontFamily: 'NotoSerifKR_400Regular' },
  tags: { flexDirection: 'row', gap: 7, flexWrap: 'wrap', marginTop: 18 },
  tag: { backgroundColor: Colors.paper2, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 5 },
  tagText: { color: Colors.ink2, fontSize: 12.5, fontWeight: '600' },

  emoIcon: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  emoLabel: { fontSize: 13, fontWeight: '700' },
  emoText: { fontSize: 14, lineHeight: 22, color: Colors.ink, marginTop: 5 },

  carryHint: { fontSize: 12.5, color: Colors.ink3, lineHeight: 20 },
  carryText: { flex: 1, fontSize: 14.5, lineHeight: 21, color: Colors.ink },
  addTodoBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.terra,
    borderRadius: 999, paddingHorizontal: 13, paddingVertical: 7, flexShrink: 0 },
  addedBtn: { backgroundColor: Colors.sageSoft },
  addTodoBtnText: { color: '#fff', fontSize: 12.5, fontWeight: '700' },

  homeBtn: { backgroundColor: Colors.paper, borderRadius: 999, paddingVertical: 15, alignItems: 'center', ...Shadow.card },
  homeBtnText: { fontSize: 16, fontWeight: '700', color: Colors.ink },
});
