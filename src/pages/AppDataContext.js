import { createContext, useContext, useState, useEffect } from "react";
import { buildAppData } from "../Utils";

const AppDataContext = createContext({
  appRatings: [],     // default as empty array
  appFeatures: [],    // default as empty array
  apps: [],           // default as empty array
});

export const AppDataProvider = ({ children }) => {
  const [appData, setAppData] = useState({
    appRatings: [],
    appFeatures: [],
    apps: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buildAppData()
      .then(data => {
        // Store the object returned by buildAppData directly
        setAppData({
          appRatings: data.appRatings,
          appFeatures: data.appFeatures,
          apps: data.apps,
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching app data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <AppDataContext.Provider value={{ ...appData, loading }}>
      {children}
    </AppDataContext.Provider>
  );
};

// Hook for convenience
export const useAppData = () => useContext(AppDataContext);