import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import React, { useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/supabaseClient";

export default function Registration(): JSX.Element {
  const carouselRef = useRef<CarouselApi | null>(null);

  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isSending, setIsSending] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSettingPassword, setIsSettingPassword] = useState<boolean>(false);

  // Сохраняем id пользователя, если понадобится
  const [userId, setUserId] = useState<string | null>(null);

  function validateEmail(value: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  }

  function validatePassword(value: string): boolean {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    // можно также требовать минимальную длину, например >= 8
    const hasMinLen = value.length >= 8;
    return hasUpperCase && hasNumber && hasSpecialChar && hasMinLen;
  }

  async function sendCode() {
    if (!validateEmail(email)) {
      toast("Некорректный адрес электронной почты", {
        description:
          "Пожалуйста перепроверьте введенный адрес электронной почты и попробуйте ещё раз",
      });
      return;
    }

    try {
      setIsSending(true);
      // Отправляем OTP-код. shouldCreateUser: true — создаст пользователя, если его нет
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });

      if (error) {
        console.error("signInWithOtp error:", error);
        toast("Ошибка отправки кода", { description: error.message });
        return;
      }

      toast("Подтверждение электронной почты", {
        description:
          "Отправили код вам на электронную почту. Не забудьте проверить спам",
      });
      carouselRef.current?.scrollNext();
    } finally {
      setIsSending(false);
    }
  }

  function handleBack() {
    carouselRef.current?.scrollPrev();
  }

  async function checkCode() {
    if (!code || code.trim().length === 0) {
      toast("Введите код", { description: "Пожалуйста введите код из письма" });
      return;
    }

    try {
      setIsVerifying(true);
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });

      if (error) {
        console.error("verifyOtp error:", error);
        toast("Ошибка проверки кода", { description: error.message });
        return;
      }

      // data.user может быть null -> проверяем
      if (!data || !data.user) {
        toast("Не удалось подтвердить почту", {
          description:
            "Код подтверждения принят, но не удалось получить данные пользователя",
        });
        return;
      }

      setUserId(data.user.id);
      toast("Email подтверждён", { description: "Теперь задайте пароль" });
      carouselRef.current?.scrollNext();
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleRegistration() {
    if (!validatePassword(password)) {
      toast("Не надёжный пароль", {
        description:
          "Пароль должен содержать минимум 8 символов, 1 заглавную букву, 1 цифру и 1 спецсимвол",
      });
      return;
    }

    try {
      setIsSettingPassword(true);

      // Устанавливаем пароль текущему пользователю через auth API.
      // verifyOtp (если успешен) создаёт/восстанавливает сессию, поэтому updateUser сработает.
      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error("updateUser error:", error);
        toast("Ошибка установки пароля", { description: error.message });
        return;
      }

      toast("Успешная регистрация", {
        description: "Вы успешно прошли регистрацию. Добро пожаловать!",
      });

      // Дополнительно: можно перенаправить пользователя или выполнить другие шаги
      // console.log("user after update:", data.user);
    } finally {
      setIsSettingPassword(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Создайте новый аккаунт</CardTitle>
        <CardDescription>
          Введите свой адрес электронной почты и придумайте безопасный пароль
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Carousel
          setApi={(api) => (carouselRef.current = api)}
          opts={{ watchDrag: false }}
        >
          <CarouselContent>
            {/* Шаг 1 — email */}
            <CarouselItem>
              <Label htmlFor="email" className="mb-4">
                Электронная почта
              </Label>
              <Input
                id="email"
                className="mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <Button
                className="mb-3"
                onClick={sendCode}
                disabled={isSending}
                aria-disabled={isSending}
              >
                {isSending ? "Отправляем..." : "Далее"}
              </Button>
            </CarouselItem>

            {/* Шаг 2 — код */}
            <CarouselItem>
              <Label className="mb-4">Введите код</Label>
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <div className="flex gap-2.5 mt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isVerifying}
                >
                  <ChevronLeft />
                </Button>
                <Button onClick={checkCode} disabled={isVerifying}>
                  {isVerifying ? "Проверяем..." : "Проверить код"}
                </Button>
              </div>
            </CarouselItem>

            {/* Шаг 3 — пароль */}
            <CarouselItem>
              <Label htmlFor="password" className="mb-4">
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              <Button
                onClick={handleRegistration}
                className="mt-4"
                disabled={isSettingPassword}
              >
                {isSettingPassword ? "Сохраняем..." : "Зарегистрироваться"}
              </Button>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
}
