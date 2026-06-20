import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Shadow, Radius } from '../../constants/Colors';
import { DIARY, RECENT } from '../../constants/Data';
import { useApp } from '../../context/AppContext';
import { IcMoon, IcFlame, IcMic, IcChevR, IcBook } from '../../components/Icons';
import { MoodArc, MoodDot } from '../../components/MoodChip';

function SectionHead({ label, right, onRight }: { label: string; right?: string; onRight?: () => void }) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.secLabel}>{label}</Text>
      {right && (
        <TouchableOpacity onPress={onRight} style={styles.sectionRight} activeOpacity={0.7}>
          <Text style={styles.sectionRightText}>{right}</Text>
          <IcChevR size={13} color={Colors.ink2} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { todayDone, todos } = useApp();
  const D = DIARY;

  const doneCount = todos.filter(t => t.done).length;
  const openCount = todos.filter(t => !t.done).length;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={{ flex: 1 }}>
          <View style={styles.dateRow}>
            <IcMoon size={15} color={Colors.ink3} />
            <Text style={styles.dateText}>6월 14일 토요일 저녁</Text>
          </View>
          <Text style={styles.greeting}>오늘 하루,{'\n'}같이 정리해볼까요?</Text>
        </View>
        <View style={[styles.streakPill, Shadow.card]}>
          <IcFlame size={15} color={Colors.terra} />
          <Text style={styles.streakText}>12일</Text>
        </View>
      </View>

      {/* Record / Today Entry */}
      <View style={styles.section}>
        {!todayDone ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/convo')}
          >
            <LinearGradient
              colors={['#C5613A', '#B0512E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.recordCard}
            >
              <View style={styles.decorCircle1} />
              <View style={styles.decorCircle2} />
              <View style={styles.recordLabel}>
                <IcMic size={17} color="#fff" />
                <Text style={styles.recordLabelText}>음성으로 기록하기</Text>
              </View>
              <Text style={styles.recordTitle}>말만 해주세요. 코치가{'\n'}질문하며 같이 정리해요.</Text>
              <View style={styles.recordBtn}>
                <Text style={styles.recordBtnText}>대화 시작하기</Text>
                <IcChevR size={15} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.diaryCard, Shadow.card]}
            onPress={() => router.push('/diary-detail')}
          >
            <View style={styles.diaryCardTop}>
              <View style={styles.diaryPill}>
                <IcBook size={13} color={Colors.terraD} />
                <Text style={styles.diaryPillText}>오늘의 일기</Text>
              </View>
              <MoodArc arc={D.moodArc} />
            </View>
            <Text style={styles.diaryTitle}>{D.title}</Text>
            <Text style={styles.diaryBody} numberOfLines={2}>{D.body.split('\n')[0]}</Text>
            <View style={styles.diaryMore}>
              <Text style={styles.diaryMoreText}>일기와 인사이트 보기</Text>
              <IcChevR size={14} color={Colors.terra} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Todo Glance */}
      <View style={styles.section}>
        <SectionHead
          label="오늘의 할 일"
          right={`${doneCount}/${doneCount + openCount}`}
          onRight={() => router.push('/(tabs)/todo')}
        />
        <TouchableOpacity
          style={[styles.todoCard, Shadow.card]}
          activeOpacity={0.9}
          onPress={() => router.push('/(tabs)/todo')}
        >
          {todos.slice(0, 3).map(t => (
            <View key={t.id} style={styles.todoRow}>
              <View style={[styles.todoCheck, t.done && styles.todoCheckDone]}>
                {t.done && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.todoText, t.done && styles.todoTextDone]} numberOfLines={1}>
                {t.text}
              </Text>
              {t.from && (
                <View style={styles.convoPill}>
                  <Text style={styles.convoPillText}>대화</Text>
                </View>
              )}
            </View>
          ))}
        </TouchableOpacity>
      </View>

      {/* Recent */}
      <View style={styles.section}>
        <SectionHead label="지난 기록" right="회고 보기" onRight={() => router.push('/(tabs)/monthly')} />
        <View style={{ gap: 10 }}>
          {RECENT.map((r, i) => (
            <View key={i} style={[styles.recentCard, Shadow.card]}>
              <View style={styles.recentDate}>
                <Text style={styles.recentDay}>{r.d}</Text>
                <Text style={styles.recentDow}>{r.day}</Text>
              </View>
              <View style={styles.divider} />
              <View style={{ flex: 1 }}>
                <Text style={styles.recentTitle} numberOfLines={1}>{r.title}</Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 5 }}>
                  {r.cats.map(c => (
                    <Text key={c} style={styles.recentCat}>#{c}</Text>
                  ))}
                </View>
              </View>
              <MoodDot mood={r.mood} size={11} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: 22, paddingBottom: 8, flexDirection: 'row', alignItems: 'flex-start' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { color: Colors.ink3, fontSize: 13.5, fontWeight: '600' },
  greeting: { marginTop: 10, fontSize: 27, fontWeight: '600', lineHeight: 36, letterSpacing: -0.3,
    fontFamily: 'NotoSerifKR_600SemiBold', color: Colors.ink },
  streakPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.paper,
    borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  streakText: { color: Colors.terra, fontWeight: '700', fontSize: 14 },

  section: { paddingHorizontal: 18, marginTop: 18 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 },
  secLabel: { fontSize: 11.5, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.ink3 },
  sectionRight: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  sectionRightText: { color: Colors.ink2, fontSize: 13, fontWeight: '600' },

  recordCard: { borderRadius: Radius.lg, padding: 22, paddingBottom: 24, overflow: 'hidden' },
  decorCircle1: { position: 'absolute', right: -26, top: -26, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.10)' },
  decorCircle2: { position: 'absolute', right: 18, bottom: 14, width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,255,255,0.08)' },
  recordLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recordLabelText: { color: '#fff', fontSize: 13, fontWeight: '700', opacity: 0.92 },
  recordTitle: { color: '#fff', fontSize: 21, fontWeight: '600', marginTop: 12, lineHeight: 30, maxWidth: 230, fontFamily: 'NotoSerifKR_600SemiBold' },
  recordBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, alignSelf: 'flex-start' },
  recordBtnText: { color: '#fff', fontSize: 14.5, fontWeight: '700' },

  diaryCard: { backgroundColor: Colors.paper, borderRadius: Radius.md, padding: 18 },
  diaryCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 },
  diaryPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.terraSoft,
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  diaryPillText: { color: Colors.terraD, fontSize: 12, fontWeight: '600' },
  diaryTitle: { fontSize: 19, fontWeight: '600', lineHeight: 27, fontFamily: 'NotoSerifKR_600SemiBold', color: Colors.ink },
  diaryBody: { color: Colors.ink2, fontSize: 13.5, lineHeight: 22, marginTop: 8 },
  diaryMore: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 13 },
  diaryMoreText: { color: Colors.terra, fontSize: 13.5, fontWeight: '700' },

  todoCard: { backgroundColor: Colors.paper, borderRadius: Radius.md, padding: 15, gap: 11 },
  todoRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  todoCheck: { width: 19, height: 19, borderRadius: 6, borderWidth: 1.7, borderColor: Colors.line, alignItems: 'center', justifyContent: 'center' },
  todoCheckDone: { backgroundColor: Colors.sage, borderColor: Colors.sage },
  checkmark: { color: '#fff', fontSize: 11, fontWeight: '700' },
  todoText: { flex: 1, fontSize: 14.5, color: Colors.ink },
  todoTextDone: { color: Colors.ink3, textDecorationLine: 'line-through' },
  convoPill: { backgroundColor: Colors.goldSoft, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  convoPillText: { color: '#9A7420', fontSize: 10.5, fontWeight: '600' },

  recentCard: { backgroundColor: Colors.paper, borderRadius: Radius.md, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 13 },
  recentDate: { width: 40, alignItems: 'center' },
  recentDay: { fontSize: 20, fontWeight: '600', fontFamily: 'NotoSerifKR_600SemiBold', color: Colors.ink },
  recentDow: { fontSize: 11, color: Colors.ink3, marginTop: 2 },
  divider: { width: 1, height: 30, backgroundColor: Colors.line },
  recentTitle: { fontSize: 14, fontWeight: '600', color: Colors.ink },
  recentCat: { fontSize: 11.5, color: Colors.ink3, fontWeight: '600' },
});
