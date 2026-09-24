import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  gray: '#9AA0A6',
  border: '#D9D9D9',
};

export default function LoginScreen() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  const router = useRouter();

  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const insets = useSafeAreaInsets();

  const handleEntrar = () => {
    // TODO: chamar a API de autenticação, passando cpf, senha e role
    console.log('Login', { role, cpf, senha });

    // Por enquanto, navega direto para a Home do paciente.
    // Quando o backend estiver pronto, faça essa navegação só depois
    // de confirmar que o login deu certo.
    router.replace('/home');
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Logo + título */}
      <View style={styles.header}>
        <Image
          source={require('../components/VytaLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Login</Text>
      </View>

      {/* Formulário */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu CPF"
          placeholderTextColor={COLORS.gray}
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />

        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Digite sua senha"
            placeholderTextColor={COLORS.gray}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!senhaVisivel}
          />
          <Pressable
            onPress={() => setSenhaVisivel((v) => !v)}
            style={styles.eyeButton}
            hitSlop={10}
          >
            <MaterialCommunityIcons
              name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={COLORS.gray}
            />
          </Pressable>
        </View>

        <Pressable onPress={() => { /* TODO: navegar para recuperação de senha */ }}>
          <Text style={styles.forgotPassword}>Esqueci a minha senha</Text>
        </Pressable>
      </View>

      {/* Botão Entrar */}
      <View style={styles.footer}>
        <Pressable style={styles.enterButton} onPress={handleEntrar}>
          <Text style={styles.enterButtonText}>Entrar</Text>
        </Pressable>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Não tem uma conta? </Text>
          <Pressable
            onPress={() =>
              router.push({ pathname: '/cadastro', params: { role } })
            }
          >
            <Text style={styles.signupLink}>Cadastrar</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 90,
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
  form: {
    paddingHorizontal: 28,
    marginTop: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 15,
    color: '#333333',
    marginBottom: 16,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 10,
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  enterButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  enterButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#333333',
    fontSize: 13,
  },
  signupLink: {
    color: COLORS.teal,
    fontSize: 13,
    fontWeight: '700',
  },
});