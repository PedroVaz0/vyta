import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusConsulta, useConsultas } from "../../store/consultas";

const COLORS = {
    teal: "#007C94",
    orange: "#FF7A59",
    white: "#FFFFFF",
    textDark: "#1A1A1A",
    textGray: "#6B6B6B",
    cardBg: "#E9F6FA",
    successBg: "#E4F7EC",
    successText: "#1E8E4F",
    pendingBg: "#E9F6FA",
    pendingText: "#007C94",
    canceledBg: "#FBE9E9",
    canceledText: "#C0392B",
};

const FILTROS: { id: StatusConsulta | "todas"; label: string }[] = [
    { id: "todas", label: "Todas" },
    { id: "agendada", label: "Agendadas" },
    { id: "concluida", label: "Concluídas" },
    { id: "cancelada", label: "Canceladas" },
];

const STATUS_LABEL: Record<StatusConsulta, string> = {
    agendada: "Agendada",
    concluida: "Concluída",
    cancelada: "Cancelada",
};

export default function ConsultasScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const CONSULTAS = useConsultas();
    const [filtroAtivo, setFiltroAtivo] = useState<StatusConsulta | "todas">("todas");

    const consultasFiltradas = useMemo(() => {
        if (filtroAtivo === "todas") return CONSULTAS;
        return CONSULTAS.filter((c) => c.status === filtroAtivo);
    }, [filtroAtivo, CONSULTAS]);

    const totalAgendadas = CONSULTAS.filter((c) => c.status === "agendada").length;

    const abrirConsulta = (id: string | number) => {
        router.push({
            pathname: "/consulta-detalhe",
            params: { id: String(id) },
        } as any);
    };

    const badgeStyle = (status: StatusConsulta) => {
        switch (status) {
            case "agendada":
                return { bg: styles.badgeAgendadaBg, text: styles.badgeAgendadaText };
            case "concluida":
                return {
                    bg: styles.badgeConcluidaBg,
                    text: styles.badgeConcluidaText,
                };
            case "cancelada":
                return {
                    bg: styles.badgeCanceladaBg,
                    text: styles.badgeCanceladaText,
                };
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            {/* Cabeçalho */}
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.headerTitle}>Consultas</Text>
                    <Text style={styles.headerSubtitle}>
                        {totalAgendadas} consulta{totalAgendadas !== 1 ? "s" : ""} agendada
                        {totalAgendadas !== 1 ? "s" : ""}
                    </Text>
                </View>

                <Pressable style={styles.newButton} onPress={() => router.push("/nova-consulta")}>
                    <Feather name="plus" size={16} color={COLORS.white} />
                    <Text style={styles.newButtonText}>Nova</Text>
                </Pressable>
            </View>

            {/* Filtros por status */}
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
                            <Text style={[styles.filterChipText, ativo && styles.filterChipTextAtivo]}>
                                {filtro.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* Lista de consultas */}
            <ScrollView
                style={styles.list}
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
                showsVerticalScrollIndicator={false}
            >
                {consultasFiltradas.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Feather name="calendar" size={36} color={COLORS.textGray} />
                        <Text style={styles.emptyStateText}>Nenhuma consulta encontrada nesse filtro.</Text>
                    </View>
                ) : (
                    consultasFiltradas.map((consulta) => {
                        const badge = badgeStyle(consulta.status);
                        return (
                            <Pressable
                                key={consulta.id}
                                onPress={() => abrirConsulta(consulta.id)}
                                style={({ pressed }) => [styles.consultaCard, pressed && styles.consultaCardPressed]}
                            >
                                <View style={styles.consultaTopRow}>
                                    <View style={styles.consultaIconCircle}>
                                        <Feather name="calendar" size={18} color={COLORS.white} />
                                    </View>

                                    <View style={styles.consultaTextWrapper}>
                                        <Text style={styles.consultaMedico}>{consulta.medico}</Text>
                                        <Text style={styles.consultaEspecialidade}>{consulta.especialidade}</Text>
                                        <Text style={styles.consultaClinica}>{consulta.clinica}</Text>
                                    </View>

                                    <View style={[styles.statusBadge, badge.bg]}>
                                        <Text style={[styles.statusBadgeText, badge.text]}>
                                            {STATUS_LABEL[consulta.status]}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.consultaBottomRow}>
                                    <View style={styles.dataHorarioRow}>
                                        <Feather name="clock" size={13} color={COLORS.textGray} />
                                        <Text style={styles.consultaDataHorario}>
                                            {consulta.data} às {consulta.horario}
                                        </Text>
                                    </View>

                                    {consulta.status === "agendada" && (
                                        <View style={styles.consultaActions}>
                                            <Pressable hitSlop={8} style={styles.actionButton}>
                                                <Feather name="edit-2" size={16} color={COLORS.teal} />
                                            </Pressable>
                                            <Pressable hitSlop={8} style={styles.actionButton}>
                                                <Feather name="x-circle" size={16} color={COLORS.canceledText} />
                                            </Pressable>
                                        </View>
                                    )}
                                </View>
                            </Pressable>
                        );
                    })
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
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: COLORS.textDark,
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 13,
        color: COLORS.textGray,
    },
    newButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: COLORS.orange,
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    newButtonText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: "700",
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
        fontWeight: "600",
        color: COLORS.teal,
    },
    filterChipTextAtivo: {
        color: COLORS.white,
    },
    list: {
        flex: 1,
    },
    consultaCard: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 16,
        padding: 14,
        marginBottom: 14,
    },
    consultaCardPressed: {
        opacity: 0.85,
    },
    consultaTopRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    consultaIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.teal,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    consultaTextWrapper: {
        flex: 1,
    },
    consultaMedico: {
        color: COLORS.textDark,
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 2,
    },
    consultaEspecialidade: {
        color: COLORS.textGray,
        fontSize: 12,
    },
    consultaClinica: {
        color: COLORS.textGray,
        fontSize: 12,
    },
    statusBadge: {
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    statusBadgeText: {
        fontSize: 11,
        fontWeight: "700",
    },
    badgeAgendadaBg: {
        backgroundColor: COLORS.pendingBg,
    },
    badgeAgendadaText: {
        color: COLORS.pendingText,
    },
    badgeConcluidaBg: {
        backgroundColor: COLORS.successBg,
    },
    badgeConcluidaText: {
        color: COLORS.successText,
    },
    badgeCanceladaBg: {
        backgroundColor: COLORS.canceledBg,
    },
    badgeCanceladaText: {
        color: COLORS.canceledText,
    },
    consultaBottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    dataHorarioRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    consultaDataHorario: {
        color: COLORS.textGray,
        fontSize: 12,
    },
    consultaActions: {
        flexDirection: "row",
        gap: 16,
    },
    actionButton: {
        padding: 2,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        gap: 12,
    },
    emptyStateText: {
        color: COLORS.textGray,
        fontSize: 14,
        textAlign: "center",
    },
});