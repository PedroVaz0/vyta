import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
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

// Dados de exemplo — troque pelos dados reais do usuário logado.
const usuarioInicial = {
  nome: 'Maperi Julu',
  email: 'maperi.julu@email.com',
  telefone: '(12) 98765-4321',
  nascimento: '14/05/1995',
  cpf: '123.456.789-00',
};

type CampoProps = {
  label: string;
  icon: IconName;
  value: string;
  onChangeText?: (t: string) => void;
  editable?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  autoCapitalize?: 'none' | 'words';
};

function Campo({
  label,
  icon,
  value,
  onChangeText,
  editable = true,
  keyboardType = 'default',
  autoCapitalize = 'none',
}: CampoProps) {
  const [focado, setFocado] = useState(false);

  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          focado && styles.inputRowFocused,
          !editable && styles.inputRowDisabled,
        ]}
      >
        <Feather
          name={icon}
          size={18}
          color={focado ? COLORS.tealLight : COLORS.teal}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          placeholderTextColor={COLORS.textGray}
        />
        {!editable && <Feather name="lock" size={16} color={COLORS.textGray} />}
      </View>
    </View>
  );
}

export default function EditarPerfilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [nome, setNome] = useState(usuarioInicial.nome);
  const [email, setEmail] = useState(usuarioInicial.email);
  const [telefone, setTelefone] = useState(usuarioInicial.telefone);
  const [nascimento, setNascimento] = useState(usuarioInicial.nascimento);

  const handleSalvar = () => {
    // TODO: enviar os dados atualizados para a API.
    Alert.alert('Perfil atualizado', 'Suas informações foram salvas.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleAlterarFoto = () => {
    // TODO: abrir o seletor de imagem (expo-image-picker).
    console.log('Alterar foto');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={22} color={COLORS.teal} />
          </Pressable>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Feather name="user" size={36} color={COLORS.white} />
          </View>
          <Pressable style={styles.cameraBadge} onPress={handleAlterarFoto}>
            <Feather name="camera" size={14} color={COLORS.white} />
          </Pressable>
          <Text style={styles.changePhotoText}>Alterar foto</Text>
        </View>

        {/* Campos */}
        <Campo
          label="Nome completo"
          icon="user"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />
        <Campo
          label="E-mail"
          icon="mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Campo
          label="Telefone"
          icon="phone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />
        <Campo
          label="Data de nascimento"
          icon="calendar"
          value={nascimento}
          onChangeText={setNascimento}
          keyboardType="numeric"
        />
        <Campo
          label="CPF"
          icon="credit-card"
          value={usuarioInicial.cpf}
          editable={false}
        />
        <Text style={styles.helperText}>
          O CPF não pode ser alterado. Em caso de erro, fale com o suporte.
        </Text>

        {/* Botões */}
        <Pressable style={styles.saveButton} onPress={handleSalvar}>
          <Text style={styles.saveText}>Salvar alterações</Text>
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancelar</Text>
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
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    top: 60,
    right: '50%',
    marginRight: -48,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.orange,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.orange,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputRowFocused: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.tealLight,
  },
  inputRowDisabled: {
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.textGray,
    marginTop: -6,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.teal,
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.teal,
    fontSize: 15,
    fontWeight: '700',
  },
});
