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
  danger: '#E03131',
};

// Dados de exemplo — troque pelos dados reais do médico logado quando o backend estiver pronto.
const medico = {
  nome: 'Dr. Riquelme Santos',
  especialidade: 'Clínico Geral',
  crm: 'CRM 123456-SP',
  email: 'riquelme.santos@email.com',
};

const opcoes = [
  { id: 'editar', label: 'Editar Perfil', icon: 'user' as const },
  { id: 'horarios', label: 'Horários de Atendimento', icon: 'clock' as const },
  { id: 'notificacoes', label: 'Notificações', icon: 'bell' as const },
  { id: 'privacidade', label: 'Privacidade e Segurança', icon: 'lock' as const },
  { id: 'ajuda', label: 'Ajuda e Suporte', icon: 'help-circle' as const },
];

export default function PerfilMedicoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSair = () => {
    // TODO: quando o login real existir, limpe aqui o token/sessão guardados
    router.replace('/');
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
      <Text style={styles.headerTitle}>Perfil</Text>

      {/* Avatar + informações */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Feather name="user" size={32} color={COLORS.white} />
        </View>

        <Text style={styles.nome}>{medico.nome}</Text>
        <Text style={styles.especialidade}>{medico.especialidade}</Text>

        <View style={styles.crmBadge}>
          <Feather name="award" size={13} color={COLORS.teal} />
          <Text style={styles.crmText}>{medico.crm}</Text>
        </View>

        <Text style={styles.email}>{medico.email}</Text>
      </View>

      {/* Lista de opções */}
      <View style={styles.optionsList}>
        {opcoes.map((opcao) => (
          <Pressable key={opcao.id} style={styles.optionRow}>
            <View style={styles.optionIconCircle}>
              <Feather name={opcao.icon} size={18} color={COLORS.teal} />
            </View>

            <Text style={styles.optionLabel}>{opcao.label}</Text>

            <Feather name="chevron-right" size={20} color={COLORS.textGray} />
          </Pressable>
        ))}
      </View>

      {/* Botão sair */}
      <Pressable style={styles.logoutButton} onPress={handleSair}>
        <Feather name="log-out" size={18} color={COLORS.danger} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </Pressable>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 20,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    paddingVertical: 24,
    marginBottom: 24,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  especialidade: {
    fontSize: 13,
    color: COLORS.textGray,
    marginBottom: 10,
  },
  crmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  crmText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.teal,
  },
  email: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  optionsList: {
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: 15,
    fontWeight: '700',
  },
});
