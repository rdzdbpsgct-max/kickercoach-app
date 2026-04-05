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
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "de",
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "kickercoach-language",
    },
  });

export default i18n;
