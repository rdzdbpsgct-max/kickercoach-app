import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button, Card, ConfirmDialog } from "../../components/ui";
import { useTheme } from "../../hooks/useTheme";
import { getStorageUsage, exportStoreData, importStoreData } from "../../utils/storage";
import type { StorageUsage } from "../../utils/storage";
import LanguageSelector from "../../components/LanguageSelector";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: "easeOut" as const },
  }),
};

export default function SettingsPage() {
  const { t } = useTranslation(["settings", "common"]);
  const [usage, setUsage] = useState<StorageUsage | null>(null);
  const [importStatus, setImportStatus] = useState<string>("");
  const [exportError, setExportError] = useState<string>("");
  const [confirmImportOpen, setConfirmImportOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setUsage(getStorageUsage());
  }, []);

  const handleExport = () => {
    setExportError("");
    const result = exportStoreData();
    if (!result.success) {
      setExportError(result.error ?? t("common:error.unknown"));
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setConfirmImportOpen(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImportConfirmed = async () => {
    if (!pendingFile) return;
    setImportStatus(t("backup.importing"));
    const result = await importStoreData(pendingFile);
    setPendingFile(null);
    if (result.success) {
      setImportStatus(t("backup.importSuccess"));
    } else {
      setImportStatus(result.error ?? t("backup.importFailed"));
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-auto pb-6">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-kicker-green to-emerald-400 bg-clip-text text-xl font-bold text-transparent"
      >
        {t("title")}
      </motion.h1>

      {/* Theme Toggle — mobile only (desktop has it in header) */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="block md:hidden"
      >
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-kicker-green/15 text-lg">
                {theme === "dark" ? "🌙" : "☀️"}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-text">{t("appearance.title")}</h2>
                <p className="text-xs text-text-dim">
                  {theme === "dark" ? t("appearance.dark") : t("appearance.light")}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              aria-label={t("appearance.toggle")}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-kicker-green/50 ${
                theme === "dark"
                  ? "bg-kicker-green"
                  : "bg-border"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Language Selector */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card>
          <LanguageSelector />
        </Card>
      </motion.div>

      {/* Storage usage */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-text">{t("storage.title")}</h2>
          {usage && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="mb-1 flex justify-between text-xs text-text-dim">
                    <span>{t("storage.used", { kb: usage.usedKB })}</span>
                    <span>{t("storage.limit", { mb: usage.estimatedLimitMB })}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-border">
                    <div
                      className={`h-full rounded-full transition-all ${
                        usage.percentUsed > 80
                          ? "bg-kicker-red"
                          : usage.percentUsed > 50
                            ? "bg-kicker-orange"
                            : "bg-kicker-green"
                      }`}
                      style={{ width: `${Math.min(100, usage.percentUsed)}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-text">
                  {usage.percentUsed}%
                </span>
              </div>
              {usage.percentUsed > 80 && (
                <div className="rounded-lg bg-kicker-red/10 p-2 text-xs text-kicker-red">
                  {t("storage.warning")}
                </div>
              )}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Export / Import */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-text">{t("backup.title")}</h2>
          <div className="flex flex-col gap-3">
            <div>
              <p className="mb-2 text-xs text-text-muted">
                {t("backup.exportDescription")}
              </p>
              <Button size="sm" onClick={handleExport}>
                {t("backup.exportButton")}
              </Button>
              {exportError && (
                <p className="mt-2 text-xs text-kicker-red">{exportError}</p>
              )}
            </div>
            <div className="border-t border-border pt-3">
              <p className="mb-2 text-xs text-text-muted">
                {t("backup.importDescription")}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelected}
                className="hidden"
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                {t("backup.importButton")}
              </Button>
              {importStatus && (
                <p className="mt-2 text-xs text-kicker-green">{importStatus}</p>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* App info */}
      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-text">{t("common:appName")}</h2>
          <p className="text-xs text-text-dim">{t("common:appTagline")}</p>
          <p className="mt-1 text-xs text-text-dim">
            {t("about.description")}
          </p>
        </Card>
      </motion.div>

      <ConfirmDialog
        open={confirmImportOpen}
        onClose={() => {
          setConfirmImportOpen(false);
          setPendingFile(null);
        }}
        onConfirm={handleImportConfirmed}
        title={t("backup.confirmTitle")}
        message={t("backup.confirmMessage")}
        confirmLabel={t("backup.confirmButton")}
        cancelLabel={t("common:actions.cancel")}
      />
    </div>
  );
}
