import React from "react";
import { useTranslation } from "@/components/language-provider";

const HomePage: React.FC = () => {
  const t = useTranslation();

  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-4xl font-bold">{t("welcome")}</h1>
    </div>
  );
};

export default HomePage;
