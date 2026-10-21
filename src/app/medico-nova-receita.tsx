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
import {
  HOJE,
  TIPOS_COM_NOTIFICACAO,
  TIPOS_RECEITA,
  adicionarDias,
  adicionarReceita,
  getConsultaPadrao,
  getConsultasDoPaciente,
  getPaciente,
  getPacientes,
  type TipoReceita,
} from '../data/medico';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
  danger: '#E03131',
};

const VALIDADES = [30, 60, 90];

type ItemForm = {
  key: string;
  medicamento: string;
  dosagem: string;
  quantidade: string;
  duracao: string;
};

let contadorItem = 0;
const novoItem = (): ItemForm => ({
  key: `item-${++contadorItem}`,
  medicamento: '',
  dosagem: '',
  quantidade: '',
  duracao: '',
});

const itemCompleto = (i: ItemForm) =>
  !!i.medicamento.trim() &&
  !!i.dosagem.trim() &&
  !!i.quantidade.trim() &&
  !!i.duracao.trim();

type CampoProps = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  erro?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric';
};

function Campo({ label, value, onChangeText, placeholder, erro, multiline, keyboardType }: CampoProps) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textGray}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : undefined}
        keyboardType={keyboardType}
      />
      {!!erro && <Text style={styles.errorText}>{erro}</Text>}
    </>
  );
}

