"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, Plus, X } from "lucide-react";
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
import { useAddTeacherMutaion } from "@/request/mutation";
import { Myaxios } from "@/request/axios";
import { CourseType } from "@/types";
import useDebounce from "@/shared/generics/debounse";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const formSchema = z.object({
  email: z.string().email("To‘g‘ri email kiriting").min(5),
  last_name: z.string().min(5),
  first_name: z.string().min(5),
  password: z.string().min(8),
  phone: z
    .string()
    .min(5)
    .startsWith("+998", { message: "Iltimos O'zbek nomeridan kiring" }),
  course_id: z.string(),
});
export interface AddTeacherType {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  course_id: string;
}
const Teacher_tools = () => {
  const { mutate, isPending } = useAddTeacherMutaion();
  const [open, setOpen] = useState(false);
  const [teacherId, setTeacherId] = useState<{ name: string; id: string }>({
    name: "",
    id: "",
  });
  const [searchValue, setSearchValue] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      course_id: "",
    },
  });
  const addAdmin = (values: z.infer<typeof formSchema>) => {
    mutate(
      { ...values, course_id: teacherId.id },
      {
        onSuccess() {
          form.reset();
          setOpen(false);
        },
      }
    );
    form.reset();
    setOpen(false);
  };
  const debounce = useDebounce<string>(searchValue, 500);

  const { data, isLoading, refetch } = useQuery<CourseType[]>({
    queryKey: ["search-course"],
    queryFn: () =>
      Myaxios.get("/api/group/search-course", {
        params: { name: debounce },
      }).then((res) => res.data.data),
    enabled: debounce.trim() !== "",
  });
  useEffect(() => {
    if (debounce.trim() !== "") {
      refetch();
    }
  }, [debounce, refetch, data, searchValue]);
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => setOpen(!open)}
        className="mb-4 flex items-center justify-center "
        size="sm"
      >
        <Plus />
        <p className="max-[620px]:hidden">Ustoz Qo&apos;shish</p>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ustoz Qo&apos;shish</DialogTitle>
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

              <FormField
                control={form.control}
                name="course_id"
                render={() => (
                  <FormItem className="relative ">
                    <FormLabel className="text-foreground">
                      Ustoz Sohasi
                    </FormLabel>
                    <FormControl>
                      <div>
                        {teacherId.id ? (
                          <div className="flex items-center justify-between">
                            <Input
                              className="w-[93%]"
                              readOnly
                              value={teacherId.name}
                            />
                            <X
                              onClick={() => {
                                setTeacherId({ name: "", id: "" });
                                setSearchValue("");
                              }}
                            />
                          </div>
                        ) : (
                          <div>
                            <Input
                              value={searchValue}
                              placeholder="Frontend"
                              onChange={(e) => setSearchValue(e.target.value)}
                            />
                            {data?.length && (
                              <div
                                className={`absolute  overflow-y-auto h-[200px] top-17 rounded-xl p-2 flex flex-col gap-3  border border-accent-foreground/40 bg-[#161514] w-full  ${
                                  data?.length > 4
                                    ? "!h-[140px] !pb-0"
                                    : "h-fit !pb-3"
                                }  `}
                              >
                                <Table>
                                  <TableHeader>
                                    <TableRow className="sticky top-0 bg-[#161514] ">
                                      <TableHead className="w-[30px]">
                                        No
                                      </TableHead>
                                      <TableHead>Nomi</TableHead>
                                      <TableHead>Narxi</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {!isLoading
                                      ? data?.map(
                                          (
                                            teacher: CourseType,
                                            idx: number
                                          ) => (
                                            <TableRow
                                              key={teacher._id}
                                              onClick={() =>
                                                setTeacherId({
                                                  id: teacher._id,
                                                  name: teacher.name.name,
                                                })
                                              }
                                            >
                                              <TableCell className="text-center">
                                                {idx + 1}
                                              </TableCell>
                                              <TableCell className="pl-2 font-medium">
                                                {teacher.name.name}
                                              </TableCell>
                                              <TableCell>
                                                {teacher.price}
                                              </TableCell>
                                              {/* <TableCell
                                                onClick={() =>
                                                  router.push(
                                                    `teachers/${teacher._id}`
                                                  )
                                                }
                                                className="pr-3"
                                              >
                                                <Info />
                                              </TableCell> */}
                                            </TableRow>
                                          )
                                        )
                                      : "..loading"}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    {/* <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Ustoz yo'nalishini tanlang" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectCourse?.map((value) => (
                          <SelectItem key={value._id} value={value.name.name}>
                            {value.name.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> */}
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+998 123 45 67" {...field} />
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
                    <FormLabel className="text-foreground">Password</FormLabel>
                    <FormControl>
                      <Input placeholder="*******" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">
                  {isPending ? (
                    <Loader className="animate-spin " />
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teacher_tools;
