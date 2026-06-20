import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EMO, MoodKey } from '../constants/Data';
import { Colors } from '../constants/Colors';
import { IcChevR } from './Icons';

export function MoodDot({ mood, size = 12 }: { mood: MoodKey; size?: number }) {
  const e = EMO[mood];
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: e?.color ?? Colors.ink3 }} />
  );
}

export function MoodChip({ mood }: { mood: MoodKey }) {
  const e = EMO[mood];
  if (!e) return null;
  return (
    <View style={[styles.chip, { backgroundColor: e.color + '28' }]}>
      <MoodDot mood={mood} size={8} />
      <Text style={[styles.chipText, { color: e.color }]}>{e.label}</Text>
    </View>
  );
}

export function MoodArc({ arc }: { arc: MoodKey[] }) {
  return (
    <View style={styles.arc}>
      {arc.map((m, i) => (
        <React.Fragment key={i}>
          <MoodChip mood={m} />
          {i < arc.length - 1 && (
            <IcChevR size={13} color={Colors.ink3} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  arc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
});
