import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLaudoPorId, StatusResultado } from '../data/laudos';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
};

const STATUS_LABEL: Record<StatusResultado, string> = {
  normal: 'Normal',
  alto: 'Acima',
  baixo: 'Abaixo',
};

export default function LaudoDetalheScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const laudo = getLaudoPorId(id);

  const Header = ({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) => (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <Pressable hitSlop={10} onPress={() => router.back()} style={styles.backButton}>
        <Feather name="arrow-left" size={22} color={COLORS.white} />
      </Pressable>
      <Text style={styles.headerTitle}>{titulo}</Text>
      {subtitulo ? <Text style={styles.headerSubtitle}>{subtitulo}</Text> : null}
    </View>
  );

  if (!laudo) {
    return (
      <View style={styles.container}>
        <Header titulo="Laudo" />
        <View style={[styles.body, styles.centered]}>
          <Feather name="alert-circle" size={32} color={COLORS.orange} />
          <Text style={styles.emptyTitle}>Laudo não encontrado</Text>
          <Text style={styles.emptyText}>Volte para a lista e escolha outro laudo.</Text>
        </View>
      </View>
    );
  }

  const resultados = laudo.resultados ?? [];
  const foraDaReferencia = resultados.filter((r) => r.status !== 'normal').length;

  const handleAbrir = () => laudo.url && Linking.openURL(laudo.url);

  const handleCompartilhar = async () => {
    const linhas = resultados.map(
      (r) => `${r.nome}: ${r.valor}${r.unidade ? ` ${r.unidade}` : ''}`
    );
    try {
      await Share.share({
        message: [`${laudo.titulo} — ${laudo.data}`, laudo.laboratorio, ...linhas, laudo.url ?? '']
          .filter(Boolean)
          .join('\n'),
      });
    } catch (e) {
      console.log('Erro ao compartilhar', e);
    }
  };

  return (
    <View style={styles.container}>
      <Header titulo={laudo.titulo} subtitulo={`${laudo.tipo} • ${laudo.data}`} />

      <View style={styles.body}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        >
          {/* Informações gerais */}
          <View style={styles.infoCard}>
            <InfoRow icon="home" label="Laboratório" value={laudo.laboratorio} />
            <InfoRow icon="calendar" label="Data do exame" value={laudo.data} />
            <InfoRow icon="user" label="Médico solicitante" value={laudo.medicoSolicitante} last />
          </View>

          {/* Resultados com valores */}
          {resultados.length > 0 && (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Resultados</Text>
                <Text style={[styles.summary, foraDaReferencia > 0 && { color: COLORS.orange }]}>
                  {foraDaReferencia === 0
                    ? 'Tudo dentro da referência'
                    : `${foraDaReferencia} fora da referência`}
                </Text>
              </View>

              {resultados.map((r) => {
                const fora = r.status !== 'normal';
                return (
                  <View key={r.nome} style={styles.resultCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultNome}>{r.nome}</Text>
                      {r.referencia ? (
                        <Text style={styles.resultRef}>
                          Referência: {r.referencia}
                          {r.unidade ? ` ${r.unidade}` : ''}
                        </Text>
                      ) : null}
                    </View>

                    <View style={styles.resultRight}>
                      <Text style={[styles.resultValor, fora && { color: COLORS.orange }]}>
                        {r.valor}
                        {r.unidade ? <Text style={styles.resultUnidade}> {r.unidade}</Text> : null}
                      </Text>
                      <View style={[styles.badge, fora && styles.badgeFora]}>
                        <Text style={[styles.badgeText, fora && styles.badgeTextFora]}>
                          {STATUS_LABEL[r.status]}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </>
          )}

          {/* Exames de imagem */}
          {laudo.achados ? (
            <>
              <Text style={styles.sectionTitle}>Achados</Text>
              <View style={styles.textCard}>
                <Text style={styles.textCardBody}>{laudo.achados}</Text>
              </View>
            </>
          ) : null}

          {/* Conclusão */}
          {laudo.conclusao ? (
            <>
              <Text style={styles.sectionTitle}>Conclusão</Text>
              <View style={styles.textCard}>
                <Text style={styles.textCardBody}>{laudo.conclusao}</Text>
              </View>
            </>
          ) : null}

          <View style={styles.buttonsRow}>
            <Pressable
              style={[styles.button, styles.buttonOrange, !laudo.url && styles.buttonDisabled]}
              onPress={handleAbrir}
              disabled={!laudo.url}
            >
              <Text style={styles.buttonTextWhite}>Abrir PDF</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonOutline]} onPress={handleCompartilhar}>
              <Text style={styles.buttonTextOrange}>Compartilhar</Text>
            </Pressable>
          </View>

          {!laudo.url && (
            <Text style={styles.hint}>O arquivo original deste laudo ainda não está disponível.</Text>
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

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark, marginBottom: 12 },
  summary: { fontSize: 12, fontWeight: '600', color: COLORS.teal, marginBottom: 12 },

  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  resultNome: { color: COLORS.textDark, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  resultRef: { color: COLORS.textGray, fontSize: 12 },
  resultRight: { alignItems: 'flex-end', marginLeft: 12 },
  resultValor: { color: COLORS.textDark, fontSize: 15, fontWeight: '700', marginBottom: 4 },
  resultUnidade: { fontSize: 11, fontWeight: '400', color: COLORS.textGray },
  badge: {
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  badgeFora: { backgroundColor: COLORS.orange },
  badgeText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  badgeTextFora: { color: COLORS.white },

  textCard: { backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 14, marginBottom: 20 },
  textCardBody: { color: COLORS.textDark, fontSize: 14, lineHeight: 21 },

  buttonsRow: { flexDirection: 'row', gap: 16, justifyContent: 'center', marginTop: 8 },
  button: { paddingVertical: 14, paddingHorizontal: 28, borderRadius: 30 },
  buttonOrange: { backgroundColor: COLORS.orange },
  buttonOutline: { borderWidth: 1.5, borderColor: COLORS.orange },
  buttonDisabled: { opacity: 0.4 },
  buttonTextWhite: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  buttonTextOrange: { color: COLORS.orange, fontWeight: '700', fontSize: 15 },
  hint: { marginTop: 16, textAlign: 'center', fontSize: 12, color: COLORS.textGray },
});