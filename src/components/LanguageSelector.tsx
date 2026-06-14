import { useTranslation } from "react-i18next";

const AVAILABLE_LANGUAGES = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
] as const;

export default function LanguageSelector() {
  const { i18n, t } = useTranslation("settings");
  // i18n.language may be a regional variant (e.g. "en-US"); map to the base.
  const current = i18n.language?.split("-")[0] ?? "de";

  return (
    <div>
      <label className="text-sm font-medium text-text-dim">
        {t("language")}
      </label>
      <select
        data-testid="language-select"
        value={current}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        {AVAILABLE_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
