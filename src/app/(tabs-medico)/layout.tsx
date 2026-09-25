import { Tabs } from 'expo-router';

import CustomTabBar from '@/components/custom-tab-bar';

const ICONS_MEDICO = {
  agenda: 'calendar' as const,
  pacientes: 'users' as const,
  perfil: 'user' as const,
};

const LABELS_MEDICO = {
  agenda: 'Agenda',
  pacientes: 'Pacientes',
  perfil: 'Perfil',
};

export default function TabsMedicoLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <CustomTabBar {...props} icons={ICONS_MEDICO} labels={LABELS_MEDICO} />
      )}
    >
      <Tabs.Screen name="agenda" />
      <Tabs.Screen name="pacientes" />
      <Tabs.Screen name="perfil" />
    </Tabs>
  );
}
