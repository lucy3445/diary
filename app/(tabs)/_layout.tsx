import { Tabs } from 'expo-router';
import TabBar from '../../components/TabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"   options={{ title: '홈' }} />
      <Tabs.Screen name="todo"    options={{ title: '할 일' }} />
      <Tabs.Screen name="monthly" options={{ title: '회고' }} />
      <Tabs.Screen name="diary"   options={{ title: '일기' }} />
    </Tabs>
  );
}