export default function MedicoNovaReceitaScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { pacienteId } = useLocalSearchParams<{ pacienteId?: string }>();

  const pacienteFixo = getPaciente(pacienteId);
  const [selecionadoId, setSelecionadoId] = useState<string | undefined>(pacienteFixo?.id);
  const [consultaId, setConsultaId] = useState<string | undefined>(
    getConsultaPadrao(pacienteFixo?.id)
  );

  const [tipo, setTipo] = useState<TipoReceita>('simples');
  const [numeroNotificacao, setNumeroNotificacao] = useState('');
  const [validadeDias, setValidadeDias] = useState(30);
  const [itens, setItens] = useState<ItemForm[]>([novoItem()]);
  const [tentouEnviar, setTentouEnviar] = useState(false);

  const pacienteSelecionado = getPaciente(selecionadoId);
  const consultasDoPaciente = getConsultasDoPaciente(selecionadoId);
  const exigeNotificacao = TIPOS_COM_NOTIFICACAO.includes(tipo);

  const escolherPaciente = (id: string) => {
    setSelecionadoId(id);
    setConsultaId(getConsultaPadrao(id));
  };

  const atualizarItem = (key: string, campo: keyof ItemForm, valor: string) =>
    setItens((atual) => atual.map((i) => (i.key === key ? { ...i, [campo]: valor } : i)));

  const adicionarItem = () => setItens((atual) => [...atual, novoItem()]);
  const removerItem = (key: string) =>
    setItens((atual) => (atual.length > 1 ? atual.filter((i) => i.key !== key) : atual));

  const handleEmitir = () => {
    setTentouEnviar(true);

    if (!selecionadoId || !consultaId) return;
    if (exigeNotificacao && !numeroNotificacao.trim()) return;
    if (!itens.every(itemCompleto)) return;

    adicionarReceita({
      consultaId,
      tipo,
      numeroNotificacao: exigeNotificacao ? numeroNotificacao.trim() : undefined,
      validadeDias,
      itens: itens.map((i) => ({
        nomeMedicamento: i.medicamento.trim(),
        dosagem: i.dosagem.trim(),
        quantidade: i.quantidade.trim(),
        duracaoTratamento: i.duracao.trim(),
      })),
    });

    Alert.alert(
      'Receita emitida',
      `A receita com ${itens.length} ${itens.length === 1 ? 'medicamento' : 'medicamentos'} foi adicionada ao histórico de ${
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
                  onPress={() => escolherPaciente(p.id)}
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

        {/* Consulta vinculada (receita.consulta_id) */}
        {selecionadoId && (
          <>
            <Text style={styles.label}>Consulta</Text>
            {consultasDoPaciente.length === 0 ? (
              <Text style={styles.errorText}>
                Este paciente não tem consultas. A receita precisa estar vinculada a uma consulta.
              </Text>
            ) : (
              <View style={styles.chipsWrap}>
                {consultasDoPaciente.map((c) => {
                  const ativo = c.id === consultaId;
                  return (
                    <Pressable
                      key={c.id}
                      style={[styles.chip, ativo && styles.chipActive]}
                      onPress={() => setConsultaId(c.id)}
                    >
                      <Text style={[styles.chipText, ativo && styles.chipTextActive]}>
                        {c.data} - {c.hora}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </>
        )}
        {tentouEnviar && selecionadoId && !consultaId && (
          <Text style={styles.errorText}>Escolha a consulta da receita.</Text>
        )}

        {/* Tipo de receita */}
        <Text style={styles.label}>Tipo de receita</Text>
        <View style={styles.chipsWrap}>
          {TIPOS_RECEITA.map((t) => {
            const ativo = t.valor === tipo;
            return (
              <Pressable
                key={t.valor}
                style={[styles.chip, ativo && styles.chipActive]}
                onPress={() => setTipo(t.valor)}
              >
                <Text style={[styles.chipText, ativo && styles.chipTextActive]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {exigeNotificacao && (
          <Campo
            label="Número da notificação"
            value={numeroNotificacao}
            onChangeText={setNumeroNotificacao}
            placeholder="Número impresso no talonário"
            keyboardType="numeric"
            erro={
              tentouEnviar && !numeroNotificacao.trim()
                ? 'Informe o número da notificação.'
                : undefined
            }
          />
        )}

        {/* Validade (data_vencimento) */}
        <Text style={styles.label}>Validade</Text>
        <View style={styles.chipsWrap}>
          {VALIDADES.map((d) => {
            const ativo = d === validadeDias;
            return (
              <Pressable
                key={d}
                style={[styles.chip, ativo && styles.chipActive]}
                onPress={() => setValidadeDias(d)}
              >
                <Text style={[styles.chipText, ativo && styles.chipTextActive]}>{d} dias</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.helperText}>
          Emissão {HOJE} - vence em {adicionarDias(HOJE, validadeDias)}
        </Text>

        {/* Medicamentos (receita_item) */}
        {itens.map((item, index) => {
          const faltou = tentouEnviar;
          return (
            <View key={item.key} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>Medicamento {index + 1}</Text>
                {itens.length > 1 && (
                  <Pressable hitSlop={8} onPress={() => removerItem(item.key)}>
                    <Feather name="trash-2" size={18} color={COLORS.danger} />
                  </Pressable>
                )}
              </View>

              <Campo
                label="Medicamento"
                value={item.medicamento}
                onChangeText={(t) => atualizarItem(item.key, 'medicamento', t)}
                placeholder="Ex.: Amoxicilina"
                erro={faltou && !item.medicamento.trim() ? 'Informe o medicamento.' : undefined}
              />
              <Campo
                label="Dosagem e frequência"
                value={item.dosagem}
                onChangeText={(t) => atualizarItem(item.key, 'dosagem', t)}
                placeholder="Ex.: 500 mg, a cada 8 horas"
                erro={faltou && !item.dosagem.trim() ? 'Informe a dosagem.' : undefined}
              />
              <Campo
                label="Quantidade"
                value={item.quantidade}
                onChangeText={(t) => atualizarItem(item.key, 'quantidade', t)}
                placeholder="Ex.: 1 caixa com 21 comprimidos"
                erro={faltou && !item.quantidade.trim() ? 'Informe a quantidade.' : undefined}
              />
              <Campo
                label="Duração do tratamento"
                value={item.duracao}
                onChangeText={(t) => atualizarItem(item.key, 'duracao', t)}
                placeholder="Ex.: 7 dias"
                erro={
                  faltou && !item.duracao.trim() ? 'Informe a duração do tratamento.' : undefined
                }
              />
            </View>
          );
        })}

        <Pressable style={styles.addButton} onPress={adicionarItem}>
          <Feather name="plus" size={18} color={COLORS.teal} />
          <Text style={styles.addButtonText}>Adicionar medicamento</Text>
        </Pressable>

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
  helperText: {
    color: COLORS.textGray,
    fontSize: 12,
    marginTop: 8,
  },
  itemCard: {
    borderWidth: 1,
    borderColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 14,
    marginTop: 24,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.teal,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 16,
  },
  addButtonText: {
    color: COLORS.teal,
    fontSize: 14,
    fontWeight: '700',
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