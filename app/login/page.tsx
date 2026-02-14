"use client";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
    },
    shouldFocusError: true, 
  });
  return (
    <div className="">
      <div className="absolute top-6 left-6">
        <ModeToggle />
      </div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="backdrop-blur bg-white/5 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-4">
            Xush kelibsiz 👋
          </h2>
          <p className="text-foreground text-sm text-center mb-6">
            Hisobingizga kirish uchun email va parolni kiriting
          </p>
          <form onSubmit={handleSubmit((data) => console.log(data))}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Email
            </label>
            <Input
              placeholder="Email kiriting"
              className="mb-4"
              {...register("email", {
                required: "Email talab qilinadi",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email noto'g'ri formatda ",
                },
              })}
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Parol
              </label>
              <p className="flex items-end">{watch("password").length}</p>
            </div>
            <Input
              type="password"
              placeholder="Parol kiriting"
              {...register("password", {
                required: "Parol talab qilinadi",
                minLength: {
                  value: 8,
                  message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
                },
              })}
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
            <Button type="submit" className="w-full mt-6">
              <span className="text-sm font-medium">Kirish</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
