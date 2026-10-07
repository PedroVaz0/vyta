import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import MedicoConsultaCard from '../../components/medico-consulta-card';
import { HOJE, getConsultas, type Consulta } from '../../data/medico';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
};

type Filtro = 'hoje' | 'abertas';

export default function AgendaMedicoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ filtro?: string }>();

  const [filtro, setFiltro] = useState<Filtro>('hoje');
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  // Permite abrir a agenda já no filtro "Em aberto" (atalho da home)
  useEffect(() => {
    if (params.filtro === 'abertas') setFiltro('abertas');
    else if (params.filtro === 'hoje') setFiltro('hoje');
  }, [params.filtro]);

  useFocusEffect(
    useCallback(() => {
      setConsultas([...getConsultas()]);
    }, [])
  );

  const hoje = consultas
    .filter((c) => c.data === HOJE)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const abertas = consultas
    .filter((c) => c.status === 'aberta')
    .sort((a, b) => {
      const [da, ma, aa] = a.data.split('/');
      const [db, mb, ab] = b.data.split('/');
      return `${aa}${ma}${da}${a.hora}`.localeCompare(`${ab}${mb}${db}${b.hora}`);
    });

  const lista = filtro === 'hoje' ? hoje : abertas;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.headerTitle}>Agenda</Text>

      {/* Filtros */}
      <View style={styles.filtersRow}>
        <Pressable
          style={[styles.filterChip, filtro === 'hoje' && styles.filterChipActive]}
          onPress={() => setFiltro('hoje')}
        >
          <Feather
            name="calendar"
            size={16}
            color={filtro === 'hoje' ? COLORS.white : COLORS.teal}
          />
          <Text style={[styles.filterText, filtro === 'hoje' && styles.filterTextActive]}>
            Hoje ({hoje.length})
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filterChip, filtro === 'abertas' && styles.filterChipActive]}
          onPress={() => setFiltro('abertas')}
        >
          <Feather
            name="edit-3"
            size={16}
            color={filtro === 'abertas' ? COLORS.white : COLORS.teal}
          />
          <Text style={[styles.filterText, filtro === 'abertas' && styles.filterTextActive]}>
            Em aberto ({abertas.length})
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>
        {filtro === 'hoje' ? `Consultas de hoje - ${HOJE.slice(0, 5)}` : 'Consultas para editar'}
      </Text>

      {lista.length === 0 ? (
        <View style={styles.emptyBox}>
          <Feather name="check-circle" size={28} color={COLORS.teal} />
          <Text style={styles.emptyText}>
            {filtro === 'hoje'
              ? 'Nenhuma consulta marcada para hoje.'
              : 'Nenhuma consulta em aberto. Tudo em dia!'}
          </Text>
        </View>
      ) : (
        lista.map((consulta) =>
          filtro === 'abertas' ? (
            <MedicoConsultaCard
              key={consulta.id}
              consulta={consulta}
              mostrarData
              acaoLabel="Editar"
              onPress={() =>
                router.push({ pathname: '/medico-editar-consulta', params: { id: consulta.id } })
              }
            />
          ) : (
            <MedicoConsultaCard
              key={consulta.id}
              consulta={consulta}
              onPress={() =>
                router.push({ pathname: '/medico-paciente', params: { id: consulta.pacienteId } })
              }
            />
          )
        )
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 20,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  filterChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: COLORS.cardBg,
  },
  filterChipActive: {
    backgroundColor: COLORS.teal,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.teal,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  emptyBox: {
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textGray,
    textAlign: 'center',
  },
});