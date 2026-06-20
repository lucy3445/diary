import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Shadow, Radius } from '../../constants/Colors';
import { EMO, MONTH_DAYS, MONTH_EMO_DIST, MONTH_CATS, MONTH_KEYWORDS } from '../../constants/Data';
import { IcChevL, IcChevR, IcSpark } from '../../components/Icons';

function SectionHead({ label }: { label: string }) {
  return <Text style={styles.secLabel}>{label}</Text>;
}

export default function MonthlyScreen() {
  const insets = useSafeAreaInsets();
  const maxN = Math.max(...MONTH_EMO_DIST.map(d => d.n));
  const recorded = MONTH_DAYS.filter(d => d.mood).length;
  const wordSizes = [22, 16, 19, 15, 18, 15];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 22, paddingBottom: 6 }}>
        <Text style={styles.secLabelTop}>월별 회고</Text>
        <View style={styles.monthRow}>
          <IcChevL size={20} color={Colors.ink3} />
          <Text style={styles.monthTitle}>2026 · 6월</Text>
          <IcChevR size={20} color={Colors.ink3} />
        </View>
        <Text style={styles.recordedText}>
          이번 달 <Text style={{ color: Colors.terra, fontWeight: '700' }}>{recorded}일</Text> 기록했어요. 꾸준함이 쌓이고 있어요.
        </Text>
      </View>

      {/* Calendar */}
      <View style={styles.section}>
        <View style={[styles.card, Shadow.card, { padding: 18 }]}>
          {/* Day headers */}
          <View style={styles.calGrid}>
            {['월','화','수','목','금','토','일'].map(d => (
              <View key={d} style={styles.calCell}>
                <Text style={styles.calDayLabel}>{d}</Text>
              </View>
            ))}
          </View>
          {/* Days */}
          <View style={styles.calGrid}>
            <View style={styles.calCell} />
            {MONTH_DAYS.map(d => {
              const e = d.mood ? EMO[d.mood] : null;
              const today = d.day === 14;
              return (
                <View key={d.day} style={[styles.calCell, styles.calDay,
                  { backgroundColor: e ? e.color + '33' : Colors.paper2 },
                  today && styles.calToday
                ]}>
                  <Text style={[styles.calDayNum, today && { fontWeight: '700' },
                    { color: e ? e.color : Colors.ink3 }]}>{d.day}</Text>
                  {e && <View style={[styles.calDot, { backgroundColor: e.color }]} />}
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Emotion Distribution */}
      <View style={styles.section}>
        <SectionHead label="이번 달 감정 분포" />
        <View style={[styles.card, Shadow.card, { padding: 18 }]}>
          {MONTH_EMO_DIST.map(d => {
            const e = EMO[d.key];
            return (
              <View key={d.key} style={styles.distRow}>
                <Text style={styles.distLabel}>{e.label}</Text>
                <View style={styles.distBar}>
                  <View style={[styles.distFill, { width: `${(d.n / maxN) * 100}%` as any, backgroundColor: e.color }]} />
                </View>
                <Text style={styles.distCount}>{d.n}일</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Category insights */}
      <View style={styles.section}>
        <SectionHead label="카테고리별 흐름" />
        <View style={{ gap: 11 }}>
          {MONTH_CATS.map((c, i) => (
            <View key={i} style={[styles.card, Shadow.card, { padding: 17 }]}>
              <View style={styles.catHeader}>
                <View style={styles.catLeft}>
                  <View style={[styles.catDot, { backgroundColor: c.color }]} />
                  <Text style={styles.catName}>{c.name}</Text>
                </View>
                <Text style={styles.catCount}>{c.n}개 기록</Text>
              </View>
              <View style={styles.catInsight}>
                <IcSpark size={15} color={c.color} />
                <Text style={styles.catInsightText}>{c.insight}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Keywords */}
      <View style={styles.section}>
        <SectionHead label="이번 달의 단어들" />
        <View style={[styles.card, Shadow.card, { padding: 18 }]}>
          <View style={styles.keywords}>
            {MONTH_KEYWORDS.map((k, i) => (
              <Text key={k} style={[styles.keyword, {
                fontSize: wordSizes[i % wordSizes.length],
                color: Colors.terra,
                opacity: 0.4 + (i % 3) * 0.25,
              }]}>{k}</Text>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  secLabelTop: { fontSize: 11.5, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.ink3 },
  monthRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  monthTitle: { fontSize: 28, fontWeight: '600', fontFamily: 'NotoSerifKR_600SemiBold', color: Colors.ink },
  recordedText: { color: Colors.ink2, fontSize: 13.5, marginTop: 6 },
  section: { paddingHorizontal: 18, marginTop: 22 },
  secLabel: { fontSize: 11.5, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.ink3, marginBottom: 11 },
  card: { backgroundColor: Colors.paper, borderRadius: Radius.md },

  calGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  calCell: { width: '12%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  calDayLabel: { fontSize: 11, fontWeight: '600', color: Colors.ink3 },
  calDay: { borderRadius: 10, position: 'relative', borderWidth: 1, borderColor: 'transparent' },
  calToday: { borderColor: Colors.terra, borderWidth: 2 },
  calDayNum: { fontSize: 12, fontWeight: '600' },
  calDot: { position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 2 },

  distRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  distLabel: { width: 42, fontSize: 13, fontWeight: '600', color: Colors.ink2 },
  distBar: { flex: 1, height: 10, borderRadius: 6, backgroundColor: Colors.paper2, overflow: 'hidden' },
  distFill: { height: '100%', borderRadius: 6 },
  distCount: { width: 28, textAlign: 'right', fontSize: 12.5, fontWeight: '600', color: Colors.ink3 },

  catHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 },
  catLeft: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  catDot: { width: 10, height: 10, borderRadius: 3 },
  catName: { fontSize: 15, fontWeight: '700', color: Colors.ink },
  catCount: { fontSize: 12.5, color: Colors.ink3, fontWeight: '600' },
  catInsight: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  catInsightText: { flex: 1, fontSize: 13.5, lineHeight: 22, color: Colors.ink },

  keywords: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  keyword: { fontFamily: 'NotoSerifKR_600SemiBold', fontWeight: '600' },
});
