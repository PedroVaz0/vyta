import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  teal: '#007C94',
  white: '#FFFFFF',
  textGray: '#6B6B6B',
};

type IconName = React.ComponentProps<typeof Feather>['name'];

const renderIcon =
  (name: IconName) =>
  ({ color, size }: { color: ColorValue; size: number }) =>
    <Feather name={name} size={size} color={color as string} />;

export default function MedicoTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.teal,
        tabBarInactiveTintColor: COLORS.textGray,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: '#EDEDED',
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom + 6,
        },
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{ title: 'Início', tabBarIcon: renderIcon('home') }}
      />
      <Tabs.Screen
        name="agenda"
        options={{ title: 'Agenda', tabBarIcon: renderIcon('calendar') }}
      />
      <Tabs.Screen
        name="pacientes"
        options={{ title: 'Pacientes', tabBarIcon: renderIcon('users') }}
      />
      <Tabs.Screen
        name="perfil-medico"
        options={{ title: 'Perfil', tabBarIcon: renderIcon('user') }}
      />
    </Tabs>
  );
}