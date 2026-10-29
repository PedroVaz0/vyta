import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setSessao } from '../lib/sessao';
import { MODO_MOCK, cadastrar } from '../services/api';
import {
  FORM_INICIAL,
  IDENTIDADES_GENERO,
  SEXOS_BIOLOGICOS,
  TIPOS_SANGUINEOS,
  mascaraCep,
  mascaraCpf,
  mascaraData,
  mascaraTelefone,
  montarPayload,
  validarEtapa,
  type CadastroForm,
  type Erros,
  type Perfil,
} from '../data/cadastro-form';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  gray: '#9AA0A6',
  border: '#D9D9D9',
  danger: '#E03131',
  cardBg: '#E9F6FA',
};

type CampoProps = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  erro?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  maxLength?: number;
};

function Campo({ label, erro, ...props }: CampoProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !!erro && styles.inputErro]}
        placeholderTextColor={COLORS.gray}
        {...props}
      />
      {!!erro && <Text style={styles.errorText}>{erro}</Text>}
    </View>
  );
}

type SenhaCampoProps = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  erro?: string;
};

function SenhaCampo({ label, value, onChangeText, erro }: SenhaCampoProps) {
  const [visivel, setVisivel] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.passwordWrapper, !!erro && styles.inputErro]}>
        <TextInput
          style={styles.passwordInput}
          placeholderTextColor={COLORS.gray}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visivel}
          autoCapitalize="none"
        />
        <Pressable onPress={() => setVisivel((v) => !v)} style={styles.eyeButton} hitSlop={10}>
          <MaterialCommunityIcons
            name={visivel ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={COLORS.gray}
          />
        </Pressable>
      </View>
      {!!erro && <Text style={styles.errorText}>{erro}</Text>}
    </View>
  );
}

type OpcoesProps = {
  label: string;
  opcoes: string[];
  valor: string;
  onChange: (v: string) => void;
  erro?: string;
  desmarcavel?: boolean;
};

function Opcoes({ label, opcoes, valor, onChange, erro, desmarcavel }: OpcoesProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipsWrap}>
        {opcoes.map((o) => {
          const ativo = o === valor;
          return (
            <Pressable
              key={o}
              style={[styles.chip, ativo && styles.chipActive]}
              onPress={() => onChange(ativo && desmarcavel ? '' : o)}
            >
              <Text style={[styles.chipText, ativo && styles.chipTextActive]}>{o}</Text>
            </Pressable>
          );
        })}
      </View>
      {!!erro && <Text style={styles.errorText}>{erro}</Text>}
    </View>
  );
}

