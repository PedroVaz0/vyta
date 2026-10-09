import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Laudo, LAUDOS } from '../../data/laudos';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
};

export default function LaudosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const abrirLaudo = (laudo: Laudo) => {
    router.push({ pathname: '/laudo-detalhe', params: { id: laudo.id } } as any);
  };

  const handleBaixar = (laudo: Laudo) => {
    // Torcar quando o backend tiver a URL
    console.log('Baixar laudo', laudo.titulo);
  };

  const handleCompartilhar = async (laudo: Laudo) => {
    try {
      await Share.share({ message: `${laudo.titulo} — ${laudo.data}` });
    } catch (e) {
      console.log('Erro ao compartilhar', e);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.headerTitle}>Laudos</Text>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {LAUDOS.map((laudo) => (
          <Pressable
            key={laudo.id}
            onPress={() => abrirLaudo(laudo)}
            style={({ pressed }) => [styles.laudoCard, pressed && styles.laudoCardPressed]}
          >
            <View style={styles.laudoIconCircle}>
              <Feather name="file-text" size={18} color={COLORS.white} />
            </View>

            <View style={styles.laudoTextWrapper}>
              <Text style={styles.laudoTitulo}>{laudo.titulo}</Text>
              <Text style={styles.laudoLaboratorio}>{laudo.laboratorio}</Text>
              <Text style={styles.laudoData}>{laudo.data}</Text>
            </View>

            <View style={styles.laudoActions}>
              <Pressable
                hitSlop={8}
                style={styles.laudoActionButton}
                onPress={() => handleBaixar(laudo)}
              >
                <Feather name="download" size={18} color={COLORS.teal} />
              </Pressable>
              <Pressable
                hitSlop={8}
                style={styles.laudoActionButton}
                onPress={() => handleCompartilhar(laudo)}
              >
                <Feather name="share-2" size={18} color={COLORS.orange} />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, paddingHorizontal: 20 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: COLORS.textDark, marginBottom: 20 },
  laudoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  laudoCardPressed: { opacity: 0.85 },
  laudoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  laudoTextWrapper: { flex: 1 },
  laudoTitulo: { color: COLORS.textDark, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  laudoLaboratorio: { color: COLORS.textGray, fontSize: 12, marginBottom: 4 },
  laudoData: { color: COLORS.textGray, fontSize: 12 },
  laudoActions: { alignItems: 'center', gap: 10 },
  laudoActionButton: { padding: 2 },
});