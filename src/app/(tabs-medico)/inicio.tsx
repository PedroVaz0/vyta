import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import MedicoConsultaCard from '../../components/medico-consulta-card';
import { HOJE, getConsultas, medico, type Consulta } from '../../data/medico';

const COLORS = {
  teal: '#007C94',
  tealLight: '#0EA5B7',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
};

type IconName = React.ComponentProps<typeof Feather>['name'];

export default function MedicoHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  // Recarrega sempre que a tela volta ao foco (ex.: depois de editar uma consulta)
  useFocusEffect(
    useCallback(() => {
      setConsultas([...getConsultas()]);
    }, [])
  );

  const consultasHoje = consultas
    .filter((c) => c.data === HOJE)
    .sort((a, b) => a.hora.localeCompare(b.hora));
  const emAberto = consultas.filter((c) => c.status === 'aberta');
  const proxima = consultasHoje.find((c) => c.status !== 'concluida');

  const atalhos: {
    id: string;
    label: string;
    icon: IconName;
    badge?: number;
    onPress: () => void;
  }[] = [
    {
      id: 'dia',
      label: 'Consultas do dia',
      icon: 'calendar',
      badge: consultasHoje.length,
      onPress: () => router.push('/agenda'),
    },
    {
      id: 'abertas',
      label: 'Consultas em aberto',
      icon: 'edit-3',
      badge: emAberto.length,
      onPress: () => router.push({ pathname: '/agenda', params: { filtro: 'abertas' } }),
    },
    {
      id: 'receitas',
      label: 'Prover receitas',
      icon: 'file-plus',
      onPress: () => router.push('/medico-nova-receita'),
    },
    {
      id: 'historico',
      label: 'Histórico dos pacientes',
      icon: 'clipboard',
      onPress: () => router.push('/pacientes'),
    },
  ];

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
        <View style={styles.brandRow}>
          <Image
            source={require('../../components/VytaLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandText}>vyta</Text>
        </View>

        <Pressable onPress={() => router.push('/notificacoes')}>
          <Feather name="bell" size={24} color={COLORS.teal} />
        </Pressable>
      </View>

      {/* Saudação */}
      <Text style={styles.greeting}>Olá, {medico.nome}</Text>
      <Text style={styles.subGreeting}>
        {consultasHoje.length === 0
          ? 'Você não tem consultas hoje.'
          : consultasHoje.length === 1
          ? 'Você tem 1 consulta hoje.'
          : `Você tem ${consultasHoje.length} consultas hoje.`}
      </Text>

      {/* Próxima consulta */}
      {proxima && (
        <Pressable
          style={styles.proximaCard}
          onPress={() =>
            router.push({ pathname: '/medico-paciente', params: { id: proxima.pacienteId } })
          }
        >
          <View style={styles.proximaIconCircle}>
            <Feather name="clock" size={18} color={COLORS.teal} />
          </View>

          <View style={styles.proximaTextWrapper}>
            <Text style={styles.proximaLabel}>Próximo paciente</Text>
            <Text style={styles.proximaHora}>Hoje - {proxima.hora}</Text>

            <Text style={styles.proximaInfo}>{proxima.paciente}</Text>
            <Text style={styles.proximaInfo}>{proxima.motivo}</Text>
          </View>

          <View style={styles.proximaArrowCircle}>
            <Feather name="chevron-right" size={18} color={COLORS.teal} />
          </View>
        </Pressable>
      )}

      {/* Atalhos */}
      <View style={styles.shortcutsGrid}>
        {atalhos.map((atalho) => (
          <Pressable key={atalho.id} style={styles.shortcutCard} onPress={atalho.onPress}>
            <View style={styles.shortcutTop}>
              <Feather name={atalho.icon} size={20} color={COLORS.orange} />
              {!!atalho.badge && (
                <View style={styles.shortcutBadge}>
                  <Text style={styles.shortcutBadgeText}>{atalho.badge}</Text>
                </View>
              )}
            </View>
            <View style={styles.shortcutLabelRow}>
              <Text style={styles.shortcutText}>{atalho.label}</Text>
              <Feather name="chevron-right" size={16} color={COLORS.teal} />
            </View>
          </Pressable>
        ))}
      </View>

      {/* Consultas de hoje */}
      <Pressable style={styles.sectionTitleRow} onPress={() => router.push('/agenda')}>
        <Text style={styles.sectionTitle}>Consultas de hoje</Text>
        <Feather name="chevron-right" size={18} color={COLORS.teal} />
      </Pressable>

      {consultasHoje.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma consulta marcada para hoje.</Text>
      ) : (
        consultasHoje.map((consulta) => (
          <MedicoConsultaCard
            key={consulta.id}
            consulta={consulta}
            onPress={() =>
              router.push({ pathname: '/medico-paciente', params: { id: consulta.pacienteId } })
            }
          />
        ))
      )}
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
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.orange,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.textGray,
    marginBottom: 20,
  },
  proximaCard: {
    backgroundColor: COLORS.teal,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  proximaIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  proximaTextWrapper: {
    flex: 1,
  },
  proximaLabel: {
    color: COLORS.white,
    fontSize: 13,
    marginBottom: 6,
  },
  proximaHora: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  proximaInfo: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  proximaArrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginLeft: 8,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 28,
  },
  shortcutCard: {
    width: '47.5%',
    flexGrow: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
  },
  shortcutTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shortcutBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  shortcutLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 6,
  },
  shortcutText: {
    flex: 1,
    color: COLORS.teal,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textGray,
  },
});