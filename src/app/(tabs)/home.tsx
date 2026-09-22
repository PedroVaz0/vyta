import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLORS = {
  teal: "#007C94",
  orange: "#FF7A59",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textGray: "#6B6B6B",
  danger: "#E03131",
};

// Dados de exemplo — troque pelos dados reais vindos da API quando estiver pronta.
const proximaConsulta = {
  data: "05 de novembro - 14:00",
  clinica: "Clínica Bem estar",
  medico: "Dr. Riquelme Santos",
};

const laudos = [
  {
    id: "1",
    titulo: "Laudo de Exame de Sangue",
    laboratorio: "Labotário Oswaldo Cruz",
    data: "21/08/2026",
  },
  {
    id: "2",
    titulo: "Laudo de Exame de Sangue",
    laboratorio: "Labotário Oswaldo Cruz",
    data: "17/06/2026",
  },
  {
    id: "3",
    titulo: "Laudo de Exame de Sangue",
    laboratorio: "Labotário Oswaldo Cruz",
    data: "02/03/2026",
  },
];

export default function PacienteHomeScreen() {
  const nomePaciente = "Maperi Julu"; // troque pelo nome vindo do usuário logado

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Image
            source={require("../../components/VytaLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandText}>vyta</Text>
        </View>

        <Pressable style={styles.bellButton}>
          <Feather name="bell" size={24} color={COLORS.textDark} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>1</Text>
          </View>
        </Pressable>
      </View>

      {/* Saudação */}
      <Text style={styles.greeting}>Olá, {nomePaciente}</Text>
      <Text style={styles.subGreeting}>Como está se sentindo hoje?</Text>

      {/* Próxima consulta */}
      <Pressable style={styles.consultaCard}>
        <View style={styles.consultaTextWrapper}>
          <Text style={styles.consultaLabel}>Próxima consulta</Text>
          <Text style={styles.consultaData}>{proximaConsulta.data}</Text>

          <Text style={styles.consultaClinica}>{proximaConsulta.clinica}</Text>
          <Text style={styles.consultaMedico}>{proximaConsulta.medico}</Text>
        </View>
        <Feather name="chevron-right" size={22} color={COLORS.white} />
      </Pressable>

      {/* Atalhos */}
      <View style={styles.shortcutsRow}>
        <Pressable style={styles.shortcutCard}>
          <Text style={styles.shortcutText}>Histórico Clínico</Text>
        </Pressable>

        <Pressable style={styles.shortcutCard}>
          <Text style={styles.shortcutText}>Minhas Consultas</Text>
        </Pressable>
      </View>

      {/* Início e Laudos */}
      <Text style={styles.sectionTitle}>Início e Laudos</Text>

      {laudos.map((laudo) => (
        <View key={laudo.id} style={styles.laudoCard}>
          <View style={styles.laudoTopRow}>
            <View>
              <Text style={styles.laudoTitulo}>{laudo.titulo}</Text>
              <Text style={styles.laudoLaboratorio}>{laudo.laboratorio}</Text>
            </View>

            <Pressable hitSlop={8}>
              <Feather name="download" size={20} color={COLORS.white} />
            </Pressable>
          </View>

          <View style={styles.laudoBottomRow}>
            <Text style={styles.laudoData}>{laudo.data}</Text>

            <Pressable hitSlop={8}>
              <MaterialCommunityIcons
                name="share-variant"
                size={20}
                color={COLORS.white}
              />
            </Pressable>
          </View>
        </View>
      ))}
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  brandText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  bellButton: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.textGray,
    marginBottom: 20,
  },
  consultaCard: {
    backgroundColor: COLORS.teal,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  consultaTextWrapper: {
    flex: 1,
  },
  consultaLabel: {
    color: COLORS.white,
    fontSize: 13,
    marginBottom: 6,
  },
  consultaData: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 14,
  },
  consultaClinica: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
  consultaMedico: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
  shortcutsRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 28,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: COLORS.teal,
    borderRadius: 18,
    height: 110,
    padding: 16,
    justifyContent: "flex-start",
  },
  shortcutText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 14,
  },
  laudoCard: {
    backgroundColor: COLORS.teal,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  laudoTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  laudoTitulo: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  laudoLaboratorio: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.9,
  },
  laudoBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  laudoData: {
    color: COLORS.white,
    fontSize: 12,
  },
});
