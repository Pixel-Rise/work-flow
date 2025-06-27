import React, { createContext, useContext, useState, useEffect } from "react";

type PrimaryColorContextType = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
};

const PrimaryColorContext = createContext<PrimaryColorContextType | undefined>(
  undefined
);

// Color mapping with their corresponding foreground colors for light and dark themes
const colorMap: Record<string, { primary: string; lightForeground: string; darkForeground: string }> = {
  "#3B82F6": { primary: "#3B82F6", lightForeground: "#FFFFFF", darkForeground: "#FFFFFF" }, // Blue
  "#10B981": { primary: "#10B981", lightForeground: "#FFFFFF", darkForeground: "#FFFFFF" }, // Emerald
  "#F59E0B": { primary: "#F59E0B", lightForeground: "#000000", darkForeground: "#000000" }, // Amber
  "#EF4444": { primary: "#EF4444", lightForeground: "#FFFFFF", darkForeground: "#FFFFFF" }, // Red
  "#6366F1": { primary: "#6366F1", lightForeground: "#FFFFFF", darkForeground: "#FFFFFF" }, // Indigo
  "#8B5CF6": { primary: "#8B5CF6", lightForeground: "#FFFFFF", darkForeground: "#FFFFFF" }, // Violet
  "#14B8A6": { primary: "#14B8A6", lightForeground: "#FFFFFF", darkForeground: "#FFFFFF" }, // Teal
};

export const PrimaryColorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [primaryColor, setPrimaryColorState] = useState("");
  const [isDark, setIsDark] = useState(false);

  // Load primary color from localStorage on mount
  useEffect(() => {
    const savedColor = localStorage.getItem('primary-color');
    if (savedColor && colorMap[savedColor]) {
      setPrimaryColorState(savedColor);
    }
  }, []);

  // Save primary color to localStorage when it changes
  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
    if (color && colorMap[color]) {
      localStorage.setItem('primary-color', color);
    } else {
      localStorage.removeItem('primary-color');
    }
  };

  useEffect(() => {
    // Dark mode detection
    const checkDarkMode = () => {
      const darkMode = document.documentElement.classList.contains('dark');
      setIsDark(darkMode);
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const getColorValues = (color: string) => {
    if (color && colorMap[color]) {
      const colors = colorMap[color];
      return {
        primary: colors.primary,
        foreground: isDark ? colors.darkForeground : colors.lightForeground
      };
    }
    // Default fallback
    return { primary: "", foreground: "" };
  };

  const colorValues = getColorValues(primaryColor);

  return (
    <PrimaryColorContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {primaryColor && (
        <style>
          {`:root {
            --primary: ${colorValues.primary};
            --primary-foreground: ${colorValues.foreground};
          }
          .dark {
            --primary: ${colorValues.primary};
            --primary-foreground: ${colorValues.foreground};
          }`}
        </style>
      )}
      {children}
    </PrimaryColorContext.Provider>
  );
};

export const usePrimaryColor = () => {
  const context = useContext(PrimaryColorContext);
  if (!context) {
    throw new Error(
      "usePrimaryColor must be used within a PrimaryColorProvider"
    );
  }
  return context;
};
