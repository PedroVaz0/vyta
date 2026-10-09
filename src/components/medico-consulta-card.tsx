import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Consulta, StatusConsulta } from '../data/medico';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
};

export const STATUS_INFO: Record<
  StatusConsulta,
  { label: string; color: string; bg: string }
> = {
  confirmada: { label: 'Confirmada', color: COLORS.teal, bg: '#D2EBF1' },
  aberta: { label: 'Em aberto', color: '#C2410C', bg: '#FFE4DA' },
  concluida: { label: 'Concluída', color: COLORS.textGray, bg: '#ECECEC' },
};

type Props = {
  consulta: Consulta;
  
  mostrarData?: boolean;

  acaoLabel?: string;
  onPress: () => void;
};

export default function MedicoConsultaCard({
  consulta,
  mostrarData,
  acaoLabel,
  onPress,
}: Props) {
  const status = STATUS_INFO[consulta.status];

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.timeBox}>
        <Text style={styles.timeText}>{consulta.hora}</Text>
        {mostrarData && <Text style={styles.dateText}>{consulta.data.slice(0, 5)}</Text>}
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.paciente} numberOfLines={1}>
          {consulta.paciente}
        </Text>
        <Text style={styles.motivo} numberOfLines={1}>
          {consulta.motivo}
        </Text>

        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      {acaoLabel ? (
        <View style={styles.actionButton}>
          <Feather name="edit-2" size={14} color={COLORS.white} />
          <Text style={styles.actionText}>{acaoLabel}</Text>
        </View>
      ) : (
        <View style={styles.arrowCircle}>
          <Feather name="chevron-right" size={18} color={COLORS.teal} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  timeBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  dateText: {
    color: COLORS.white,
    fontSize: 11,
    marginTop: 2,
  },
  textWrapper: {
    flex: 1,
  },
  paciente: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  motivo: {
    color: COLORS.textGray,
    fontSize: 12,
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.orange,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
});