export default function CadastroScreen() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  const perfil: Perfil = role === 'medico' ? 'medico' : 'paciente';
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // CORREÇÃO AQUI: Tipagem alterada para 'any' para evitar conflitos com o scrollTo
  const scrollRef = useRef<any>(null);

  const [etapa, setEtapa] = useState(0);
  const [form, setForm] = useState<CadastroForm>(FORM_INICIAL);
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);

  const ETAPAS = [
    'Dados pessoais',
    perfil === 'medico' ? 'Dados profissionais' : 'Saúde e emergência',
    'Endereço (opcional)',
  ];
  const ultima = etapa === ETAPAS.length - 1;

  const set = (campo: keyof CadastroForm) => (valor: string) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  };

  const irParaEtapa = (n: number) => {
    setEtapa(n);
    setErros({});
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const handleContinuar = async () => {
    const e = validarEtapa(etapa, form, perfil);
    if (Object.keys(e).length > 0) {
      setErros(e);
      return;
    }
    if (!ultima) {
      irParaEtapa(etapa + 1);
      return;
    }

    const payload = montarPayload(perfil, form);

    try {
      setEnviando(true);

      if (MODO_MOCK) {
        setSessao({ usuarioId: 'mock', tipo: perfil, nome: form.nome.trim() });
      } else {
        setSessao(await cadastrar(payload));
      }

      if (perfil === 'medico') {
        router.replace('/agenda');
      } else {
        router.replace('/home');
      }
    } catch (e) {
      Alert.alert(
        'Não foi possível cadastrar',
        e instanceof Error ? e.message : 'Tente novamente em instantes.'
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image
            source={require('../components/VytaLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Cadastro</Text>
          <Text style={styles.stepText}>
            Etapa {etapa + 1} de {ETAPAS.length} - {ETAPAS[etapa]}
          </Text>
          <View style={styles.progress}>
            {ETAPAS.map((_, i) => (
              <View key={i} style={[styles.progressBar, i <= etapa && styles.progressBarActive]} />
            ))}
          </View>
        </View>

        <View style={styles.form}>
          {etapa === 0 && (
            <>
              <Campo
                label="Nome completo"
                value={form.nome}
                onChangeText={set('nome')}
                placeholder="Nome e sobrenome"
                autoCapitalize="words"
                erro={erros.nome}
              />
              <Campo
                label="E-mail"
                value={form.email}
                onChangeText={set('email')}
                placeholder="voce@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                erro={erros.email}
              />
              <Campo
                label="CPF"
                value={form.cpf}
                onChangeText={(t) => set('cpf')(mascaraCpf(t))}
                placeholder="000.000.000-00"
                keyboardType="numeric"
                erro={erros.cpf}
              />
              <Campo
                label="Telefone"
                value={form.telefone}
                onChangeText={(t) => set('telefone')(mascaraTelefone(t))}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                erro={erros.telefone}
              />
              <Campo
                label="Data de nascimento"
                value={form.nascimento}
                onChangeText={(t) => set('nascimento')(mascaraData(t))}
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                erro={erros.nascimento}
              />
              <Opcoes
                label="Sexo biológico"
                opcoes={SEXOS_BIOLOGICOS}
                valor={form.sexo}
                onChange={set('sexo')}
                erro={erros.sexo}
              />
              <Opcoes
                label="Identidade de gênero"
                opcoes={IDENTIDADES_GENERO}
                valor={form.identidade}
                onChange={set('identidade')}
                erro={erros.identidade}
              />
              <SenhaCampo
                label="Senha (mínimo 8 caracteres)"
                value={form.senha}
                onChangeText={set('senha')}
                erro={erros.senha}
              />
              <SenhaCampo
                label="Confirmar senha"
                value={form.confirmarSenha}
                onChangeText={set('confirmarSenha')}
                erro={erros.confirmarSenha}
              />
            </>
          )}

          {etapa === 1 && (
            <>
              {perfil === 'medico' ? (
                <>
                  <Campo
                    label="CRM"
                    value={form.crm}
                    onChangeText={(t) => set('crm')(t.replace(/\D/g, '').slice(0, 7))}
                    placeholder="Somente números"
                    keyboardType="numeric"
                    erro={erros.crm}
                  />
                  <Campo
                    label="UF do CRM"
                    value={form.crmUf}
                    onChangeText={(t) => set('crmUf')(t.replace(/[^a-zA-Z]/g, '').toUpperCase())}
                    placeholder="SP"
                    autoCapitalize="characters"
                    maxLength={2}
                    erro={erros.crmUf}
                  />
                  <Campo
                    label="Especialidade"
                    value={form.especialidade}
                    onChangeText={set('especialidade')}
                    placeholder="Ex.: Clínico Geral"
                    autoCapitalize="words"
                    erro={erros.especialidade}
                  />
                </>
              ) : (
                <Opcoes
                  label="Tipo sanguíneo (opcional)"
                  opcoes={TIPOS_SANGUINEOS}
                  valor={form.tipoSanguineo}
                  onChange={set('tipoSanguineo')}
                  desmarcavel
                />
              )}

              <Text style={styles.sectionTitle}>Contato de emergência</Text>
              <Campo
                label="Nome do contato"
                value={form.contatoNome}
                onChangeText={set('contatoNome')}
                placeholder="Nome completo"
                autoCapitalize="words"
                erro={erros.contatoNome}
              />
              <Campo
                label="Telefone do contato"
                value={form.contatoTel}
                onChangeText={(t) => set('contatoTel')(mascaraTelefone(t))}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                erro={erros.contatoTel}
              />
            </>
          )}

          {etapa === 2 && (
            <>
              <Text style={styles.helper}>
                Você pode pular esta etapa e informar o endereço depois. Se começar a preencher,
                complete todos os campos obrigatórios.
              </Text>
              <Campo
                label="CEP"
                value={form.cep}
                onChangeText={(t) => set('cep')(mascaraCep(t))}
                placeholder="00000-000"
                keyboardType="numeric"
                erro={erros.cep}
              />
              <Campo
                label="Logradouro"
                value={form.logradouro}
                onChangeText={set('logradouro')}
                placeholder="Rua, avenida..."
                autoCapitalize="words"
                erro={erros.logradouro}
              />
              <Campo
                label="Número"
                value={form.numero}
                onChangeText={set('numero')}
                placeholder="Ex.: 123"
                erro={erros.numero}
              />
              <Campo
                label="Complemento (opcional)"
                value={form.complemento}
                onChangeText={set('complemento')}
                placeholder="Apto, bloco..."
              />
              <Campo
                label="Bairro"
                value={form.bairro}
                onChangeText={set('bairro')}
                autoCapitalize="words"
                erro={erros.bairro}
              />
              <Campo
                label="Cidade"
                value={form.cidade}
                onChangeText={set('cidade')}
                autoCapitalize="words"
                erro={erros.cidade}
              />
              <Campo
                label="Estado (UF)"
                value={form.estado}
                onChangeText={(t) => set('estado')(t.replace(/[^a-zA-Z]/g, '').toUpperCase())}
                placeholder="SP"
                autoCapitalize="characters"
                maxLength={2}
                erro={erros.estado}
              />
              <Campo
                label="País"
                value={form.pais}
                onChangeText={set('pais')}
                erro={erros.pais}
              />
            </>
          )}
        </View>

        <View style={styles.footer}>
          <Pressable
            style={[styles.submitButton, enviando && { opacity: 0.6 }]}
            onPress={handleContinuar}
            disabled={enviando}
          >
            <Text style={styles.submitButtonText}>
              {enviando ? 'Enviando...' : ultima ? 'Cadastrar' : 'Continuar'}
            </Text>
          </Pressable>

          {etapa > 0 && (
            <Pressable style={styles.backButton} onPress={() => irParaEtapa(etapa - 1)}>
              <Text style={styles.backButtonText}>Voltar</Text>
            </Pressable>
          )}

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <Pressable onPress={() => router.push({ pathname: '/login', params: { role } })}>
              <Text style={styles.loginLink}>Fazer login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.orange,
  },
  stepText: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 6,
  },
  progress: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 28,
    alignSelf: 'stretch',
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  progressBarActive: {
    backgroundColor: COLORS.teal,
  },
  form: {
    paddingHorizontal: 28,
    marginTop: 28,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 15,
    color: '#333333',
  },
  inputErro: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 8,
  },
  helper: {
    fontSize: 13,
    color: '#6B6B6B',
    marginBottom: 20,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.teal,
    marginTop: 8,
    marginBottom: 14,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  chipActive: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  chipTextActive: {
    color: COLORS.white,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    paddingHorizontal: 20,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#333333',
  },
  eyeButton: {
    padding: 4,
  },
  footer: {
    paddingHorizontal: 28,
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: COLORS.teal,
    fontSize: 16,
    fontWeight: '700',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginText: {
    color: '#333333',
    fontSize: 13,
  },
  loginLink: {
    color: COLORS.teal,
    fontSize: 13,
    fontWeight: '700',
  },
});