import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
};

// Ícone (Feather) para cada rota do menu
const ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  home: 'home',
  consultas: 'calendar',
  laudos: 'file-text',
  perfil: 'user',
};

// Rótulo exibido para cada rota do menu
const LABELS: Record<string, string> = {
  home: 'Início',
  consultas: 'Consultas',
  laudos: 'Laudos',
  perfil: 'Perfil',
};

type CustomTabBarProps = {
  state: any;
  navigation: any;
};

export default function CustomTabBar({ state, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const iconName = ICONS[route.name] ?? 'circle';
        const label = LABELS[route.name] ?? route.name;
        const color = isFocused ? COLORS.orange : COLORS.white;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tab}>
            <Feather name={iconName} size={20} color={color} />
            {isFocused && <View style={styles.indicator} />}
            <Text style={[styles.label, { color }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.teal,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  indicator: {
    marginTop: 4,
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.orange,
  },
  label: {
    fontSize: 11,
    marginTop: 4,
  },
});