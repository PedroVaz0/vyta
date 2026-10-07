import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getPacientes } from '../../data/medico';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
};

function iniciais(nome: string) {
  const partes = nome.trim().split(' ');
  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export default function PacientesMedicoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [busca, setBusca] = useState('');

  const pacientes = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return getPacientes().filter((p) => p.nome.toLowerCase().includes(termo));
  }, [busca]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.headerTitle}>Pacientes</Text>

      {/* Busca */}
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color={COLORS.textGray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar paciente pelo nome"
          placeholderTextColor={COLORS.textGray}
          value={busca}
          onChangeText={setBusca}
          autoCorrect={false}
        />
        {busca.length > 0 && (
          <Pressable hitSlop={8} onPress={() => setBusca('')}>
            <Feather name="x" size={18} color={COLORS.textGray} />
          </Pressable>
        )}
      </View>

      <Text style={styles.sectionTitle}>
        {pacientes.length} {pacientes.length === 1 ? 'paciente' : 'pacientes'}
      </Text>

      {pacientes.length === 0 && (
        <Text style={styles.emptyText}>Nenhum paciente encontrado com esse nome.</Text>
      )}

      {pacientes.map((paciente) => (
        <Pressable
          key={paciente.id}
          style={styles.pacienteCard}
          onPress={() =>
            router.push({ pathname: '/medico-paciente', params: { id: paciente.id } })
          }
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciais(paciente.nome)}</Text>
          </View>

          <View style={styles.textWrapper}>
            <Text style={styles.nome}>{paciente.nome}</Text>
            <Text style={styles.info}>{paciente.idade} anos</Text>
            <Text style={styles.info}>Última consulta: {paciente.ultimaConsulta}</Text>
          </View>

          <View style={styles.arrowCircle}>
            <Feather name="chevron-right" size={18} color={COLORS.teal} />
          </View>
        </Pressable>
      ))}
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    padding: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  pacienteCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  textWrapper: {
    flex: 1,
  },
  nome: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  info: {
    color: COLORS.textGray,
    fontSize: 12,
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
});