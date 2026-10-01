import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  teal: '#007C94',
  tealLight: '#0EA5B7',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
  danger: '#E03131',
};

type IconName = React.ComponentProps<typeof Feather>['name'];

type LinhaProps = {
  icon: IconName;
  label: string;
  descricao?: string;
  ultimo?: boolean;
  onPress?: () => void;
  valor?: boolean;
  onToggle?: (v: boolean) => void;
};

function Linha({ icon, label, descricao, ultimo, onPress, valor, onToggle }: LinhaProps) {
  const temSwitch = onToggle !== undefined;

  return (
    <Pressable
      style={[styles.row, ultimo && styles.rowLast]}
      onPress={onPress}
      disabled={temSwitch || !onPress}
    >
      <View style={styles.iconCircle}>
        <Feather name={icon} size={18} color={COLORS.teal} />
      </View>

      <View style={styles.rowTextWrapper}>
        <Text style={styles.rowLabel}>{label}</Text>
        {descricao ? <Text style={styles.rowDescricao}>{descricao}</Text> : null}
      </View>

      {temSwitch ? (
        <Switch
          value={!!valor}
          onValueChange={onToggle}
          trackColor={{ false: '#D5DDE0', true: COLORS.tealLight }}
          thumbColor={COLORS.white}
          ios_backgroundColor="#D5DDE0"
        />
      ) : (
        <Feather name="chevron-right" size={20} color={COLORS.textGray} />
      )}
    </Pressable>
  );
}

export default function PrivacidadeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [biometria, setBiometria] = useState(false);
  const [doisFatores, setDoisFatores] = useState(false);
  const [compartilharMedicos, setCompartilharMedicos] = useState(true);
  const [dadosAnonimos, setDadosAnonimos] = useState(false);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleAlterarSenha = () => {
    if (novaSenha.length < 8) {
      Alert.alert('Senha fraca', 'A nova senha precisa ter pelo menos 8 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Alert.alert('Senhas diferentes', 'A confirmação não é igual à nova senha.');
      return;
    }
    // TODO: enviar para a API (senhaAtual + novaSenha).
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
    setMostrarSenha(false);
    Alert.alert('Senha alterada', 'Sua senha foi atualizada com sucesso.');
  };

  const handleBaixarDados = () => {
    // TODO: solicitar à API a exportação dos dados do usuário (LGPD).
    Alert.alert('Solicitação enviada', 'Enviaremos seus dados para o seu e-mail.');
  };

  const handleExcluirConta = () => {
    Alert.alert(
      'Excluir conta',
      'Essa ação é permanente e apaga todo o seu histórico. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // TODO: chamar a API de exclusão e limpar a sessão.
            router.replace('/');
          },
        },
      ]
    );
  };

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
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={22} color={COLORS.teal} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacidade e Segurança</Text>
      </View>

      {/* Segurança */}
      <Text style={styles.sectionTitle}>Segurança</Text>
      <View style={styles.card}>
        <Linha
          icon="key"
          label="Alterar senha"
          descricao="Use uma senha forte e única"
          onPress={() => setMostrarSenha((v) => !v)}
        />

        {mostrarSenha && (
          <View style={styles.passwordForm}>
            <TextInput
              style={styles.input}
              placeholder="Senha atual"
              placeholderTextColor={COLORS.textGray}
              secureTextEntry
              value={senhaAtual}
              onChangeText={setSenhaAtual}
            />
            <TextInput
              style={styles.input}
              placeholder="Nova senha"
              placeholderTextColor={COLORS.textGray}
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar nova senha"
              placeholderTextColor={COLORS.textGray}
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            <Pressable style={styles.saveButton} onPress={handleAlterarSenha}>
              <Text style={styles.saveText}>Atualizar senha</Text>
            </Pressable>
          </View>
        )}

        <Linha
          icon="smartphone"
          label="Biometria"
          descricao="Entrar com digital ou Face ID"
          valor={biometria}
          onToggle={setBiometria}
        />
        <Linha
          icon="shield"
          label="Verificação em duas etapas"
          descricao="Uma camada extra de proteção"
          valor={doisFatores}
          onToggle={setDoisFatores}
          ultimo
        />
      </View>

      {/* Privacidade */}
      <Text style={styles.sectionTitle}>Privacidade</Text>
      <View style={styles.card}>
        <Linha
          icon="users"
          label="Compartilhar com médicos"
          descricao="Permite que seus médicos vejam seu histórico"
          valor={compartilharMedicos}
          onToggle={setCompartilharMedicos}
        />
        <Linha
          icon="eye-off"
          label="Dados anônimos para pesquisa"
          descricao="Ajude a melhorar o Vyta sem se identificar"
          valor={dadosAnonimos}
          onToggle={setDadosAnonimos}
        />
        <Linha
          icon="download"
          label="Baixar meus dados"
          descricao="Receba uma cópia das suas informações"
          onPress={handleBaixarDados}
          ultimo
        />
      </View>

      {/* Zona de perigo */}
      <Pressable style={styles.deleteButton} onPress={handleExcluirConta}>
        <Feather name="trash-2" size={18} color={COLORS.danger} />
        <Text style={styles.deleteText}>Excluir minha conta</Text>
      </Pressable>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    paddingHorizontal: 14,
    marginBottom: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#D3E8EE',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTextWrapper: {
    flex: 1,
    marginRight: 10,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  rowDescricao: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  passwordForm: {
    paddingVertical: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D3E8EE',
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: COLORS.textDark,
  },
  saveButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  deleteText: {
    color: COLORS.danger,
    fontSize: 15,
    fontWeight: '700',
  },
});
