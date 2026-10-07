import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { atualizarConsulta, getConsulta, type StatusConsulta } from '../data/medico';
import { STATUS_INFO } from '../components/medico-consulta-card'

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
  danger: '#E03131',
};

const STATUS_OPCOES: StatusConsulta[] = ['aberta', 'confirmada', 'concluida'];

// Máscaras simples para digitação
const mascaraData = (v: string) => {
  const n = v.replace(/\D/g, '').slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return `${n.slice(0, 2)}/${n.slice(2)}`;
  return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`;
};

const mascaraHora = (v: string) => {
  const n = v.replace(/\D/g, '').slice(0, 4);
  if (n.length <= 2) return n;
  return `${n.slice(0, 2)}:${n.slice(2)}`;
};

export default function MedicoEditarConsultaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const consulta = getConsulta(id);

  const [data, setData] = useState(consulta?.data ?? '');
  const [hora, setHora] = useState(consulta?.hora ?? '');
  const [motivo, setMotivo] = useState(consulta?.motivo ?? '');
  const [status, setStatus] = useState<StatusConsulta>(consulta?.status ?? 'aberta');

  const dataValida = /^\d{2}\/\d{2}\/\d{4}$/.test(data);
  const horaValida = /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);

  const handleSalvar = () => {
    if (!consulta) return;

    if (!dataValida || !horaValida) {
      Alert.alert('Confira os dados', 'Use a data no formato DD/MM/AAAA e a hora como HH:MM.');
      return;
    }

    atualizarConsulta(consulta.id, { data, hora, motivo: motivo.trim(), status });

    Alert.alert('Consulta atualizada', 'As alterações foram salvas.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleCancelarConsulta = () => {
    Alert.alert('Cancelar consulta', 'Deseja realmente cancelar esta consulta?', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar consulta',
        style: 'destructive',
        onPress: () => {
          // TODO: quando houver backend, remova/cancele a consulta pela API.
          router.back();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} hitSlop={8} onPress={() => router.back()}>
            <Feather name="chevron-left" size={22} color={COLORS.teal} />
          </Pressable>
          <Text style={styles.headerTitle}>Editar consulta</Text>
        </View>

        {!consulta ? (
          <Text style={styles.emptyText}>Consulta não encontrada.</Text>
        ) : (
          <>
            <View style={styles.pacienteBox}>
              <Feather name="user" size={18} color={COLORS.teal} />
              <Text style={styles.pacienteText}>{consulta.paciente}</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Text style={styles.label}>Data</Text>
                <TextInput
                  style={styles.input}
                  value={data}
                  onChangeText={(v) => setData(mascaraData(v))}
                  keyboardType="number-pad"
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor={COLORS.textGray}
                />
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.label}>Hora</Text>
                <TextInput
                  style={styles.input}
                  value={hora}
                  onChangeText={(v) => setHora(mascaraHora(v))}
                  keyboardType="number-pad"
                  placeholder="HH:MM"
                  placeholderTextColor={COLORS.textGray}
                />
              </View>
            </View>

            <Text style={styles.label}>Motivo da consulta</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={motivo}
              onChangeText={setMotivo}
              multiline
              textAlignVertical="top"
              placeholder="Descreva o motivo"
              placeholderTextColor={COLORS.textGray}
            />

            <Text style={styles.label}>Situação</Text>
            <View style={styles.chipsRow}>
              {STATUS_OPCOES.map((opcao) => {
                const ativo = opcao === status;
                return (
                  <Pressable
                    key={opcao}
                    style={[styles.chip, ativo && styles.chipActive]}
                    onPress={() => setStatus(opcao)}
                  >
                    <Text style={[styles.chipText, ativo && styles.chipTextActive]}>
                      {STATUS_INFO[opcao].label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable style={styles.saveButton} onPress={handleSalvar}>
              <Feather name="check" size={18} color={COLORS.white} />
              <Text style={styles.saveText}>Salvar alterações</Text>
            </Pressable>

            <Pressable style={styles.cancelButton} onPress={handleCancelarConsulta}>
              <Feather name="x-circle" size={18} color={COLORS.danger} />
              <Text style={styles.cancelText}>Cancelar consulta</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 24,
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
  emptyText: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  pacienteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
  },
  pacienteText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.teal,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  rowItem: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: COLORS.textDark,
  },
  inputMultiline: {
    minHeight: 90,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipActive: {
    backgroundColor: COLORS.teal,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.teal,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.orange,
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 28,
  },
  saveText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.danger,
    marginTop: 14,
  },
  cancelText: {
    color: COLORS.danger,
    fontSize: 15,
    fontWeight: '700',
  },
});