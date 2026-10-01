import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  teal: '#007C94',
  tealLight: '#0EA5B7',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
  danger: '#E03131',
};

type IconName = React.ComponentProps<typeof Feather>['name'];

type Preferencia = {
  id: string;
  label: string;
  descricao: string;
  icon: IconName;
};

const tiposDeAviso: Preferencia[] = [
  {
    id: 'consultas',
    label: 'Lembretes de consulta',
    descricao: 'Aviso antes das suas consultas agendadas',
    icon: 'calendar',
  },
  {
    id: 'laudos',
    label: 'Novos laudos',
    descricao: 'Quando um resultado de exame estiver disponível',
    icon: 'file-text',
  },
  {
    id: 'medicamentos',
    label: 'Lembretes de medicamentos',
    descricao: 'Horários dos seus medicamentos',
    icon: 'clock',
  },
  {
    id: 'dicas',
    label: 'Dicas de saúde',
    descricao: 'Conteúdos para cuidar do seu bem-estar',
    icon: 'heart',
  },
];

const canais: Preferencia[] = [
  {
    id: 'push',
    label: 'Notificações push',
    descricao: 'Alertas no seu celular',
    icon: 'smartphone',
  },
  {
    id: 'email',
    label: 'E-mail',
    descricao: 'Resumos e avisos no seu e-mail',
    icon: 'mail',
  },
];

export default function NotificacoesConfigScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [ativas, setAtivas] = useState<Record<string, boolean>>({
    consultas: true,
    laudos: true,
    medicamentos: true,
    dicas: false,
    push: true,
    email: false,
  });

  const alternar = (id: string) => {
    // TODO: salvar a preferência na API.
    setAtivas((atual) => ({ ...atual, [id]: !atual[id] }));
  };

  const renderLinha = (item: Preferencia, ultimo: boolean) => (
    <View key={item.id} style={[styles.row, ultimo && styles.rowLast]}>
      <View style={styles.iconCircle}>
        <Feather name={item.icon} size={18} color={COLORS.teal} />
      </View>

      <View style={styles.rowTextWrapper}>
        <Text style={styles.rowLabel}>{item.label}</Text>
        <Text style={styles.rowDescricao}>{item.descricao}</Text>
      </View>

      <Switch
        value={ativas[item.id]}
        onValueChange={() => alternar(item.id)}
        trackColor={{ false: '#D5DDE0', true: COLORS.tealLight }}
        thumbColor={COLORS.white}
        ios_backgroundColor="#D5DDE0"
      />
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={22} color={COLORS.teal} />
        </Pressable>
        <Text style={styles.headerTitle}>Notificações</Text>
      </View>

      <Text style={styles.intro}>
        Escolha o que você quer receber e por onde.
      </Text>

      {/* Tipos de aviso */}
      <Text style={styles.sectionTitle}>O que avisar</Text>
      <View style={styles.card}>
        {tiposDeAviso.map((item, i) =>
          renderLinha(item, i === tiposDeAviso.length - 1)
        )}
      </View>

      {/* Canais */}
      <Text style={styles.sectionTitle}>Como avisar</Text>
      <View style={styles.card}>
        {canais.map((item, i) => renderLinha(item, i === canais.length - 1))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  intro: {
    fontSize: 14,
    color: COLORS.textGray,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    paddingHorizontal: 14,
    marginBottom: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#D3E8EE',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTextWrapper: {
    flex: 1,
    marginRight: 10,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  rowDescricao: {
    fontSize: 12,
    color: COLORS.textGray,
  },
});
