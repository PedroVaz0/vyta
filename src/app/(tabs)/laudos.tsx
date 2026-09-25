import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  teal: '#007C94',
  orange: '#FF7A59',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textGray: '#6B6B6B',
  cardBg: '#E9F6FA',
  border: '#D9D9D9',
  successBg: '#E4F7EC',
  successText: '#1E8E4F',
  pendingBg: '#FFF3E0',
  pendingText: '#B8720A',
};

type Categoria = 'sangue' | 'imagem' | 'urina' | 'outros';
type Status = 'pronto' | 'pendente';

type Laudo = {
  id: string;
  titulo: string;
  laboratorio: string;
  medico: string;
  data: string;
  categoria: Categoria;
  status: Status;
};

// Dados de exemplo — troque pelos dados reais vindos da API quando estiver pronta.
const LAUDOS: Laudo[] = [
  {
    id: '1',
    titulo: 'Hemograma Completo',
    laboratorio: 'Labotário Oswaldo Cruz',
    medico: 'Dr. Riquelme Santos',
    data: '21/08/2026',
    categoria: 'sangue',
    status: 'pronto',
  },
  {
    id: '2',
    titulo: 'Raio-X do Tórax',
    laboratorio: 'Clínica Bem Estar',
    medico: 'Dra. Carla Menezes',
    data: '17/06/2026',
    categoria: 'imagem',
    status: 'pronto',
  },
  {
    id: '3',
    titulo: 'Exame de Urina Tipo I',
    laboratorio: 'Labotário Oswaldo Cruz',
    medico: 'Dr. Riquelme Santos',
    data: '02/03/2026',
    categoria: 'urina',
    status: 'pronto',
  },
  {
    id: '4',
    titulo: 'Ultrassom Abdominal',
    laboratorio: 'Clínica Bem Estar',
    medico: 'Dra. Carla Menezes',
    data: '28/02/2026',
    categoria: 'imagem',
    status: 'pendente',
  },
  {
    id: '5',
    titulo: 'Glicemia em Jejum',
    laboratorio: 'Labotário Oswaldo Cruz',
    medico: 'Dr. Riquelme Santos',
    data: '15/01/2026',
    categoria: 'sangue',
    status: 'pronto',
  },
  {
    id: '6',
    titulo: 'Eletrocardiograma',
    laboratorio: 'Clínica Bem Estar',
    medico: 'Dr. André Lima',
    data: '03/12/2025',
    categoria: 'outros',
    status: 'pronto',
  },
];

const FILTROS: { id: Categoria | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'sangue', label: 'Sangue' },
  { id: 'imagem', label: 'Imagem' },
  { id: 'urina', label: 'Urina' },
  { id: 'outros', label: 'Outros' },
];

const ICONE_CATEGORIA: Record<Categoria, keyof typeof Feather.glyphMap> = {
  sangue: 'droplet',
  imagem: 'image',
  urina: 'file-text',
  outros: 'clipboard',
};

export default function LaudosScreen() {
  const insets = useSafeAreaInsets();
  const [busca, setBusca] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState<Categoria | 'todos'>('todos');

  const laudosFiltrados = useMemo(() => {
    return LAUDOS.filter((laudo) => {
      const combinaCategoria =
        filtroAtivo === 'todos' || laudo.categoria === filtroAtivo;
      const combinaBusca = laudo.titulo
        .toLowerCase()
        .includes(busca.trim().toLowerCase());
      return combinaCategoria && combinaBusca;
    });
  }, [busca, filtroAtivo]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Cabeçalho */}
      <Text style={styles.headerTitle}>Laudos</Text>
      <Text style={styles.headerSubtitle}>
        {LAUDOS.length} laudo{LAUDOS.length !== 1 ? 's' : ''} no total
      </Text>

      {/* Busca */}
      <View style={styles.searchWrapper}>
        <Feather name="search" size={18} color={COLORS.textGray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar laudo..."
          placeholderTextColor={COLORS.textGray}
          value={busca}
          onChangeText={setBusca}
        />
        {busca.length > 0 && (
          <Pressable onPress={() => setBusca('')} hitSlop={8}>
            <Feather name="x" size={18} color={COLORS.textGray} />
          </Pressable>
        )}
      </View>

      {/* Filtros por categoria */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {FILTROS.map((filtro) => {
          const ativo = filtroAtivo === filtro.id;
          return (
            <Pressable
              key={filtro.id}
              style={[styles.filterChip, ativo && styles.filterChipAtivo]}
              onPress={() => setFiltroAtivo(filtro.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  ativo && styles.filterChipTextAtivo,
                ]}
              >
                {filtro.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Lista de laudos */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {laudosFiltrados.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="folder" size={36} color={COLORS.textGray} />
            <Text style={styles.emptyStateText}>
              Nenhum laudo encontrado para essa busca.
            </Text>
          </View>
        ) : (
          laudosFiltrados.map((laudo) => (
            <View key={laudo.id} style={styles.laudoCard}>
              <View style={styles.laudoTopRow}>
                <View style={styles.laudoIconCircle}>
                  <Feather
                    name={ICONE_CATEGORIA[laudo.categoria]}
                    size={18}
                    color={COLORS.white}
                  />
                </View>

                <View style={styles.laudoTextWrapper}>
                  <Text style={styles.laudoTitulo}>{laudo.titulo}</Text>
                  <Text style={styles.laudoLaboratorio}>
                    {laudo.laboratorio}
                  </Text>
                  <Text style={styles.laudoMedico}>{laudo.medico}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    laudo.status === 'pronto'
                      ? styles.statusBadgePronto
                      : styles.statusBadgePendente,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      laudo.status === 'pronto'
                        ? styles.statusBadgeTextPronto
                        : styles.statusBadgeTextPendente,
                    ]}
                  >
                    {laudo.status === 'pronto' ? 'Pronto' : 'Pendente'}
                  </Text>
                </View>
              </View>

              <View style={styles.laudoBottomRow}>
                <Text style={styles.laudoData}>{laudo.data}</Text>

                {laudo.status === 'pronto' && (
                  <View style={styles.laudoActions}>
                    <Pressable hitSlop={8} style={styles.laudoActionButton}>
                      <Feather
                        name="download"
                        size={18}
                        color={COLORS.teal}
                      />
                    </Pressable>
                    <Pressable hitSlop={8} style={styles.laudoActionButton}>
                      <Feather
                        name="share-2"
                        size={18}
                        color={COLORS.orange}
                      />
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
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
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textGray,
    marginBottom: 16,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  filtersScroll: {
    flexGrow: 0,
    marginBottom: 16,
  },
  filtersContent: {
    gap: 10,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
  },
  filterChipAtivo: {
    backgroundColor: COLORS.teal,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.teal,
  },
  filterChipTextAtivo: {
    color: COLORS.white,
  },
  list: {
    flex: 1,
  },
  laudoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  laudoTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  },
  laudoMedico: {
    color: COLORS.textGray,
    fontSize: 12,
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusBadgePronto: {
    backgroundColor: COLORS.successBg,
  },
  statusBadgePendente: {
    backgroundColor: COLORS.pendingBg,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadgeTextPronto: {
    color: COLORS.successText,
  },
  statusBadgeTextPendente: {
    color: COLORS.pendingText,
  },
  laudoBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  laudoData: {
    color: COLORS.textGray,
    fontSize: 12,
  },
  laudoActions: {
    flexDirection: 'row',
    gap: 16,
  },
  laudoActionButton: {
    padding: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateText: {
    color: COLORS.textGray,
    fontSize: 14,
    textAlign: 'center',
  },
});