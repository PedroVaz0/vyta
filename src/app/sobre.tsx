import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

type IconName = React.ComponentProps<typeof Feather>['name'];

const VERSAO = '1.0.0'; // TODO: pegar de expo-constants (Constants.expoConfig?.version)

const destaques: { id: string; icon: IconName; titulo: string; texto: string }[] = [
  {
    id: 'historico',
    icon: 'file-text',
    titulo: 'Histórico centralizado',
    texto: 'Laudos, exames e consultas reunidos em um só lugar.',
  },
  {
    id: 'consultas',
    icon: 'calendar',
    titulo: 'Consultas sob controle',
    texto: 'Acompanhe e organize seus próximos atendimentos.',
  },
  {
    id: 'seguranca',
    icon: 'shield',
    titulo: 'Seus dados protegidos',
    texto: 'Você decide quem pode ver as suas informações.',
  },
];

// Troque pelas URLs reais.
const links: { id: string; label: string; icon: IconName; url: string }[] = [
  {
    id: 'termos',
    label: 'Termos de Uso',
    icon: 'file-text',
    url: 'https://vyta.com.br/termos',
  },
  {
    id: 'privacidade',
    label: 'Política de Privacidade',
    icon: 'lock',
    url: 'https://vyta.com.br/privacidade',
  },
  {
    id: 'site',
    label: 'Visite nosso site',
    icon: 'globe',
    url: 'https://vyta.com.br',
  },
];

export default function SobreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const abrirLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      console.log('Não foi possível abrir', url);
    });
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
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={22} color={COLORS.teal} />
        </Pressable>
        <Text style={styles.headerTitle}>Sobre o Vyta</Text>
      </View>

      {/* Marca */}
      <View style={styles.brandCard}>
        <Image
          // Ajuste o caminho conforme a localização desta tela no projeto.
          source={require('../components/VytaLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.brandText}>vyta</Text>
        <Text style={styles.brandTagline}>
          Sua saúde, simples e ao seu alcance.
        </Text>
        <View style={styles.versionPill}>
          <Text style={styles.versionText}>Versão {VERSAO}</Text>
        </View>
      </View>

      {/* Missão */}
      <Text style={styles.sectionTitle}>Nossa missão</Text>
      <Text style={styles.paragraph}>
        O Vyta nasceu para aproximar você do cuidado com a sua saúde. Reunimos
        seus laudos, consultas e informações clínicas em um app simples,
        seguro e fácil de usar, para que você tenha tudo na palma da mão
        quando precisar.
      </Text>

      {/* Destaques */}
      <Text style={styles.sectionTitle}>O que oferecemos</Text>
      {destaques.map((item) => (
        <View key={item.id} style={styles.destaqueCard}>
          <View style={styles.destaqueIconCircle}>
            <Feather name={item.icon} size={18} color={COLORS.white} />
          </View>
          <View style={styles.destaqueTextWrapper}>
            <Text style={styles.destaqueTitulo}>{item.titulo}</Text>
            <Text style={styles.destaqueTexto}>{item.texto}</Text>
          </View>
        </View>
      ))}

      {/* Links */}
      <View style={styles.linksList}>
        {links.map((link) => (
          <Pressable
            key={link.id}
            style={styles.linkRow}
            onPress={() => abrirLink(link.url)}
          >
            <View style={styles.linkIconCircle}>
              <Feather name={link.icon} size={18} color={COLORS.teal} />
            </View>
            <Text style={styles.linkLabel}>{link.label}</Text>
            <Feather name="chevron-right" size={20} color={COLORS.textGray} />
          </Pressable>
        ))}
      </View>

      <Text style={styles.footer}>
        © {new Date().getFullYear()} Vyta. Todos os direitos reservados.
      </Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  brandCard: {
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: 8,
  },
  brandText: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.orange,
    marginBottom: 4,
  },
  brandTagline: {
    fontSize: 14,
    color: COLORS.textGray,
    textAlign: 'center',
    marginBottom: 14,
  },
  versionPill: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.teal,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  paragraph: {
    fontSize: 14,
    color: COLORS.textGray,
    lineHeight: 21,
    marginBottom: 28,
  },
  destaqueCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  destaqueIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  destaqueTextWrapper: {
    flex: 1,
  },
  destaqueTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  destaqueTexto: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  linksList: {
    marginTop: 16,
    marginBottom: 24,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  linkIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  linkLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  footer: {
    fontSize: 12,
    color: COLORS.textGray,
    textAlign: 'center',
  },
});
