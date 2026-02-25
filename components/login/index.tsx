"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DarkMode } from "../darkModeChange";
import { useLoginMutation } from "@/request/mutation";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("To‘g‘ri email kiriting").min(5),
  password: z.string().min(8, "Kamida 8 ta belgi bo‘lishi kerak"),
});

const LoginComponents = () => {
  const { mutate, isSuccess, isPending } = useLoginMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }
  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isPending, isSuccess, router]);

  return (
    <div className="h-screen  relative  w-full flex items-center justify-center bg-gradient-to-br from-background to-background px-4">
      <div className="absolute top-5 left-5   ">
        <DarkMode />
      </div>
      <div className="backdrop-blur bg-white/5 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-semibold text-foreground text-center mb-4">
          ADMIN CRM
        </h2>
        <p className="text-foreground text-sm text-center mb-6">
          Hisobingizga kirish uchun email va parolni kiriting
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="crm@mail.ru"
                      {...field}
                      className="bg-white/40 text-foreground  placeholder-white focus-visible:ring-foreground border border-white/30"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Parol</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      className="bg-white/40 text-foreground placeholder-white focus-visible:ring-white/70 border border-white/30"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full transition"
              disabled={isPending}
            >
              {isPending ? <Loader className=" animate-spin " /> : "Kirish"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
export default LoginComponents;
