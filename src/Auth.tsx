import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/ui/motion-tabs";
import { Toaster } from "sonner";
import LogIn from "./LogIn";
import Registration from "./Registration";

const tabs = [
  {
    name: "Войти",
    value: "logIn",
    content: <LogIn />,
  },
  {
    name: "Регистрация",
    value: "registration",
    content: <Registration />,
  },
];

function Auth() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Tabs defaultValue="logIn" className="gap-4 w-[400px]">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContents>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <>{tab.content}</>
            </TabsContent>
          ))}
        </TabsContents>
      </Tabs>
      <Toaster position="top-right" />
    </div>
  );
}

export default Auth;
