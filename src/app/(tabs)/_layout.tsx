import { Tabs } from 'expo-router';

import CustomTabBar from '@/components/custom-tab-bar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="consultas" />
      <Tabs.Screen name="laudos" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}