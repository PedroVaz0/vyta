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
import { adicionarReceita, getPaciente, getPacientes } from '../data/medico';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
  danger: '#E03131',
};

export default function MedicoNovaReceitaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { pacienteId } = useLocalSearchParams<{ pacienteId?: string }>();


  const pacienteFixo = getPaciente(pacienteId);
  const [selecionadoId, setSelecionadoId] = useState<string | undefined>(pacienteFixo?.id);

  const [medicamento, setMedicamento] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [instrucoes, setInstrucoes] = useState('');
  const [tentouEnviar, setTentouEnviar] = useState(false);

  const pacienteSelecionado = getPaciente(selecionadoId);

  const handleEmitir = () => {
    setTentouEnviar(true);

    if (!selecionadoId || !medicamento.trim() || !dosagem.trim()) return;

    adicionarReceita(selecionadoId, {
      medicamento: medicamento.trim(),
      dosagem: dosagem.trim(),
      instrucoes: instrucoes.trim(),
    });

    Alert.alert(
      'Receita emitida',
      `A receita de ${medicamento.trim()} foi adicionada ao histórico de ${
        pacienteSelecionado?.nome ?? 'paciente'
      }.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
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
          <Text style={styles.headerTitle}>Nova receita</Text>
        </View>

        {/* Paciente */}
        <Text style={styles.label}>Paciente</Text>
        {pacienteFixo ? (
          <View style={styles.pacienteFixo}>
            <Feather name="user" size={18} color={COLORS.teal} />
            <Text style={styles.pacienteFixoText}>{pacienteFixo.nome}</Text>
          </View>
        ) : (
          <View style={styles.chipsWrap}>
            {getPacientes().map((p) => {
              const ativo = p.id === selecionadoId;
              return (
                <Pressable
                  key={p.id}
                  style={[styles.chip, ativo && styles.chipActive]}
                  onPress={() => setSelecionadoId(p.id)}
                >
                  <Text style={[styles.chipText, ativo && styles.chipTextActive]}>{p.nome}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
        {tentouEnviar && !selecionadoId && (
          <Text style={styles.errorText}>Escolha um paciente.</Text>
        )}

        {/* Campos */}
        <Text style={styles.label}>Medicamento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Amoxicilina"
          placeholderTextColor={COLORS.textGray}
          value={medicamento}
          onChangeText={setMedicamento}
        />
        {tentouEnviar && !medicamento.trim() && (
          <Text style={styles.errorText}>Informe o medicamento.</Text>
        )}

        <Text style={styles.label}>Dosagem e frequência</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: 500 mg, a cada 8 horas"
          placeholderTextColor={COLORS.textGray}
          value={dosagem}
          onChangeText={setDosagem}
        />
        {tentouEnviar && !dosagem.trim() && (
          <Text style={styles.errorText}>Informe a dosagem.</Text>
        )}

        <Text style={styles.label}>Instruções ao paciente (opcional)</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Ex.: Tomar após as refeições, por 7 dias"
          placeholderTextColor={COLORS.textGray}
          value={instrucoes}
          onChangeText={setInstrucoes}
          multiline
          textAlignVertical="top"
        />

        <Pressable style={styles.submitButton} onPress={handleEmitir}>
          <Feather name="check" size={18} color={COLORS.white} />
          <Text style={styles.submitText}>Emitir receita</Text>
        </Pressable>
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
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
    marginTop: 16,
  },
  pacienteFixo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
  },
  pacienteFixoText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.teal,
  },
  chipsWrap: {
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
  input: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    color: COLORS.textDark,
  },
  inputMultiline: {
    minHeight: 100,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 6,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.orange,
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 28,
  },
  submitText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});