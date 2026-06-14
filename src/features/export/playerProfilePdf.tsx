import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import i18n from "../../i18n";
import { SKILL_CATEGORIES } from "../../domain/logic/skillTrends";
import type { Player } from "../../domain/models/Player";
import type { Goal } from "../../domain/models/Goal";
import type { Evaluation } from "../../domain/models/Evaluation";

export interface PlayerProfileInput {
  player: Player;
  goals: Goal[];
  evaluations: Evaluation[];
}

const COLORS = {
  accent: "#00b85f",
  ink: "#1a1d2b",
  muted: "#5f6580",
  line: "#dde1ec",
  track: "#eef0f5",
};

const s = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    color: COLORS.ink,
    fontFamily: "Helvetica",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  brand: { fontSize: 9, color: COLORS.accent, fontFamily: "Helvetica-Bold" },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", marginTop: 8 },
  subtitle: { fontSize: 10, color: COLORS.muted, marginTop: 2 },
  metaRow: { flexDirection: "row", gap: 18, marginTop: 8 },
  metaLabel: { fontSize: 8, color: COLORS.muted, textTransform: "uppercase" },
  metaValue: { fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 1 },
  rule: { borderBottomWidth: 1, borderBottomColor: COLORS.line, marginVertical: 14 },
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    color: COLORS.accent,
  },
  skillRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  skillName: { width: 90, fontSize: 9 },
  barTrack: {
    flex: 1,
    height: 7,
    backgroundColor: COLORS.track,
    borderRadius: 3,
  },
  barFill: { height: 7, backgroundColor: COLORS.accent, borderRadius: 3 },
  skillVal: { width: 22, textAlign: "right", fontSize: 9 },
  listItem: { flexDirection: "row", marginBottom: 3 },
  bullet: { width: 10, color: COLORS.accent },
  listText: { flex: 1, fontSize: 9 },
  tag: { fontSize: 8, color: COLORS.muted },
  evalItem: {
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.line,
  },
  evalHead: { flexDirection: "row", justifyContent: "space-between" },
  evalDate: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  evalNotes: { fontSize: 9, color: COLORS.muted, marginTop: 2 },
  empty: { fontSize: 9, color: COLORS.muted },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    fontSize: 8,
    color: COLORS.muted,
    textAlign: "center",
  },
});

function avg(e: Evaluation): string {
  if (e.skillRatings.length === 0) return "–";
  const m = e.skillRatings.reduce((a, r) => a + r.rating, 0) / e.skillRatings.length;
  return m.toFixed(1);
}

function PlayerProfileDocument({ player, goals, evaluations }: PlayerProfileInput) {
  const t = i18n.t.bind(i18n);
  const today = new Date().toISOString().slice(0, 10);
  const recentEvals = [...evaluations]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <Document
      title={`${t("export.playerProfileTitle")} – ${player.name}`}
      author="KickerCoach"
    >
      <Page size="A4" style={s.page}>
        <View style={s.headerRow}>
          <Text style={s.brand}>KICKERCOACH</Text>
        </View>
        <Text style={s.title}>{player.name}</Text>
        <Text style={s.subtitle}>
          {t("export.playerProfileTitle")}
          {player.nickname ? ` · „${player.nickname}“` : ""}
        </Text>

        <View style={s.metaRow}>
          <View>
            <Text style={s.metaLabel}>{t("export.position")}</Text>
            <Text style={s.metaValue}>
              {t(`constants.position.${player.preferredPosition}`)}
            </Text>
          </View>
          <View>
            <Text style={s.metaLabel}>{t("export.level")}</Text>
            <Text style={s.metaValue}>
              {t(`constants.difficulty.${player.level}`)}
            </Text>
          </View>
        </View>

        <View style={s.rule} />

        {/* Skills */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{t("export.skills")}</Text>
          {SKILL_CATEGORIES.map((cat) => {
            const val = player.skillRatings[cat] ?? 0;
            return (
              <View key={cat} style={s.skillRow}>
                <Text style={s.skillName}>{t(`constants.category.${cat}`)}</Text>
                <View style={s.barTrack}>
                  <View style={[s.barFill, { width: `${(val / 5) * 100}%` }]} />
                </View>
                <Text style={s.skillVal}>{val}/5</Text>
              </View>
            );
          })}
        </View>

        {/* Goals */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{t("export.goals")}</Text>
          {goals.length === 0 ? (
            <Text style={s.empty}>{t("export.noData")}</Text>
          ) : (
            goals.map((g) => (
              <View key={g.id} style={s.listItem}>
                <Text style={s.bullet}>•</Text>
                <Text style={s.listText}>{g.title}</Text>
                <Text style={s.tag}>{t(`constants.goalStatus.${g.status}`)}</Text>
              </View>
            ))
          )}
        </View>

        {/* Recent evaluations */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{t("export.evaluations")}</Text>
          {recentEvals.length === 0 ? (
            <Text style={s.empty}>{t("export.noData")}</Text>
          ) : (
            recentEvals.map((e) => (
              <View key={e.id} style={s.evalItem}>
                <View style={s.evalHead}>
                  <Text style={s.evalDate}>{e.date}</Text>
                  <Text style={s.tag}>Ø {avg(e)}/5</Text>
                </View>
                {e.notes ? <Text style={s.evalNotes}>{e.notes}</Text> : null}
              </View>
            ))
          )}
        </View>

        <Text style={s.footer} fixed>
          {t("export.generatedOn", { date: today })} · KickerCoach
        </Text>
      </Page>
    </Document>
  );
}

/** Render a player profile to a PDF Blob. Heavy — call via dynamic import. */
export async function generatePlayerProfilePdf(
  input: PlayerProfileInput,
): Promise<Blob> {
  return pdf(<PlayerProfileDocument {...input} />).toBlob();
}
