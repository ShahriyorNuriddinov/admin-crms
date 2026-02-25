"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditProfileMutaion } from "@/request/mutation";
import Cookies from "js-cookie";
import { User } from "@/types";
import { Myaxios } from "@/request/axios";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";
const formSchema = z.object({
  email: z.string().email("To‘g‘ri email kiriting").min(5),
  last_name: z.string().min(5),
  first_name: z.string().min(5),
});
const edit_passwordSchema = z.object({
  current_password: z.string().min(8),
  new_password: z.string().min(8),
});
export interface EditProfileType {
  first_name: string;
  last_name: string;
  email: string;
}
interface ProfileToolsProps {
  setUserInfo: React.Dispatch<React.SetStateAction<Partial<User>>>;
  userInfo: Partial<User>;
}
const Profile_tools = ({ setUserInfo, userInfo }: ProfileToolsProps) => {
  const { mutate } = useEditProfileMutaion();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openEditPassword, setOpenEditPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
  });
  const edit_form = useForm<z.infer<typeof edit_passwordSchema>>({
    resolver: zodResolver(edit_passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
    },
  });
  const userCookie = Cookies.get("user");
  const addAdmin = (values: z.infer<typeof formSchema>) => {
    mutate(values, {
      onSuccess() {
        setOpen(false);
        form.reset();
      },
    });
    if (userCookie) {
      const profile = JSON.parse(userCookie);
      Cookies.set("user", JSON.stringify({ ...profile, ...values }));
      setUserInfo({
        ...userInfo,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
      });
    }
  };
  const editPassword = (values: z.infer<typeof edit_passwordSchema>) => {
    setLoading(true);
    Myaxios.post("/api/auth/edit-password", values).then((res) => {
      toast.success(res.data?.message);
      setOpenEditPassword(false);
      edit_form.reset();
      setLoading(false);
    });
  };
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => {
          setOpenEditPassword(true);
        }}
        size="sm"
      >
        Parol<span className="max-[366px]:hidden ">ni</span>
        <span className="max-[366px]:hidden ">O&apos;zgartirish</span>
      </Button>
      <Button
        onClick={() => {
          const userCookie = Cookies.get("user");
          if (userCookie) {
            const profile = JSON.parse(userCookie); // 👈 parse cookie if it's JSON
            form.reset({
              first_name: profile.first_name || "",
              last_name: profile.last_name || "",
              email: profile.email || "",
            });
          }
          setOpen(true);
        }}
        size="sm"
      >
        O&apos;zgartirish
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(addAdmin)}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Dialog open={openEditPassword} onOpenChange={setOpenEditPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
          </DialogHeader>
          <Form {...edit_form}>
            <form
              onSubmit={edit_form.handleSubmit(editPassword)}
              className="grid gap-4 py-4"
            >
              <FormField
                control={edit_form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Current password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={edit_form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <DialogFooter>
                {loading ? (
                  <Button>
                    <Loader className="animate-spin" />
                  </Button>
                ) : (
                  <Button type="submit">Save changes</Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile_tools;
