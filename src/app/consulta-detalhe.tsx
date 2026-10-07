import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusConsulta, useConsultas } from '../store/consultas';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
  successBg: '#E4F7EC',
  successText: '#1E8E4F',
  canceledBg: '#FBE9E9',
  canceledText: '#C0392B',
};

const STATUS_LABEL: Record<StatusConsulta, string> = {
  agendada: 'Agendada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

const STATUS_COLORS: Record<StatusConsulta, { bg: string; text: string }> = {
  agendada: { bg: COLORS.cardBg, text: COLORS.teal },
  concluida: { bg: COLORS.successBg, text: COLORS.successText },
  cancelada: { bg: COLORS.canceledBg, text: COLORS.canceledText },
};

export default function ConsultaDetalheScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const consultas = useConsultas();
  const consulta = consultas.find((c) => String(c.id) === String(id));

  const Header = ({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) => (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <Pressable hitSlop={10} onPress={() => router.back()} style={styles.backButton}>
        <Feather name="arrow-left" size={22} color={COLORS.white} />
      </Pressable>
      <Text style={styles.headerTitle}>{titulo}</Text>
      {subtitulo ? <Text style={styles.headerSubtitle}>{subtitulo}</Text> : null}
    </View>
  );

  if (!consulta) {
    return (
      <View style={styles.container}>
        <Header titulo="Consulta" />
        <View style={[styles.body, styles.centered]}>
          <Feather name="alert-circle" size={32} color={COLORS.orange} />
          <Text style={styles.emptyTitle}>Consulta não encontrada</Text>
          <Text style={styles.emptyText}>Volte para a lista e escolha outra consulta.</Text>
        </View>
      </View>
    );
  }

  const cores = STATUS_COLORS[consulta.status];

  const handleReagendar = () => {
    // TODO: levar para a tela de edição/reagendamento quando ela existir.
    router.push('/nova-consulta');
  };

  const handleCancelar = () => {
    Alert.alert(
      'Cancelar consulta',
      `Deseja cancelar a consulta com ${consulta.medico} em ${consulta.data} às ${consulta.horario}?`,
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Cancelar consulta',
          style: 'destructive',
          onPress: () => {
            // TODO: chamar aqui a função do store que cancela a consulta
            // e depois voltar para a lista com router.back().
            console.log('Cancelar consulta', consulta.id);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header titulo={consulta.medico} subtitulo={consulta.especialidade} />

      <View style={styles.body}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        >
          <View style={[styles.statusBadge, { backgroundColor: cores.bg }]}>
            <Text style={[styles.statusBadgeText, { color: cores.text }]}>
              {STATUS_LABEL[consulta.status]}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <InfoRow icon="calendar" label="Data" value={consulta.data} />
            <InfoRow icon="clock" label="Horário" value={consulta.horario} />
            <InfoRow icon="user" label="Médico" value={consulta.medico} />
            <InfoRow icon="activity" label="Especialidade" value={consulta.especialidade} />
            <InfoRow icon="map-pin" label="Clínica" value={consulta.clinica} last />
          </View>

          {consulta.status === 'agendada' && (
            <View style={styles.buttonsRow}>
              <Pressable style={[styles.button, styles.buttonOrange]} onPress={handleReagendar}>
                <Text style={styles.buttonTextWhite}>Reagendar</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonCancel]} onPress={handleCancelar}>
                <Text style={styles.buttonTextCancel}>Cancelar</Text>
              </Pressable>
            </View>
          )}

          {consulta.status === 'concluida' && (
            <View style={styles.buttonsRow}>
              <Pressable
                style={[styles.button, styles.buttonOrange]}
                onPress={() => router.push('/(tabs)/laudos' as any)}
              >
                <Text style={styles.buttonTextWhite}>Ver laudos</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  last,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !last && { marginBottom: 14 }]}>
      <View style={styles.iconCircle}>
        <Feather name={icon} size={16} color={COLORS.white} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.teal },
  header: { paddingHorizontal: 24, paddingBottom: 28 },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerTitle: { fontSize: 26, fontWeight: '700', color: COLORS.white, marginBottom: 4 },
  headerSubtitle: { fontSize: 13, fontWeight: '600', color: COLORS.white },
  body: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    paddingTop: 28,
    paddingHorizontal: 20,
  },
  centered: { alignItems: 'center', justifyContent: 'center', paddingBottom: 80 },
  emptyTitle: { marginTop: 12, fontSize: 15, fontWeight: '700', color: COLORS.textDark },
  emptyText: { marginTop: 4, fontSize: 13, color: COLORS.textGray },

  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  statusBadgeText: { fontSize: 12, fontWeight: '700' },

  infoCard: { backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 14, marginBottom: 24 },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoLabel: { color: COLORS.textGray, fontSize: 12, marginBottom: 2 },
  infoValue: { color: COLORS.textDark, fontSize: 14, fontWeight: '700' },

  buttonsRow: { flexDirection: 'row', gap: 16, justifyContent: 'center' },
  button: { paddingVertical: 14, paddingHorizontal: 28, borderRadius: 30 },
  buttonOrange: { backgroundColor: COLORS.orange },
  buttonCancel: { borderWidth: 1.5, borderColor: COLORS.canceledText },
  buttonTextWhite: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  buttonTextCancel: { color: COLORS.canceledText, fontWeight: '700', fontSize: 15 },
});