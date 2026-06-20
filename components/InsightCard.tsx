import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Shadow, Radius } from '../constants/Colors';
import { IcSpark, IcLeaf, IcTool } from './Icons';

type InsightType = 'learn' | 'keep' | 'fix';

const META: Record<InsightType, { label: string; color: string; Icon: React.FC<any> }> = {
  learn: { label: '오늘 배운 점', color: Colors.gold,  Icon: IcSpark },
  keep:  { label: '이어갈 점',   color: Colors.sage,  Icon: IcLeaf },
  fix:   { label: '고칠 점',     color: Colors.terra, Icon: IcTool },
};

export function InsightCard({ type, text }: { type: InsightType; text: string }) {
  const m = META[type];
  return (
    <View style={[styles.card, Shadow.card]}>
      <View style={[styles.icon, { backgroundColor: m.color + '26' }]}>
        <m.Icon size={18} color={m.color} />
      </View>
      <View style={styles.body}>
        <Text style={[styles.label, { color: m.color }]}>{m.label}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.paper,
    borderRadius: Radius.md,
    padding: 16,
    flexDirection: 'row',
    gap: 13,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: { flex: 1 },
  label: { fontSize: 12.5, fontWeight: '700', marginBottom: 4, letterSpacing: -0.1 },
  text:  { fontSize: 14.5, lineHeight: 22, color: Colors.ink },
});
