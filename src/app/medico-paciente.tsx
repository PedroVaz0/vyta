import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { getPaciente, type ItemHistorico, type Paciente } from '../data/medico';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
};

type IconName = React.ComponentProps<typeof Feather>['name'];

const TIPO_INFO: Record<ItemHistorico['tipo'], { icon: IconName; color: string }> = {
  consulta: { icon: 'message-square', color: COLORS.teal },
  laudo: { icon: 'file-text', color: COLORS.teal },
  receita: { icon: 'edit-3', color: COLORS.orange },
};

export default function MedicoPacienteScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [paciente, setPaciente] = useState<Paciente | undefined>();

  // Recarrega ao voltar da tela de receita para mostrar o novo item no histórico
  useFocusEffect(
    useCallback(() => {
      const atual = getPaciente(id);
      setPaciente(atual ? { ...atual, historico: [...atual.historico] } : undefined);
    }, [id])
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} hitSlop={8} onPress={() => router.back()}>
            <Feather name="chevron-left" size={22} color={COLORS.teal} />
          </Pressable>
          <Text style={styles.headerTitle}>Histórico clínico</Text>
        </View>

        {!paciente ? (
          <Text style={styles.emptyText}>Paciente não encontrado.</Text>
        ) : (
          <>
            {/* Card do paciente */}
            <View style={styles.pacienteCard}>
              <View style={styles.avatar}>
                <Feather name="user" size={28} color={COLORS.white} />
              </View>
              <Text style={styles.nome}>{paciente.nome}</Text>
              <Text style={styles.info}>
                {paciente.idade} anos - Última consulta {paciente.ultimaConsulta}
              </Text>
            </View>

            {/* Ação principal */}
            <Pressable
              style={styles.receitaButton}
              onPress={() =>
                router.push({
                  pathname: '/medico-nova-receita',
                  params: { pacienteId: paciente.id },
                })
              }
            >
              <Feather name="file-plus" size={18} color={COLORS.white} />
              <Text style={styles.receitaButtonText}>Prescrever receita</Text>
            </Pressable>

            {/* Histórico */}
            <Text style={styles.sectionTitle}>Registros</Text>

            {paciente.historico.length === 0 && (
              <Text style={styles.emptyText}>Este paciente ainda não tem registros.</Text>
            )}

            {paciente.historico.map((item) => {
              const tipo = TIPO_INFO[item.tipo];
              return (
                <View key={item.id} style={styles.itemCard}>
                  <View style={[styles.itemIconCircle, { backgroundColor: tipo.color }]}>
                    <Feather name={tipo.icon} size={18} color={COLORS.white} />
                  </View>

                  <View style={styles.itemTextWrapper}>
                    <Text style={styles.itemTitulo}>{item.titulo}</Text>
                    <Text style={styles.itemDescricao}>{item.descricao}</Text>
                    <Text style={styles.itemData}>{item.data}</Text>
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
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
    gap: 12,
    marginBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  pacienteCard: {
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    paddingVertical: 24,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  info: {
    fontSize: 13,
    color: COLORS.textGray,
  },
  receitaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.orange,
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 28,
  },
  receitaButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
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
  itemCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  itemIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemTextWrapper: {
    flex: 1,
  },
  itemTitulo: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  itemDescricao: {
    color: COLORS.textGray,
    fontSize: 12,
    marginBottom: 6,
  },
  itemData: {
    color: COLORS.textGray,
    fontSize: 12,
  },
});