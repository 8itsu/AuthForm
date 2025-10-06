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
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/supabaseClient";
// import { useEffect } from "react";

function Registration() {
  const [id, setId] = useState<string | null>(null);
  const carouselRef = useRef<CarouselApi | null>(null);
  const [email, emailChange] = useState<string>("");
  const [code, codeChange] = useState<string>("");
  const [password, passwordChange] = useState<string>("");

  function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  async function sendCode() {
    if (validateEmail(email)) {
      //Отправляем код
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          // set this to false if you do not want the user to be automatically signed up
          shouldCreateUser: true,
        },
      });
      if (data) {
        toast("Подтверждение электронной почты", {
          description:
            "Отправили код вам на электронную почту. Не забудьте проверить спам",
        });
        if (carouselRef.current) {
          carouselRef.current.scrollNext();
        }
      }
      if (error) {
        toast("Некоректный адрес электронной почты", {
          description:
            "Пожалуйста перепроверьте введенный адрес электронной почты и попробуйте еще раз",
        });
      }
    }
  }
  function handleBack() {
    if (carouselRef.current) {
      carouselRef.current.scrollPrev();
    }
  }
  async function checkCode() {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) {
      toast("Ошибка проверки кода", { description: error.message });
      return;
    }

    if (data.session) {
      console.log("Пользователь вошёл:", data.user);
      if (data.user?.id) {
        setId(data.user.id);
      }
    }

    toast("Email подтверждён", { description: "Теперь задайте пароль" });
    carouselRef.current?.scrollNext();
  }
  function validatePassword(password: string): boolean {
    // хотя бы одна заглавная буква
    const hasUpperCase = /[A-Z]/.test(password);
    // хотя бы одна цифра
    const hasNumber = /\d/.test(password);
    // хотя бы один спецсимвол
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasUpperCase && hasNumber && hasSpecialChar;
  }
  async function handleRegistration() {
    if (!validatePassword(password)) {
      toast("Не надежный пароль", {
        description:
          "Пароль должен содержать как минимум 1 заглавную букву, 1 цифру и 1 спец символ",
      });
      return;
    }

    const { error } = await supabase
      .from("user")
      .insert({ id: id, user_email: email, user_password: password });

    if (error) {
      console.log(error);
    }

    toast("Успешная регистрация", {
      description: "Вы успешно прошли регистрацию. Добро пожаловать",
    });
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
          opts={{
            watchDrag: false,
          }}
        >
          <CarouselContent>
            <CarouselItem>
              <Label htmlFor="email" className="mb-4">
                Электронная почта
              </Label>
              <Input
                id="email"
                className="mb-4"
                data-reg-email
                value={email}
                onChange={(e) => emailChange(e.target.value)}
              />
              <Button className="mb-3" onClick={sendCode}>
                Далее
              </Button>
            </CarouselItem>
            <CarouselItem>
              <Label className="mb-4">Введите код</Label>
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => codeChange(value.toUpperCase())}
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
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft />
                </Button>
                <Button className="" onClick={checkCode}>
                  Проверить код
                </Button>
              </div>
            </CarouselItem>
            <CarouselItem>
              <Label htmlFor="password" className="mb-4">
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => passwordChange(e.currentTarget.value)}
              />
              <Button onClick={handleRegistration} className="mt-4">
                Зарегистрироваться
              </Button>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </CardContent>
    </Card>
  );
}

export default Registration;
