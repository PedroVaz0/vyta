import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { adicionarConsulta } = require("../store/consultas");

const COLORS = {
  teal: "#007C94",
  tealLight: "#0EA5B7",
  orange: "#FF7A59",
  white: "#FFFFFF",
  textDark: "#1A1A1A",
  textGray: "#6B6B6B",
  cardBg: "#E9F6FA",
  danger: "#E03131",
};

// Dados de exemplo — troque pelos médicos reais vindos da API.
const MEDICOS = [
  {
    id: "m1",
    nome: "Dr. Riquelme Santos",
    especialidade: "Clínico Geral",
    clinica: "Clínica Bem Estar",
  },
  {
    id: "m2",
    nome: "Dra. Carla Menezes",
    especialidade: "Cardiologia",
    clinica: "Clínica Bem Estar",
  },
  {
    id: "m3",
    nome: "Dr. André Lima",
    especialidade: "Dermatologia",
    clinica: "Espaço Saúde",
  },
  {
    id: "m4",
    nome: "Dra. Paula Ribeiro",
    especialidade: "Dermatologia",
    clinica: "Clínica Bem Estar",
  },
  {
    id: "m5",
    nome: "Dr. Marcos Tavares",
    especialidade: "Ortopedia",
    clinica: "Espaço Saúde",
  },
];

const ESPECIALIDADES = Array.from(new Set(MEDICOS.map((m) => m.especialidade)));

const HORARIOS = [
  "08:00",
  "09:00",
  "09:30",
  "10:00",
  "11:00",
  "14:00",
  "14:30",
  "15:30",
  "16:00",
  "17:00",
];

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// Próximos 21 dias, sem domingos.
function gerarDias() {
  const dias: Date[] = [];
  const hoje = new Date();
  for (let i = 1; dias.length < 21; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i);
    if (d.getDay() !== 0) dias.push(d);
  }
  return dias;
}

const formatarData = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;

