import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
  border: '#D9D9D9',
};

type Paciente = {
  id: string;
  nome: string;
  idade: number;
  ultimaConsulta: string;
};

// Dados de exemplo — troque pelos dados reais vindos da API quando estiver pronta.
const PACIENTES: Paciente[] = [
  { id: '1', nome: 'Maperi Julu', idade: 34, ultimaConsulta: '21/08/2026' },
  { id: '2', nome: 'João Pedro Alves', idade: 52, ultimaConsulta: '18/09/2026' },
  { id: '3', nome: 'Fernanda Costa', idade: 27, ultimaConsulta: '10/09/2026' },
  { id: '4', nome: 'Ricardo Mendes', idade: 61, ultimaConsulta: '02/09/2026' },
  { id: '5', nome: 'Beatriz Nogueira', idade: 45, ultimaConsulta: '25/08/2026' },
  { id: '6', nome: 'Carlos Eduardo', idade: 39, ultimaConsulta: '19/08/2026' },
];

function getIniciais(nome: string) {
  const partes = nome.trim().split(' ');
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export default function PacientesScreen() {
  const insets = useSafeAreaInsets();
  const [busca, setBusca] = useState('');

  const pacientesFiltrados = useMemo(() => {
    return PACIENTES.filter((p) =>
      p.nome.toLowerCase().includes(busca.trim().toLowerCase())
    );
  }, [busca]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Cabeçalho */}
      <Text style={styles.headerTitle}>Pacientes</Text>
      <Text style={styles.headerSubtitle}>
        {PACIENTES.length} paciente{PACIENTES.length !== 1 ? 's' : ''} sob seu
        cuidado
      </Text>

      {/* Busca */}
      <View style={styles.searchWrapper}>
        <Feather name="search" size={18} color={COLORS.textGray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar paciente..."
          placeholderTextColor={COLORS.textGray}
          value={busca}
          onChangeText={setBusca}
        />
        {busca.length > 0 && (
          <Pressable onPress={() => setBusca('')} hitSlop={8}>
            <Feather name="x" size={18} color={COLORS.textGray} />
          </Pressable>
        )}
      </View>

      {/* Lista de pacientes */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {pacientesFiltrados.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="users" size={36} color={COLORS.textGray} />
            <Text style={styles.emptyStateText}>
              Nenhum paciente encontrado para essa busca.
            </Text>
          </View>
        ) : (
          pacientesFiltrados.map((paciente) => (
            <Pressable key={paciente.id} style={styles.pacienteCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {getIniciais(paciente.nome)}
                </Text>
              </View>

              <View style={styles.pacienteTextWrapper}>
                <Text style={styles.pacienteNome}>{paciente.nome}</Text>
                <Text style={styles.pacienteInfo}>
                  {paciente.idade} anos · Última consulta:{' '}
                  {paciente.ultimaConsulta}
                </Text>
              </View>

              <Feather name="chevron-right" size={20} color={COLORS.textGray} />
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textGray,
    marginBottom: 16,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  list: {
    flex: 1,
  },
  pacienteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  pacienteTextWrapper: {
    flex: 1,
  },
  pacienteNome: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  pacienteInfo: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateText: {
    color: COLORS.textGray,
    fontSize: 14,
    textAlign: 'center',
  },
});
