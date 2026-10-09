import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { adicionarConsulta } from '../store/consultas';

const COLORS = {
  teal: '#007C94',
  tealLight: '#0EA5B7',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
};

// Trocar pelos médicos reais vindos da API.
const MEDICOS = [
  { id: 'm1', nome: 'Dr. Riquelme Santos', especialidade: 'Clínico Geral', clinica: 'Clínica Bem Estar' },
  { id: 'm2', nome: 'Dra. Carla Menezes', especialidade: 'Cardiologia', clinica: 'Clínica Bem Estar' },
  { id: 'm3', nome: 'Dr. André Lima', especialidade: 'Dermatologia', clinica: 'Espaço Saúde' },
  { id: 'm4', nome: 'Dr. Marcos Tavares', especialidade: 'Ortopedia', clinica: 'Espaço Saúde' },
];

const HORARIOS = ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'];

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];


function gerarDias() {
  const dias: Date[] = [];
  const hoje = new Date();
  for (let i = 1; dias.length < 14; i++) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i);
    if (d.getDay() !== 0) dias.push(d);
  }
  return dias;
}

const formatarData = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;

export default function NovaConsultaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dias = useMemo(gerarDias, []);

  const [medicoId, setMedicoId] = useState<string | null>(null);
  const [diaIndex, setDiaIndex] = useState<number | null>(null);
  const [horario, setHorario] = useState<string | null>(null);

  const medico = MEDICOS.find((m) => m.id === medicoId);
  const completo = !!medico && diaIndex !== null && !!horario;

  const handleAgendar = () => {
    if (!medico || diaIndex === null || !horario) return;

    adicionarConsulta({
      medico: medico.nome,
      especialidade: medico.especialidade,
      clinica: medico.clinica,
      data: formatarData(dias[diaIndex]),
      horario,
    });

    Alert.alert('Consulta agendada', 'Sua consulta foi adicionada à lista.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Feather name="chevron-left" size={22} color={COLORS.teal} />
          </Pressable>
          <Text style={styles.headerTitle}>Nova consulta</Text>
        </View>

        {/* Médico */}
        <Text style={styles.sectionTitle}>Médico</Text>
        {MEDICOS.map((m) => {
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
                <Text style={styles.medicoInfo}>
                  {m.especialidade} · {m.clinica}
                </Text>
              </View>
              {ativo && <Feather name="check-circle" size={20} color={COLORS.tealLight} />}
            </Pressable>
          );
        })}

        {/* Data */}
        <Text style={[styles.sectionTitle, styles.sectionSpaced]}>Data</Text>
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
                style={[styles.diaChip, ativo && styles.chipAtivo]}
                onPress={() => setDiaIndex(i)}
              >
                <Text style={[styles.diaSemana, ativo && styles.textoAtivo]}>
                  {DIAS_SEMANA[d.getDay()]}
                </Text>
                <Text style={[styles.diaNumero, ativo && styles.textoAtivo]}>{d.getDate()}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Horário */}
        <Text style={[styles.sectionTitle, styles.sectionSpaced]}>Horário</Text>
        <View style={styles.horariosWrap}>
          {HORARIOS.map((h) => {
            const ativo = horario === h;
            return (
              <Pressable
                key={h}
                style={[styles.horarioChip, ativo && styles.chipAtivo]}
                onPress={() => setHorario(h)}
              >
                <Text style={[styles.horarioText, ativo && styles.textoAtivo]}>{h}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Botão fixo */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={[styles.saveButton, !completo && styles.saveButtonDisabled]}
          onPress={handleAgendar}
          disabled={!completo}
        >
          <Text style={styles.saveText}>Agendar consulta</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.textDark },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, marginBottom: 14 },
  sectionSpaced: { marginTop: 16 },
  medicoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  medicoCardAtivo: { backgroundColor: COLORS.white, borderColor: COLORS.tealLight },
  medicoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medicoTextWrapper: { flex: 1 },
  medicoNome: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 2 },
  medicoInfo: { fontSize: 12, color: COLORS.textGray },
  diasScroll: { flexGrow: 0, marginHorizontal: -20 },
  diasContent: { gap: 10, paddingHorizontal: 20 },
  diaChip: {
    width: 56,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
  },
  diaSemana: { fontSize: 12, fontWeight: '600', color: COLORS.textGray },
  diaNumero: { fontSize: 20, fontWeight: '700', color: COLORS.textDark, marginTop: 2 },
  horariosWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  horarioChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
  },
  horarioText: { fontSize: 13, fontWeight: '600', color: COLORS.teal },
  chipAtivo: { backgroundColor: COLORS.teal },
  textoAtivo: { color: COLORS.white },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
});