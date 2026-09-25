import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  teal: '#007C94',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
};

type Evento = {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  icone: keyof typeof Feather.glyphMap;
};

// Dados de exemplo — troque pelos dados reais vindos da API quando estiver pronta.
const EVENTOS: Evento[] = [
  {
    id: '1',
    titulo: 'Consulta - Clínico Geral',
    descricao: 'Dr. Riquelme Santos · Clínica Bem estar',
    data: '20/08/2026',
    icone: 'calendar',
  },
  {
    id: '2',
    titulo: 'Hemograma Completo',
    descricao: 'Resultado adicionado aos laudos',
    data: '21/08/2026',
    icone: 'file-text',
  },
  {
    id: '3',
    titulo: 'Prescrição médica',
    descricao: 'Losartana 50mg — uso contínuo',
    data: '20/08/2026',
    icone: 'clipboard',
  },
  {
    id: '4',
    titulo: 'Consulta - Cardiologia',
    descricao: 'Dra. Carla Menezes · Clínica Bem estar',
    data: '02/07/2026',
    icone: 'calendar',
  },
];

export default function HistoricoClinicoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="arrow-left" size={22} color={COLORS.textDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Histórico Clínico</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {EVENTOS.map((evento) => (
          <View key={evento.id} style={styles.eventoCard}>
            <View style={styles.iconCircle}>
              <Feather name={evento.icone} size={18} color={COLORS.white} />
            </View>

            <View style={styles.eventoTextWrapper}>
              <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
              <Text style={styles.eventoDescricao}>{evento.descricao}</Text>
              <Text style={styles.eventoData}>{evento.data}</Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  eventoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventoTextWrapper: {
    flex: 1,
  },
  eventoTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  eventoDescricao: {
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 6,
  },
  eventoData: {
    fontSize: 11,
    color: COLORS.textGray,
  },
});
