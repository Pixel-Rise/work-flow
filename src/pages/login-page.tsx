import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-language";

const LoginPage: React.FC = () => {
  const t = useTranslation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format for Uzbekistan numbers
    if (phoneNumber.startsWith('998')) {
      const formatted = phoneNumber.slice(3);
      if (formatted.length >= 2) {
        return `+998 ${formatted.slice(0, 2)} ${formatted.slice(2, 5)} ${formatted.slice(5, 7)} ${formatted.slice(7, 9)}`.trim();
      }
      return `+998 ${formatted}`;
    }
    
    // If doesn't start with 998, add it
    if (phoneNumber.length > 0) {
      return `+998 ${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2, 5)} ${phoneNumber.slice(5, 7)} ${phoneNumber.slice(7, 9)}`.trim();
    }
    
    return '';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Remove formatting from phone number for submission
    const cleanPhone = phone.replace(/\D/g, '');
    
    console.log('Login attempt:', {
      phone: cleanPhone,
      password: password
    });
    
    // login logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{t("login")}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="">{t("phone")}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+998 90 123 45 67"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-4">
            <Button type="submit" className="w-full">
              {t("sign_in")}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {t("no_account")} <a href="https://t.me/tm_corporate_bot" target="_blank" rel="noopener noreferrer" className="underline text-blue-400 hover:text-blue-300">{t("sign_up")}</a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
