"use client";
import React, { FormEvent, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search, X, Filter, Mail, ShieldCheck, CheckCircle2, Calendar, Briefcase, TrendingUp } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../ui/command";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Myaxios } from "@/request/axios";
import { Skeleton } from "../ui/skeleton";
import {
  deleteAdminCase,
  useEditMutation,
  useTatildaMutaion,
} from "@/request/mutation";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Admin_tools from "./admin-add";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "react-toastify";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
const formSchema = z.object({
  email: z.string().email("To‘g‘ri email kiriting").min(5),
  last_name: z.string().min(5),
  first_name: z.string().min(5),
});

const tatilSchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  reason: z.string().min(5),
});
type Params = {
  status?: string;
  search?: string;
};
const AdminsTableComponent = () => {
  const { mutate } = useEditMutation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [tatil, setTatil] = useState({ bool: false, id: "" });
  const [info, setInfo] = useState<boolean>(false);
  const [userinfo, setUserInfo] = useState<User>();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const deleteAdminCas = deleteAdminCase();
  const { mutate: tatilMutate } = useTatildaMutaion();
  const userCookie = Cookies.get("user");
  const user = userCookie ? JSON.parse(userCookie) : null;
  const params: Params = {};
  if (selectedStatus !== "all") {
    params.status = selectedStatus;
  }
  if (searchValue.trim() !== "") {
    params.search = searchValue.trim();
  }
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admins"],
    queryFn: () =>
      Myaxios.get(
        "/api/staff/all-admins",
        Object.keys(params).length > 0 ? { params } : {}
      ).then((res) => res.data.data),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      last_name: "",
      first_name: "",
    },
  });
  const tatilForm = useForm<z.infer<typeof tatilSchema>>({
    resolver: zodResolver(tatilSchema),
    defaultValues: {
      start_date: "",
      end_date: "",
      reason: "",
    },
  });
  const editAdmin = (values: z.infer<typeof formSchema>) => {
    mutate(
      {
        ...values,
        _id: selectedUser?._id,
        status: selectedUser?.status,
      },
      {
        onSuccess() {
          setOpen(false);
          form.reset();
        },
        onError() {
          toast.success("Nimadur xato qayta urinib ko'ring!");
        },
      }
    );
  };
  const delteAdmin = (data: User) => {
    Myaxios({
      url: "/api/staff/deleted-admin",
      data: { _id: data?._id },
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
      .then(() => {
        deleteAdminCas(data);
        refetch();
      })
      .catch(() => toast.success("Nimadur xato qayta urinib ko'ring!"));
  };
  const tatilFn = (values: z.infer<typeof tatilSchema>) => {
    tatilMutate(
      { ...values, _id: tatil.id },
      {
        onSuccess() {
          setTatil({ bool: false, id: "" });
          tatilForm.reset();
          refetch();
        },
        onError() {
          toast.success("Nimadur xato qayta urinib ko'ring!");
        },
      }
    );
  };
  const tatildanChiqish = (id: string) => {
    Myaxios.post("/api/staff/leave-exit-staff", { _id: id })
      .then(() => refetch())
      .then(() => toast.success("Tatildan chiqarish!"))
      .catch(() => toast.success("Nimadur xato qayta urinib ko'ring!"));
  };
  const handleSelectChange = (value: string) => {
    setSelectedStatus(value);
  };
  useEffect(() => {
    refetch();
  }, [selectedStatus, refetch]);
  const SearchFn = (e: FormEvent) => {
    e.preventDefault();
    setSearch(false);
    refetch();
  };
  useEffect(() => {
    if (searchValue.trim() === "") {
      refetch();
    }
  }, [searchValue, refetch]);
  const Hiring = (id: string) => {
    Myaxios.post("/api/staff/return-work-staff", { _id: id }).then(() => {
      toast.success("Ishga qaytarishdingiz");
      refetch();
    });
  };
  const Info = ({ _id }: { _id: string }) => {
    Myaxios.get(`/api/staff/info/${_id}`)
      .then((res) => {
        setUserInfo(res.data.data);
        setInfo(true);
      })
      .catch(() => toast.error("Nimadur xato boshqatdan urinib koring!"));
  };
  return (
    <div className=" relative">
      <div className="flex items-center justify-between  gap-2 ">
        <h2 className="text-xl font-semibold mb-4 max-[525px]:text-lg max-[385px]:text-[16px] max-[355px]:hidden truncate">
          Administratorlar ro&apos;yxati
        </h2>
        <div className="flex items-center gap-4 max-[470px]:gap-2 max-[460px]:  ">
          {(params.search?.length ?? 0) > 0 && (
            <Button size="sm" className="mb-4" variant="secondary">
              {searchValue !== "" && (
                <p className="font-medium truncate max-w-[40px]  ">
                  {searchValue}
                </p>
              )}
              <div
                onClick={() => {
                  setSearchValue("");
                }}
              >
                <X className="h-4 w-4" />
              </div>
            </Button>
          )}

          <Popover open={search} onOpenChange={setSearch}>
            <PopoverTrigger asChild>
              <Button size="sm" className="mb-4" variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Qidirish
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <Command>
                <CommandInput
                  placeholder="Administrator ismi yoki email..."
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList>
                  <CommandEmpty>Natija topilmadi</CommandEmpty>
                  <CommandGroup heading="Qidiruv">
                    <CommandItem onSelect={() => {
                      refetch();
                      setSearch(false);
                    }}>
                      <Search className="mr-2 h-4 w-4" />
                      <span>Qidirish</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {user?.role == "manager" && <Admin_tools />}
          <div className="mb-4">
            <Select onValueChange={handleSelectChange} value={selectedStatus}>
              <SelectTrigger className="w-fit">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="ta'tilda">Tatilda</SelectItem>
                  <SelectItem value="ishdan bo'shatilgan">Nofaol</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader className="">
          <TableRow>
            <TableHead>Ism</TableHead>
            <TableHead>Familiya</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Holat</TableHead>
            <TableHead className="text-center">Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading || isError
            ? data?.map((user: User, idx: number) => (
              <TableRow key={user._id ? user._id : idx}>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell className="text-right space-x-2 flex justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="">
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          form.setValue("email", user.email);
                          form.setValue("last_name", user.last_name);
                          form.setValue("first_name", user.first_name);
                          setOpen(true);
                        }}
                        className={`${user.status == "ishdan bo'shatilgan" && "hidden"
                          } `}
                      >
                        Tahrirlash
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`${user.status == "ishdan bo'shatilgan" && "hidden"
                          } `}
                        onClick={() => delteAdmin(user)}
                      >
                        O&apos;chirish
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`${user.status == "ishdan bo'shatilgan" && "hidden"
                          } ${user.status == "ta'tilda" && "hidden"}`}
                        onClick={() => setTatil({ bool: true, id: user._id })}
                      >
                        Ta&apos;tilga chiqarish
                      </DropdownMenuItem>
                      {user.status == "ta'tilda" && (
                        <DropdownMenuItem
                          onClick={() => tatildanChiqish(user._id)}
                        >
                          Tatildan chiqrish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className={`${user.status == "faol" && "hidden"} ${user.status == "ta'tilda" && "hidden"
                          }`}
                        onClick={() => Hiring(user._id)}
                      >
                        Ishga qaytarish
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          Info({ _id: user._id });
                        }}
                      >
                        Info
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
            : Array(10)
              .fill(1)
              .map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="">
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Tahrirlash</DropdownMenuItem>
                        <DropdownMenuItem>O&apos;hirish</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      {/* edit modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit admins</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(editAdmin)}
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
      {/* tatil modal */}
      <Dialog
        open={tatil.bool}
        onOpenChange={() => setTatil({ bool: !tatil.bool, id: "" })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tatilga chiqarish</DialogTitle>
          </DialogHeader>
          <Form {...tatilForm}>
            <form
              onSubmit={tatilForm.handleSubmit(tatilFn)}
              className="grid gap-4 py-4"
            >
              <FormField
                control={tatilForm.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Boshlanish sanasi
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="2025-05-1" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={tatilForm.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Tugash sanasi
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="2025-05-1" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={tatilForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Sabab</FormLabel>
                    <FormControl>
                      <Input placeholder="Tobi yoq" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Yuborish</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* Info */}
      <Dialog open={info} onOpenChange={setInfo}>
        {userinfo?._id && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Administrator profili</h2>
                  <p className="text-sm text-muted-foreground">
                    Batafsil ma'lumot va statistika
                  </p>
                </div>
                <Badge
                  variant={userinfo.status === 'faol' ? 'default' : userinfo.status === "ta'tilda" ? 'secondary' : 'destructive'}
                  className="text-sm px-3 py-1"
                >
                  {userinfo.status}
                </Badge>
              </div>

              {/* Profile Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-6">
                    {/* Avatar and Name Section */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        {userinfo.image ? (
                          <AvatarImage src={userinfo.image} alt={userinfo.first_name} />
                        ) : (
                          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                            {userinfo.first_name[0] + userinfo.last_name[0]}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">
                          {userinfo.first_name} {userinfo.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{userinfo.role}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-medium break-all">{userinfo.email}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <ShieldCheck className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Rol:</span>
                            <Badge variant="outline" className="text-xs w-fit mt-1">
                              {userinfo.role}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Holat:</span>
                            <Badge
                              variant={userinfo.status === 'faol' ? 'default' : 'secondary'}
                              className="text-xs w-fit mt-1"
                            >
                              {userinfo.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Ro'yxatdan o'tgan:</span>
                            <span className="font-medium">
                              {userinfo.createdAt ? new Date(userinfo.createdAt).toLocaleDateString("uz-UZ") : "—"}
                            </span>
                          </div>
                        </div>
                        {userinfo.work_date && (
                          <div className="flex items-start gap-2 text-sm">
                            <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">Ish boshlagan:</span>
                              <span className="font-medium">
                                {new Date(userinfo.work_date).toLocaleDateString("uz-UZ")}
                              </span>
                            </div>
                          </div>
                        )}
                        {userinfo.work_end && (
                          <div className="flex items-start gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-muted-foreground">Ish tugagan:</span>
                              <span className="font-medium">
                                {new Date(userinfo.work_end).toLocaleDateString("uz-UZ")}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Ish tajribasi
                    </CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userinfo.work_date
                        ? Math.floor((Date.now() - new Date(userinfo.work_date).getTime()) / (1000 * 60 * 60 * 24 * 30))
                        : 0} oy
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Platformada
                    </p>
                    <Progress value={60} className="mt-2" />
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Hisob holati
                    </CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {userinfo.status === 'faol' ? 'Faol' : userinfo.status}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Joriy holat
                    </p>
                    <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                      <TrendingUp className="h-3 w-3" />
                      <span>Barqaror</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Xavfsizlik
                    </CardTitle>
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {userinfo.role}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Administrator huquqlari
                    </p>
                    <Progress value={100} className="mt-2" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
export default AdminsTableComponent;
