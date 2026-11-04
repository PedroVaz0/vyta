import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Laudo } from '../../data/laudos';
import { carregarLaudos, useLaudos } from '../../store/laudos';

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
  const LAUDOS = useLaudos();

  useFocusEffect(
    useCallback(() => {
      carregarLaudos().catch(() => {});
    }, [])
  );

  const abrirLaudo = (laudo: Laudo) => {
    router.push({ pathname: '/laudo-detalhe', params: { id: laudo.id } } as any);
  };

  const handleBaixar = (laudo: Laudo) => {
    if (laudo.url) {
      Linking.openURL(laudo.url).catch(() => {});
    } else {
      Alert.alert('Arquivo indisponível', 'O arquivo original deste laudo ainda não está disponível.');
    }
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
        {LAUDOS.length === 0 && (
          <Text style={{ color: COLORS.textGray, textAlign: 'center', marginTop: 24 }}>
            Nenhum laudo disponível.
          </Text>
        )}

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