import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
};

type Notificacao = {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  lida: boolean;
  icone: keyof typeof Feather.glyphMap;
};

// Dados de exemplo — troque pelos dados reais vindos da API quando estiver pronta.
const NOTIFICACOES: Notificacao[] = [
  {
    id: '1',
    titulo: 'Consulta amanhã às 14:00',
    descricao: 'Dr. Riquelme Santos · Clínica Bem estar',
    data: 'Hoje',
    lida: false,
    icone: 'calendar',
  },
  {
    id: '2',
    titulo: 'Novo laudo disponível',
    descricao: 'Hemograma Completo já está pronto',
    data: 'Ontem',
    lida: false,
    icone: 'file-text',
  },
  {
    id: '3',
    titulo: 'Lembrete de medicação',
    descricao: 'Não esqueça de tomar sua medicação às 20h',
    data: '2 dias atrás',
    lida: true,
    icone: 'bell',
  },
];

export default function NotificacoesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Feather name="arrow-left" size={22} color={COLORS.textDark} />
        </Pressable>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {NOTIFICACOES.map((notificacao) => (
          <View
            key={notificacao.id}
            style={[
              styles.notificacaoCard,
              !notificacao.lida && styles.notificacaoNaoLida,
            ]}
          >
            <View style={styles.iconCircle}>
              <Feather
                name={notificacao.icone}
                size={18}
                color={COLORS.white}
              />
            </View>

            <View style={styles.notificacaoTextWrapper}>
              <Text style={styles.notificacaoTitulo}>
                {notificacao.titulo}
              </Text>
              <Text style={styles.notificacaoDescricao}>
                {notificacao.descricao}
              </Text>
              <Text style={styles.notificacaoData}>{notificacao.data}</Text>
            </View>

            {!notificacao.lida && <View style={styles.dotNaoLida} />}
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
  notificacaoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  notificacaoNaoLida: {
    backgroundColor: COLORS.cardBg,
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
  notificacaoTextWrapper: {
    flex: 1,
  },
  notificacaoTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  notificacaoDescricao: {
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 6,
  },
  notificacaoData: {
    fontSize: 11,
    color: COLORS.textGray,
  },
  dotNaoLida: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.orange,
    marginTop: 4,
  },
});
