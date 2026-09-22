import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const COLORS = {
  teal: "#007C94",
  orange: "#FF7A59",
  white: "#FFFFFF",
  gray: "#9AA0A6",
  border: "#D9D9D9",
};

export default function CadastroScreen() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const handleCadastrar = () => {
    // TODO: chamar a API de cadastro, passando nome, email, cpf, dataNascimento, senha e role
    console.log("Cadastro", { role, nome, email, cpf, dataNascimento, senha });

    // Por enquanto, navega direto para a Home do paciente.
    // Quando o backend estiver pronto, faça essa navegação só depois
    // de confirmar que o cadastro deu certo.
    router.replace("/home");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo + título */}
        <View style={styles.header}>
          <Image
            source={require("../components/VytaLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Cadastro</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            placeholderTextColor={COLORS.gray}
            value={nome}
            onChangeText={setNome}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="CPF"
            placeholderTextColor={COLORS.gray}
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Data de nascimento"
            placeholderTextColor={COLORS.gray}
            value={dataNascimento}
            onChangeText={setDataNascimento}
            keyboardType="numeric"
          />

          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Senha"
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
                name={senhaVisivel ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={COLORS.gray}
              />
            </Pressable>
          </View>
        </View>

        {/* Botão Cadastrar */}
        <View style={styles.footer}>
          <Pressable style={styles.submitButton} onPress={handleCadastrar}>
            <Text style={styles.submitButtonText}>Cadastrar</Text>
          </Pressable>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <Pressable
              onPress={() =>
                router.push({ pathname: "/login", params: { role } })
              }
            >
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
    justifyContent: "space-between",
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginTop: 70,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.orange,
  },
  form: {
    paddingHorizontal: 28,
    marginTop: 36,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 15,
    color: "#333333",
    marginBottom: 16,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    paddingHorizontal: 20,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#333333",
  },
  eyeButton: {
    padding: 4,
  },
  footer: {
    paddingHorizontal: 28,
    marginTop: 32,
  },
  submitButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "#333333",
    fontSize: 13,
  },
  loginLink: {
    color: COLORS.teal,
    fontSize: 13,
    fontWeight: "700",
  },
});
