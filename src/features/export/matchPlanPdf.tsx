import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import i18n from "../../i18n";
import type { MatchPlan } from "../../domain/models/MatchPlan";

export interface MatchPlanInput {
  plan: MatchPlan;
  offensiveStrategyName?: string;
  defensiveStrategyName?: string;
}

const COLORS = {
  accent: "#00b85f",
  ink: "#1a1d2b",
  muted: "#5f6580",
  line: "#dde1ec",
};

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 10, color: COLORS.ink, fontFamily: "Helvetica" },
  brand: { fontSize: 9, color: COLORS.accent, fontFamily: "Helvetica-Bold" },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", marginTop: 8 },
  subtitle: { fontSize: 10, color: COLORS.muted, marginTop: 2 },
  rule: { borderBottomWidth: 1, borderBottomColor: COLORS.line, marginVertical: 14 },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: COLORS.accent,
  },
  body: { fontSize: 10, lineHeight: 1.4, color: COLORS.ink },
  empty: { fontSize: 9, color: COLORS.muted },
  metaRow: { flexDirection: "row", gap: 18, marginTop: 8 },
  metaLabel: { fontSize: 8, color: COLORS.muted, textTransform: "uppercase" },
  metaValue: { fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 1 },
  setRow: { flexDirection: "row", gap: 10, marginBottom: 2 },
  setLabel: { width: 50, fontSize: 9, color: COLORS.muted },
  setScore: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  listItem: { flexDirection: "row", marginBottom: 2 },
  bullet: { width: 10, color: COLORS.accent },
  listText: { flex: 1, fontSize: 9 },
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

function Block({ title, text }: { title: string; text: string }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {text.trim() ? (
        <Text style={s.body}>{text}</Text>
      ) : (
        <Text style={s.empty}>{i18n.t("export.noData")}</Text>
      )}
    </View>
  );
}

function MatchPlanDocument({
  plan,
  offensiveStrategyName,
  defensiveStrategyName,
}: MatchPlanInput) {
  const t = i18n.t.bind(i18n);
  const today = new Date().toISOString().slice(0, 10);
  const sets = plan.sets ?? [];
  const strategies = plan.timeoutStrategies ?? [];

  return (
    <Document
      title={`${t("export.matchPlanTitle")} – ${plan.opponent}`}
      author="KickerCoach"
    >
      <Page size="A4" style={s.page}>
        <Text style={s.brand}>KICKERCOACH</Text>
        <Text style={s.title}>
          {t("export.matchPlanTitle")}: {plan.opponent || "—"}
        </Text>
        <Text style={s.subtitle}>{plan.date}</Text>

        <View style={s.metaRow}>
          {plan.result ? (
            <View>
              <Text style={s.metaLabel}>{t("export.result")}</Text>
              <Text style={s.metaValue}>
                {t(`constants.matchResult.${plan.result}`, {
                  defaultValue: plan.result,
                })}
              </Text>
            </View>
          ) : null}
          {(offensiveStrategyName || defensiveStrategyName) && (
            <View>
              <Text style={s.metaLabel}>Strategie</Text>
              <Text style={s.metaValue}>
                {[offensiveStrategyName, defensiveStrategyName]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
            </View>
          )}
        </View>

        <View style={s.rule} />

        {sets.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{t("export.result")}</Text>
            {sets.map((set) => (
              <View key={set.setNumber} style={s.setRow}>
                <Text style={s.setLabel}>Satz {set.setNumber}</Text>
                <Text style={s.setScore}>
                  {set.scoreHome} : {set.scoreAway}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Block title={t("export.analysis")} text={plan.analysis} />
        <Block title={t("export.gameplan")} text={plan.gameplan} />

        <View style={s.section}>
          <Text style={s.sectionTitle}>{t("export.strategies")}</Text>
          {strategies.length === 0 ? (
            <Text style={s.empty}>{t("export.noData")}</Text>
          ) : (
            strategies.map((str, i) => (
              <View key={i} style={s.listItem}>
                <Text style={s.bullet}>•</Text>
                <Text style={s.listText}>{str}</Text>
              </View>
            ))
          )}
        </View>

        <Block title={t("export.notes")} text={plan.notes} />

        <Text style={s.footer} fixed>
          {t("export.generatedOn", { date: today })} · KickerCoach
        </Text>
      </Page>
    </Document>
  );
}

/** Render a match plan to a PDF Blob. Heavy — call via dynamic import. */
export async function generateMatchPlanPdf(input: MatchPlanInput): Promise<Blob> {
  return pdf(<MatchPlanDocument {...input} />).toBlob();
}
