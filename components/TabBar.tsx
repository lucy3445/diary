import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Shadow } from '../constants/Colors';
import { IcHome, IcCheck, IcMic, IcCal, IcBook } from './Icons';

const TABS = [
  { name: 'index',   label: '홈',    Icon: IcHome },
  { name: 'todo',    label: '할 일', Icon: IcCheck },
  { name: '__fab',   label: '',      Icon: null },
  { name: 'monthly', label: '회고',  Icon: IcCal },
  { name: 'diary',   label: '일기',  Icon: IcBook },
];

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const routeNames = state.routes.map(r => r.name);

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 8 }]}>
      <View style={[styles.pill, Shadow.pop]}>
        {TABS.map((tab, i) => {
          if (tab.name === '__fab') {
            return <View key="spacer" style={{ width: 66 }} />;
          }

          const routeIdx = routeNames.indexOf(tab.name);
          const active = state.index === routeIdx;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => {
                if (routeIdx !== -1) navigation.navigate(tab.name);
              }}
              activeOpacity={0.7}
            >
              <tab.Icon!
                size={23}
                color={active ? Colors.terra : Colors.ink3}
                strokeWidth={active ? 2.1 : 1.8}
              />
              <Text style={[styles.tabLabel, { color: active ? Colors.terra : Colors.ink3, fontWeight: active ? '700' : '600' }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Center FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/convo')}
          activeOpacity={0.85}
        >
          <IcMic size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingTop: 0,
    backgroundColor: 'transparent',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251,247,239,0.95)',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingTop: 9,
    paddingBottom: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10.5,
  },
  fab: {
    position: 'absolute',
    left: '50%',
    top: -20,
    marginLeft: -31,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Colors.terra,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.bg,
    ...Shadow.pop,
    shadowColor: Colors.terraD,
  },
});
