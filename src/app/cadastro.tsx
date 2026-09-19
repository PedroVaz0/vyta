import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const COLORS = {
  teal: '#007C94',
  white: '#FFFFFF',
};

export default function CadastroScreen() {
  const { role } = useLocalSearchParams<{ role?: string }>();
  const roleLabel = role === 'medico' ? 'Médico' : 'Paciente';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro — {roleLabel}</Text>
      {/* TODO: adicionar campos de cadastro aqui */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.teal,
  },
});
