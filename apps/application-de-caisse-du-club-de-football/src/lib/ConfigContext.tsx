import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

import { AppConfig, DEFAULT_CONFIG, applyTheme, loadCached, migrate, saveCached } from './config';

type Ctx = {
  config: AppConfig;
  isAdmin: boolean;
  update: (fn: (c: AppConfig) => AppConfig) => void;
  adminMode: boolean;
  setAdminMode: (v: boolean) => void;
};

const ConfigContext = createContext<Ctx | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(() => loadCached() ?? DEFAULT_CONFIG);
  const [isAdmin] = useState(true);

  const [adminMode, setAdminMode] = useState(false);
  useEffect(() => {
    applyTheme(adminMode ? { ...config.theme, preset: 'sobre', font: 'outfit', overrides: {} } : config.theme);
  }, [config.theme, adminMode]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/config.json');
        if (response.ok) {
          const remote = migrate(await response.json() as AppConfig);
          setConfig(remote);
          saveCached(remote);
        }
      } catch {
        // Erreur de chargement : on garde la configuration en cache ou par défaut
      }
    })();
  }, []);

  const update = useCallback((fn: (c: AppConfig) => AppConfig) => {
    setConfig((prev) => {
      const next = { ...fn(prev), version: prev.version + 1 };
      saveCached(next);
      return next;
    });
  }, []);

  return <ConfigContext.Provider value={{ config, isAdmin, update, adminMode, setAdminMode }}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  const c = useContext(ConfigContext);
  if (!c) throw new Error('useConfig outside provider');
  return c;
}
