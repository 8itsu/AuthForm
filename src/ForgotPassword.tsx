import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { toast } from "sonner";

function ForgotPassword() {
  const carouselRef = useRef<CarouselApi | null>(null);
  const [email, emailChange] = useState<string>("");
  const [code, codeChange] = useState<string>("");
  const [password, passwordChange] = useState<string>("");

  function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  function sendCode() {
    if (validateEmail(email)) {
      toast("Подтверждение электронной почты", {
        description:
          "Отправили код вам на электронную почту. Не забудьте проверить спам",
      });
      if (carouselRef.current) {
        carouselRef.current.scrollNext();
      }
    } else {
      toast("Некоректный адрес электронной почты", {
        description:
          "Пожалуйста перепроверьте введенный адрес электронной почты и попробуйте еще раз",
      });
    }
  }
  function handleBack() {
    if (carouselRef.current) {
      carouselRef.current.scrollPrev();
    }
  }
  function checkCode() {
    if (code !== "111111") {
      toast("Неверный код", {
        description:
          "Пожалуйста перепроверьте введеный код или отправьте его заново",
      });
      return;
    }
    if (carouselRef.current) {
      carouselRef.current.scrollNext();
    }
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
  function handleRegistration() {
    if (!validatePassword(password)) {
      toast("Не надежный пароль", {
        description:
          "Пароль должен содержать как минимум 1 заглавную букву, 1 цифру и 1 спец символ",
      });
      return;
    }
    toast("Успешная регистрация", {
      description: "Вы успешно прошли регистрацию. Добро пожаловать",
    });
  }

  return (
    <>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant="ghost">Забыли пароль?</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Восстановление пароля</DialogTitle>
              <DialogDescription>
                Для создания нового пароля подтвердите свою личность через
                электронную почту
              </DialogDescription>
            </DialogHeader>
            <Carousel
              setApi={(api) => (carouselRef.current = api)}
              opts={{
                watchDrag: false,
              }}
              className="w-[370px]"
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
                    Сохранить
                  </Button>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}

export default ForgotPassword;
