import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonDe from "./locales/de/common.json";
import homeDe from "./locales/de/home.json";

const resources = {
  de: { common: commonDe, home: homeDe },
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
