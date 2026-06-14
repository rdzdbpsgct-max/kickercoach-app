import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonDe from "./locales/de/common.json";
import homeDe from "./locales/de/home.json";
import learnDe from "./locales/de/learn.json";
import planDe from "./locales/de/plan.json";
import boardDe from "./locales/de/board.json";
import analyticsDe from "./locales/de/analytics.json";
import trainDe from "./locales/de/train.json";
import playersDe from "./locales/de/players.json";
import settingsDe from "./locales/de/settings.json";

import commonEn from "./locales/en/common.json";
import homeEn from "./locales/en/home.json";
import learnEn from "./locales/en/learn.json";
import planEn from "./locales/en/plan.json";
import boardEn from "./locales/en/board.json";
import analyticsEn from "./locales/en/analytics.json";
import trainEn from "./locales/en/train.json";
import playersEn from "./locales/en/players.json";
import settingsEn from "./locales/en/settings.json";

const resources = {
  de: {
    common: commonDe,
    home: homeDe,
    learn: learnDe,
    train: trainDe,
    plan: planDe,
    board: boardDe,
    analytics: analyticsDe,
    players: playersDe,
    settings: settingsDe,
  },
  en: {
    common: commonEn,
    home: homeEn,
    learn: learnEn,
    train: trainEn,
    plan: planEn,
    board: boardEn,
    analytics: analyticsEn,
    players: playersEn,
    settings: settingsEn,
  },
};

export const SUPPORTED_LANGUAGES = ["de", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "de",
    supportedLngs: ["de", "en"],
    nonExplicitSupportedLngs: true,
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "kickercoach-language",
    },
  });

export default i18n;
