import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ForgotPassword from "./ForgotPassword";

function LogIn() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Войдите в свой аккаунт</CardTitle>
          <CardDescription>
            Введите свой адрес электронной почты и пароль ниже, чтобы войти в
            свою учетную запись
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="email" className="mb-4">
            Электронная почта
          </Label>
          <Input id="email" className="mb-3.5" />
          <Label htmlFor="password" className="mb-4">
            Пароль
          </Label>
          <Input id="password" type="password" />
        </CardContent>
        <CardFooter>
          <Button className="mr-2">Войти</Button>
          <ForgotPassword />
        </CardFooter>
      </Card>
    </>
  );
}

export default LogIn;
