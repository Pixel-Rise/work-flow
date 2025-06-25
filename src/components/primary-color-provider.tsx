import React, { createContext, useContext, useState } from "react";

type PrimaryColorContextType = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
};

const PrimaryColorContext = createContext<PrimaryColorContextType | undefined>(
  undefined
);

export const PrimaryColorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [primaryColor, setPrimaryColor] = useState("#2563eb");

  return (
    <PrimaryColorContext.Provider value={{ primaryColor, setPrimaryColor }}>
      <div style={{ "--primary": primaryColor } as React.CSSProperties}>
        {children}
      </div>
    </PrimaryColorContext.Provider>
  );
};

export const usePrimaryColor = () => {
  const context = useContext(PrimaryColorContext);
  if (!context) {
    throw new Error("usePrimaryColor must be used within a PrimaryColorProvider");
  }
  return context;
};
