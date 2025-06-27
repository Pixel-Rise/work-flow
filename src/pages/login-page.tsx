import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-language";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const LoginPage: React.FC = () => {
  const t = useTranslation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const {
    mutate,
    data: tokens,
    isError,
    isSuccess,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
  });

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem("accessToken", tokens.data.accessToken);
      localStorage.setItem("refreshToken", tokens.data.refreshToken);
      toast.success(t("login_success") || "Login successful!");
      navigate("/dashboard");
    } else if (isError) {
      // Extract error message from backend response
      let errorMessage = t("login_error") || "Login failed!";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.status === 401) {
          errorMessage = t("invalid_credentials") || "Invalid phone number or password";
        } else if (axiosError.response?.status === 422) {
          errorMessage = t("validation_error") || "Invalid phone number format";
        }
      }
      
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, tokens?.data, navigate, error, t]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const phoneNumber = value.replace(/\D/g, "");

    // Limit to 12 digits total (998 + 9 digits)
    const limitedPhoneNumber = phoneNumber.slice(0, 12);

    // Format for Uzbekistan numbers
    if (limitedPhoneNumber.startsWith("998")) {
      const formatted = limitedPhoneNumber.slice(3);
      if (formatted.length >= 2) {
        return `+998 ${formatted.slice(0, 2)} ${formatted.slice(
          2,
          5
        )} ${formatted.slice(5, 7)} ${formatted.slice(7, 9)}`.trim();
      }
      return `+998 ${formatted}`;
    }

    // If doesn't start with 998, add it automatically
    if (limitedPhoneNumber.length > 0) {
      const userDigits = limitedPhoneNumber.slice(0, 9); // Limit to 9 user digits
      return `+998 ${userDigits.slice(0, 2)} ${userDigits.slice(
        2,
        5
      )} ${userDigits.slice(5, 7)} ${userDigits.slice(7, 9)}`.trim();
    }

    return "";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    
    // Debug logging for mobile issues
    console.log("Phone input change:", {
      original: e.target.value,
      formatted: formatted,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Remove all formatting from phone number for submission
    const cleanPhone = phone.replace(/\s/g, ""); // Remove all spaces

    // Validate phone number length
    if (cleanPhone.length !== 13) {
      toast.error(t("invalid_phone_format") || "Phone number must be in format +998XXXXXXXXX");
      return;
    }

    console.log("Login attempt:", {
      phone: cleanPhone,
      password: password,
      userAgent: navigator.userAgent,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    });

    mutate({ phone: cleanPhone, password });
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{t("login")}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="">
                {t("phone")}
              </Label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                pattern="[+][0-9\s]{12,17}"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+998 90 123 45 67"
                autoComplete="tel"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="">
                {t("password")}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t("loading") : t("sign_in")}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {t("no_account")}{" "}
              <a
                href="https://t.me/tm_corporate_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-400 hover:text-blue-300"
              >
                {t("sign_up")}
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
