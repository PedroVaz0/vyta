import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const COLORS = {
  teal: "#007C94",
  orange: "#FF7A59",
  white: "#FFFFFF",
};

export default function WelcomeScreen() {
  const router = useRouter();

  const goToLogin = (role: "medico" | "paciente") => {
    router.push({ pathname: "/login", params: { role } });
  };

  return (
    <View style={styles.container}>
      {/* Área superior branca com logo */}
      <View style={styles.top}>
        <Image
          source={require("../components/VytaLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.brand}>vyta</Text>
        <Text style={styles.slogan}>saúde que te acompanha</Text>
      </View>

      {/* Cartão inferior em teal */}
      <View style={styles.bottomCard}>
        <Text style={styles.welcomeTitle}>Bem vindo</Text>
        <Text style={styles.welcomeSubtitle}>
          Escolha seu perfil para continuar
        </Text>

        <View style={styles.buttonsRow}>
          <Pressable
            style={[styles.button, styles.buttonOrange]}
            onPress={() => goToLogin("medico")}
          >
            <Text style={styles.buttonTextWhite}>Médico</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.buttonWhite]}
            onPress={() => goToLogin("paciente")}
          >
            <Text style={styles.buttonTextOrange}>Paciente</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  top: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  brand: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.orange,
  },
  slogan: {
    fontSize: 13,
    color: "#333333",
    marginTop: 2,
  },
  bottomCard: {
    backgroundColor: COLORS.teal,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingTop: 40,
    paddingBottom: 56,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.white,
    marginBottom: 28,
    textAlign: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
  },
  buttonOrange: {
    backgroundColor: COLORS.orange,
  },
  buttonWhite: {
    backgroundColor: COLORS.white,
  },
  buttonTextWhite: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
  },
  buttonTextOrange: {
    color: COLORS.orange,
    fontWeight: "700",
    fontSize: 15,
  },
});