export default function NovaConsultaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const dias = useMemo(gerarDias, []);

  const [especialidade, setEspecialidade] = useState<string | null>(null);
  const [medicoId, setMedicoId] = useState<string | null>(null);
  const [diaIndex, setDiaIndex] = useState<number | null>(null);
  const [horario, setHorario] = useState<string | null>(null);

  const medicosDaEspecialidade = MEDICOS.filter(
    (m) => m.especialidade === especialidade,
  );
  const medico = MEDICOS.find((m) => m.id === medicoId);

  const formularioCompleto = !!medico && diaIndex !== null && !!horario;

  const escolherEspecialidade = (esp: string) => {
    setEspecialidade(esp);
    setMedicoId(null); // o médico escolhido deixa de valer ao trocar a especialidade
  };

  const handleAgendar = () => {
    if (!medico || diaIndex === null || !horario) return;

    adicionarConsulta({
      medico: medico.nome,
      especialidade: medico.especialidade,
      clinica: medico.clinica,
      data: formatarData(dias[diaIndex]),
      horario,
    });

    Alert.alert("Consulta agendada", "Sua consulta foi adicionada à lista.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={22} color={COLORS.teal} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Nova consulta</Text>
            <Text style={styles.headerSubtitle}>Preencha os passos abaixo</Text>
          </View>
        </View>

        {/* 1. Especialidade */}
        <Text style={styles.sectionTitle}>1. Especialidade</Text>
        <View style={styles.chipsWrap}>
          {ESPECIALIDADES.map((esp) => {
            const ativo = especialidade === esp;
            return (
              <Pressable
                key={esp}
                style={[styles.chip, ativo && styles.chipAtivo]}
                onPress={() => escolherEspecialidade(esp)}
              >
                <Text style={[styles.chipText, ativo && styles.chipTextAtivo]}>
                  {esp}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 2. Médico */}
        {especialidade && (
          <>
            <Text style={styles.sectionTitle}>2. Médico</Text>
            {medicosDaEspecialidade.map((m) => {
              const ativo = medicoId === m.id;
              return (
                <Pressable
                  key={m.id}
                  style={[styles.medicoCard, ativo && styles.medicoCardAtivo]}
                  onPress={() => setMedicoId(m.id)}
                >
                  <View style={styles.medicoIconCircle}>
                    <Feather name="user" size={18} color={COLORS.white} />
                  </View>
                  <View style={styles.medicoTextWrapper}>
                    <Text style={styles.medicoNome}>{m.nome}</Text>
                    <Text style={styles.medicoClinica}>{m.clinica}</Text>
                  </View>
                  {ativo && (
                    <Feather
                      name="check-circle"
                      size={20}
                      color={COLORS.tealLight}
                    />
                  )}
                </Pressable>
              );
            })}
          </>
        )}

        {/* 3. Data */}
        {medico && (
          <>
            <Text style={styles.sectionTitle}>3. Data</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.diasScroll}
              contentContainerStyle={styles.diasContent}
            >
              {dias.map((d, i) => {
                const ativo = diaIndex === i;
                return (
                  <Pressable
                    key={d.toISOString()}
                    style={[styles.diaChip, ativo && styles.diaChipAtivo]}
                    onPress={() => setDiaIndex(i)}
                  >
                    <Text
                      style={[styles.diaSemana, ativo && styles.diaTextAtivo]}
                    >
                      {DIAS_SEMANA[d.getDay()]}
                    </Text>
                    <Text
                      style={[styles.diaNumero, ativo && styles.diaTextAtivo]}
                    >
                      {d.getDate()}
                    </Text>
                    <Text style={[styles.diaMes, ativo && styles.diaTextAtivo]}>
                      {MESES[d.getMonth()].slice(0, 3)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </>
        )}

        {/* 4. Horário */}
        {diaIndex !== null && (
          <>
            <Text style={styles.sectionTitle}>4. Horário</Text>
            <View style={styles.chipsWrap}>
              {HORARIOS.map((h) => {
                const ativo = horario === h;
                return (
                  <Pressable
                    key={h}
                    style={[styles.chip, ativo && styles.chipAtivo]}
                    onPress={() => setHorario(h)}
                  >
                    <Text
                      style={[styles.chipText, ativo && styles.chipTextAtivo]}
                    >
                      {h}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {/* Resumo */}
        {formularioCompleto && medico && diaIndex !== null && (
          <View style={styles.resumoCard}>
            <View style={styles.resumoIconCircle}>
              <Feather name="calendar" size={18} color={COLORS.teal} />
            </View>
            <View style={styles.resumoTextWrapper}>
              <Text style={styles.resumoLabel}>Resumo</Text>
              <Text style={styles.resumoData}>
                {formatarData(dias[diaIndex])} às {horario}
              </Text>
              <Text style={styles.resumoInfo}>{medico.nome}</Text>
              <Text style={styles.resumoInfo}>{medico.clinica}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botão fixo */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={[
            styles.saveButton,
            !formularioCompleto && styles.saveButtonDisabled,
          ]}
          onPress={handleAgendar}
          disabled={!formularioCompleto}
        >
          <Text style={styles.saveText}>Agendar consulta</Text>
        </Pressable>
      </View>
    </View>
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textGray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 14,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 28,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
  },
  chipAtivo: {
    backgroundColor: COLORS.teal,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.teal,
  },
  chipTextAtivo: {
    color: COLORS.white,
  },
  medicoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  medicoCardAtivo: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.tealLight,
  },
  medicoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.teal,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  medicoTextWrapper: {
    flex: 1,
  },
  medicoNome: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 2,
  },
  medicoClinica: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  diasScroll: {
    flexGrow: 0,
    marginTop: 4,
    marginBottom: 28,
    marginHorizontal: -20,
  },
  diasContent: {
    gap: 10,
    paddingHorizontal: 20,
  },
  diaChip: {
    width: 62,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: COLORS.cardBg,
    alignItems: "center",
  },
  diaChipAtivo: {
    backgroundColor: COLORS.teal,
  },
  diaSemana: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textGray,
  },
  diaNumero: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
    marginVertical: 2,
  },
  diaMes: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.teal,
    textTransform: "uppercase",
  },
  diaTextAtivo: {
    color: COLORS.white,
  },
  resumoCard: {
    backgroundColor: COLORS.teal,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  resumoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  resumoTextWrapper: {
    flex: 1,
  },
  resumoLabel: {
    color: COLORS.white,
    fontSize: 13,
    marginBottom: 6,
  },
  resumoData: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  resumoInfo: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  saveButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
});
