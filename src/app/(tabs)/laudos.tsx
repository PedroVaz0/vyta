import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
};

type Laudo = {
  id: string;
  titulo: string;
  laboratorio: string;
  data: string;
};

// Dados de exemplo — troque pelos dados reais vindos da API quando estiver pronta.
const LAUDOS: Laudo[] = [
  {
    id: '1',
    titulo: 'Hemograma Completo',
    laboratorio: 'Labotário Oswaldo Cruz',
    data: '21/08/2026',
  },
  {
    id: '2',
    titulo: 'Raio-X do Tórax',
    laboratorio: 'Clínica Bem Estar',
    data: '17/06/2026',
  },
  {
    id: '3',
    titulo: 'Exame de Urina Tipo I',
    laboratorio: 'Labotário Oswaldo Cruz',
    data: '02/03/2026',
  },
  {
    id: '4',
    titulo: 'Glicemia em Jejum',
    laboratorio: 'Labotário Oswaldo Cruz',
    data: '15/01/2026',
  },
];

export default function LaudosScreen() {
  const insets = useSafeAreaInsets();

  const handleBaixar = (titulo: string) => {
    // TODO: quando o backend tiver a URL real do arquivo, baixe/abra aqui.
    console.log('Baixar laudo', titulo);
  };

  const handleCompartilhar = async (titulo: string, data: string) => {
    try {
      await Share.share({ message: `${titulo} — ${data}` });
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
          <View key={laudo.id} style={styles.laudoCard}>
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
                onPress={() => handleBaixar(laudo.titulo)}
              >
                <Feather name="download" size={18} color={COLORS.teal} />
              </Pressable>
              <Pressable
                hitSlop={8}
                style={styles.laudoActionButton}
                onPress={() => handleCompartilhar(laudo.titulo, laudo.data)}
              >
                <Feather name="share-2" size={18} color={COLORS.orange} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 20,
  },
  laudoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  laudoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  laudoTextWrapper: {
    flex: 1,
  },
  laudoTitulo: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  laudoLaboratorio: {
    color: COLORS.textGray,
    fontSize: 12,
    marginBottom: 4,
  },
  laudoData: {
    color: COLORS.textGray,
    fontSize: 12,
  },
  laudoActions: {
    alignItems: 'center',
    gap: 10,
  },
  laudoActionButton: {
    padding: 2,
  },
});