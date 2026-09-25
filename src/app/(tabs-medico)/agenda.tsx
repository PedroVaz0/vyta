import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
  successBg: '#E4F7EC',
  successText: '#1E8E4F',
  pendingBg: '#E9F6FA',
  pendingText: '#007C94',
};

type StatusAtendimento = 'aguardando' | 'em_andamento' | 'concluido';

type Atendimento = {
  id: string;
  paciente: string;
  horario: string;
  motivo: string;
  status: StatusAtendimento;
};

// Dados de exemplo — troque pelos dados reais vindos da API quando estiver pronta.
const ATENDIMENTOS_HOJE: Atendimento[] = [
  {
    id: '1',
    paciente: 'Maperi Julu',
    horario: '09:00',
    motivo: 'Consulta de rotina',
    status: 'concluido',
  },
  {
    id: '2',
    paciente: 'João Pedro Alves',
    horario: '10:30',
    motivo: 'Retorno - Hipertensão',
    status: 'em_andamento',
  },
  {
    id: '3',
    paciente: 'Fernanda Costa',
    horario: '11:15',
    motivo: 'Primeira consulta',
    status: 'aguardando',
  },
  {
    id: '4',
    paciente: 'Ricardo Mendes',
    horario: '14:00',
    motivo: 'Avaliação de exames',
    status: 'aguardando',
  },
];

const STATUS_LABEL: Record<StatusAtendimento, string> = {
  aguardando: 'Aguardando',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
};

export default function AgendaScreen() {
  const insets = useSafeAreaInsets();
  const nomeMedico = 'Dr. Riquelme Santos'; // troque pelo nome do médico logado

  const proximosCount = useMemo(
    () => ATENDIMENTOS_HOJE.filter((a) => a.status !== 'concluido').length,
    []
  );

  const badgeStyle = (status: StatusAtendimento) => {
    switch (status) {
      case 'aguardando':
        return { bg: styles.badgePendingBg, text: styles.badgePendingText };
      case 'em_andamento':
        return { bg: styles.badgeOrangeBg, text: styles.badgeOrangeText };
      case 'concluido':
        return { bg: styles.badgeSuccessBg, text: styles.badgeSuccessText };
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Saudação */}
      <Text style={styles.greeting}>Olá, {nomeMedico}</Text>
      <Text style={styles.subGreeting}>
        Você tem {proximosCount} atendimento{proximosCount !== 1 ? 's' : ''}{' '}
        hoje
      </Text>

      {/* Resumo do dia */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{ATENDIMENTOS_HOJE.length}</Text>
          <Text style={styles.summaryLabel}>Hoje</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {ATENDIMENTOS_HOJE.filter((a) => a.status === 'concluido').length}
          </Text>
          <Text style={styles.summaryLabel}>Concluídos</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{proximosCount}</Text>
          <Text style={styles.summaryLabel}>Restantes</Text>
        </View>
      </View>

      {/* Lista de atendimentos */}
      <Text style={styles.sectionTitle}>Atendimentos de hoje</Text>

      {ATENDIMENTOS_HOJE.map((atendimento) => {
        const badge = badgeStyle(atendimento.status);
        return (
          <View key={atendimento.id} style={styles.atendimentoCard}>
            <View style={styles.horarioColumn}>
              <Text style={styles.horarioText}>{atendimento.horario}</Text>
            </View>

            <View style={styles.atendimentoDivider} />

            <View style={styles.atendimentoTextWrapper}>
              <Text style={styles.pacienteNome}>{atendimento.paciente}</Text>
              <Text style={styles.motivo}>{atendimento.motivo}</Text>
            </View>

            <View style={[styles.statusBadge, badge.bg]}>
              <Text style={[styles.statusBadgeText, badge.text]}>
                {STATUS_LABEL[atendimento.status]}
              </Text>
            </View>
          </View>
        );
      })}
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
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.textGray,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.teal,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  atendimentoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  horarioColumn: {
    width: 48,
    alignItems: 'center',
  },
  horarioText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.teal,
  },
  atendimentoDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#D3E9EF',
    marginHorizontal: 12,
  },
  atendimentoTextWrapper: {
    flex: 1,
  },
  pacienteNome: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  motivo: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgePendingBg: {
    backgroundColor: COLORS.pendingBg,
  },
  badgePendingText: {
    color: COLORS.pendingText,
  },
  badgeOrangeBg: {
    backgroundColor: '#FFF0EA',
  },
  badgeOrangeText: {
    color: COLORS.orange,
  },
  badgeSuccessBg: {
    backgroundColor: COLORS.successBg,
  },
  badgeSuccessText: {
    color: COLORS.successText,
  },
});
