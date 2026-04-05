import { useTranslation } from "react-i18next";

const AVAILABLE_LANGUAGES = [
  { code: "de", label: "Deutsch" },
  // Future: { code: "en", label: "English" },
] as const;

export default function LanguageSelector() {
  const { i18n, t } = useTranslation("settings");

  return (
    <div>
      <label className="text-sm font-medium text-text-dim">
        {t("language")}
      </label>
      <select
        value={i18n.language}
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
