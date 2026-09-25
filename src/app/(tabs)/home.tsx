import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Share } from 'react-native';

const COLORS = {
  teal: '#007C94',
  tealLight: '#0EA5B7',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
  danger: '#E03131',
};

// Dados de exemplo — troque pelos dados reais vindos da API quando estiver pronta.
const proximaConsulta = {
  data: '05 de novembro - 14:00',
  clinica: 'Clínica Bem estar',
  medico: 'Dr. Riquelme Santos',
};

const laudos = [
  {
    id: '1',
    titulo: 'Laudo de Exame de Sangue',
    laboratorio: 'Labotário Oswaldo Cruz',
    data: '21/08/2026',
  },
  {
    id: '2',
    titulo: 'Laudo de Exame de Sangue',
    laboratorio: 'Labotário Oswaldo Cruz',
    data: '17/06/2026',
  },
  {
    id: '3',
    titulo: 'Laudo de Exame de Sangue',
    laboratorio: 'Labotário Oswaldo Cruz',
    data: '02/03/2026',
  },
];

export default function PacienteHomeScreen() {
  const nomePaciente = 'Maperi Julu'; // troque pelo nome vindo do usuário logado
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleCompartilharLaudo = async (titulo: string, data: string) => {
    try {
      await Share.share({
        message: `${titulo} — ${data}`,
      });
    } catch (e) {
      console.log('Erro ao compartilhar', e);
    }
  };

  const handleBaixarLaudo = (titulo: string) => {
    // TODO: quando o backend tiver a URL real do arquivo, baixe/abra aqui.
    console.log('Baixar laudo', titulo);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Image
            source={require('../../components/VytaLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandText}>vyta</Text>
        </View>

        <Pressable
          style={styles.bellButton}
          onPress={() => router.push('/notificacoes')}
        >
          <Feather name="bell" size={24} color={COLORS.teal} />
        </Pressable>
      </View>

      {/* Saudação */}
      <Text style={styles.greeting}>Olá, {nomePaciente}</Text>
      <Text style={styles.subGreeting}>Como está se sentindo hoje?</Text>

      {/* Próxima consulta */}
      <Pressable
        style={styles.consultaCard}
        onPress={() => router.push('/consultas')}
      >
        <View style={styles.consultaIconCircle}>
          <Feather name="calendar" size={18} color={COLORS.teal} />
        </View>

        <View style={styles.consultaTextWrapper}>
          <Text style={styles.consultaLabel}>Próxima consulta</Text>
          <Text style={styles.consultaData}>{proximaConsulta.data}</Text>

          <Text style={styles.consultaClinica}>{proximaConsulta.clinica}</Text>
          <Text style={styles.consultaMedico}>{proximaConsulta.medico}</Text>
        </View>

        <View style={styles.consultaArrowCircle}>
          <Feather name="chevron-right" size={18} color={COLORS.teal} />
        </View>
      </Pressable>

      {/* Atalhos */}
      <View style={styles.shortcutsRow}>
        <Pressable
          style={styles.shortcutCard}
          onPress={() => router.push('/historico-clinico')}
        >
          <Feather name="file-text" size={20} color={COLORS.orange} />
          <View style={styles.shortcutLabelRow}>
            <Text style={styles.shortcutText}>Histórico Clínico</Text>
            <Feather name="chevron-right" size={16} color={COLORS.teal} />
          </View>
        </Pressable>

        <Pressable
          style={[styles.shortcutCard, styles.shortcutCardSelected]}
          onPress={() => router.push('/consultas')}
        >
          <Feather name="message-square" size={20} color={COLORS.orange} />
          <View style={styles.shortcutLabelRow}>
            <Text style={[styles.shortcutText, styles.shortcutTextSelected]}>
              Minhas Consultas
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Início e Laudos */}
      <Pressable
        style={styles.sectionTitleRow}
        onPress={() => router.push('/laudos')}
      >
        <Text style={styles.sectionTitle}>Início e Laudos</Text>
        <Feather name="chevron-right" size={18} color={COLORS.teal} />
      </Pressable>

      {laudos.map((laudo) => (
        <Pressable
          key={laudo.id}
          style={styles.laudoCard}
          onPress={() => router.push('/laudos')}
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
              onPress={(e) => {
                e.stopPropagation();
                handleBaixarLaudo(laudo.titulo);
              }}
            >
              <Feather name="download" size={18} color={COLORS.teal} />
            </Pressable>
            <Pressable
              hitSlop={8}
              style={styles.laudoActionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleCompartilharLaudo(laudo.titulo, laudo.data);
              }}
            >
              <Feather name="share-2" size={18} color={COLORS.orange} />
            </Pressable>
          </View>
        </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.orange,
  },
  bellButton: {
    position: 'relative',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
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
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  consultaIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    fontWeight: '700',
    marginBottom: 14,
  },
  consultaClinica: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  consultaMedico: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  consultaArrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginLeft: 8,
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 28,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  shortcutCardSelected: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.tealLight,
  },
  shortcutLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  shortcutText: {
    color: COLORS.teal,
    fontSize: 13,
    fontWeight: '700',
  },
  shortcutTextSelected: {
    color: COLORS.tealLight,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  laudoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 6,
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