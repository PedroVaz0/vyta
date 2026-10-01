import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Alert } from 'react-native';
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

// Troque pelos contatos reais do suporte do Vyta.
const SUPORTE = {
  whatsapp: '5512999999999',
  email: 'suporte@vyta.com.br',
  telefone: '0800 000 0000',
};

const contatos: {
  id: string;
  label: string;
  detalhe: string;
  icon: IconName;
  url: string;
}[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    detalhe: 'Seg a sex, 8h às 18h',
    icon: 'message-circle',
    url: `https://wa.me/${SUPORTE.whatsapp}`,
  },
  {
    id: 'email',
    label: 'E-mail',
    detalhe: SUPORTE.email,
    icon: 'mail',
    url: `mailto:${SUPORTE.email}`,
  },
  {
    id: 'telefone',
    label: 'Telefone',
    detalhe: SUPORTE.telefone,
    icon: 'phone',
    url: `tel:${SUPORTE.telefone.replace(/\s/g, '')}`,
  },
];

const perguntas = [
  {
    id: '1',
    pergunta: 'Como acesso meus laudos?',
    resposta:
      'Na tela inicial, toque em "Início e Laudos". Lá você pode visualizar, baixar e compartilhar cada resultado.',
  },
  {
    id: '2',
    pergunta: 'Como remarcar ou cancelar uma consulta?',
    resposta:
      'Abra "Minhas Consultas", selecione a consulta desejada e escolha a opção de remarcar ou cancelar.',
  },
  {
    id: '3',
    pergunta: 'Meus dados estão seguros?',
    resposta:
      'Sim. Suas informações são protegidas e só são compartilhadas com os profissionais que você autorizar. Você pode ajustar isso em Privacidade e Segurança.',
  },
  {
    id: '4',
    pergunta: 'Esqueci minha senha. E agora?',
    resposta:
      'Na tela de login, toque em "Esqueci minha senha" e siga as instruções enviadas para o seu e-mail.',
  },
  {
    id: '5',
    pergunta: 'Como atualizo meus dados cadastrais?',
    resposta:
      'Vá em Perfil > Editar Perfil, altere as informações e toque em "Salvar alterações".',
  },
];

export default function AjudaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [aberta, setAberta] = useState<string | null>(null);

  const handleContato = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Não foi possível abrir', 'Tente novamente em instantes.');
    }
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
        <Text style={styles.headerTitle}>Ajuda e Suporte</Text>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerIconCircle}>
          <Feather name="help-circle" size={20} color={COLORS.teal} />
        </View>
        <View style={styles.bannerTextWrapper}>
          <Text style={styles.bannerTitle}>Como podemos ajudar?</Text>
          <Text style={styles.bannerSubtitle}>
            Veja as dúvidas frequentes ou fale com a nossa equipe.
          </Text>
        </View>
      </View>

      {/* Perguntas frequentes */}
      <Text style={styles.sectionTitle}>Perguntas frequentes</Text>
      {perguntas.map((item) => {
        const expandida = aberta === item.id;
        return (
          <Pressable
            key={item.id}
            style={[styles.faqCard, expandida && styles.faqCardOpen]}
            onPress={() => setAberta(expandida ? null : item.id)}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqPergunta}>{item.pergunta}</Text>
              <Feather
                name={expandida ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={expandida ? COLORS.tealLight : COLORS.teal}
              />
            </View>
            {expandida && <Text style={styles.faqResposta}>{item.resposta}</Text>}
          </Pressable>
        );
      })}

      {/* Contato */}
      <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
        Fale com a gente
      </Text>
      {contatos.map((contato) => (
        <Pressable
          key={contato.id}
          style={styles.contatoCard}
          onPress={() => handleContato(contato.url)}
        >
          <View style={styles.contatoIconCircle}>
            <Feather name={contato.icon} size={18} color={COLORS.white} />
          </View>
          <View style={styles.contatoTextWrapper}>
            <Text style={styles.contatoLabel}>{contato.label}</Text>
            <Text style={styles.contatoDetalhe}>{contato.detalhe}</Text>
          </View>
          <Feather name="chevron-right" size={20} color={COLORS.orange} />
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
  banner: {
    backgroundColor: COLORS.teal,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  bannerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bannerTextWrapper: {
    flex: 1,
  },
  bannerTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: COLORS.white,
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  sectionTitleSpaced: {
    marginTop: 14,
  },
  faqCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  faqCardOpen: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.tealLight,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  faqPergunta: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  faqResposta: {
    fontSize: 13,
    color: COLORS.textGray,
    lineHeight: 19,
    marginTop: 10,
  },
  contatoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contatoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contatoTextWrapper: {
    flex: 1,
  },
  contatoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  contatoDetalhe: {
    fontSize: 12,
    color: COLORS.textGray,
  },
});
