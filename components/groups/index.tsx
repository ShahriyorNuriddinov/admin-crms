"use client";
import { Myaxios } from "@/request/axios";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { deleteGroupType, EditGroupType, GroupType } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import Group_add_tool from "./group_add";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "../ui/dialog";
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
import { Input } from "../ui/input";
import { useEditGroupMutation } from "@/request/mutation";
import { toast } from "react-toastify";
const formSchema = z.object({
  date: z.string(),
});

const GroupComponents = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [groupDetailsForEdit, setGroupDetailsForEdit] = useState<GroupType>();
  const { mutate } = useEditGroupMutation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      Myaxios.get("/api/group/get-all-group").then((res) => res.data.data),
  });
  const deleteGroup = ({ _id }: deleteGroupType) => {
    Myaxios.delete("/api/group/end-group", { data: { _id } })
      .then(() => {
        toast.success("Muvoffaqatli tugatildi!");
        refetch();
      })
      .catch(() => {
        toast.success("Nimadur xato qayta urinib ko'ring!");
      });
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
    },
  });
  const editGroup = (values: z.infer<typeof formSchema>) => {
    const value: EditGroupType = {
      ...values,
      _id: groupDetailsForEdit?._id as string,
    };
    mutate(value, {
      onSuccess() {
        refetch();
        toast.success("Muvoffaqatli guruh tugatildi!");
        setOpenEdit(false);
        form.reset();
      },
    });
  };

  return (
    <div>
      <div>
        <div className="flex items-center justify-between  gap-2 ">
          <h2 className="text-xl font-semibold mb-4 max-[525px]:text-lg max-[385px]:text-[16px] max-[355px]:hidden truncate">
            Guruhlar ro&apos;yxati
          </h2>
          <div className="flex items-center gap-4 max-[470px]:gap-2 max-[460px]:  ">
            <Group_add_tool tool={refetch} />
          </div>
        </div>
        <Table>
          <TableHeader className="">
            <TableRow>
              <TableHead className=" text-center">No</TableHead>
              <TableHead>Guruh nomi</TableHead>
              <TableHead>Ustoz</TableHead>
              <TableHead className=" text-center">
                O&apos;quvchilar soni
              </TableHead>
              <TableHead>Boshlangan vaqti</TableHead>
              <TableHead>Tugagan vaqti</TableHead>
              <TableHead className=" text-center">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading || isError
              ? data?.map((group: GroupType, idx: number) => (
                <TableRow key={group._id ? group._id : idx}>
                  <TableCell className="text-center">{idx + 1}</TableCell>
                  <TableCell className="">{group.name}</TableCell>
                  <TableCell>
                    {group.teacher.first_name + " " + group.teacher.last_name}
                  </TableCell>
                  <TableCell className="capitalize text-center ">
                    {group.students?.length ?? 0}
                  </TableCell>
                  <TableCell>
                    {new Date(group.started_group).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {group.end_group == null
                      ? "Davom etmoqda"
                      : new Date(group.end_group).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center space-x-2 flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className="">
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {
                          <DropdownMenuItem
                            onClick={() => {
                              setOpenEdit(true);
                              form.setValue(
                                "date",
                                group.started_group.slice(0, 10)
                              );
                              setGroupDetailsForEdit(group);
                            }}
                          >
                            Tugash vaqtini belgilash
                          </DropdownMenuItem>
                        }
                        {
                          <DropdownMenuItem
                            onClick={() => {
                              deleteGroup({ _id: group._id });
                            }}
                          >
                            Guruhni tugatish
                          </DropdownMenuItem>
                        }
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
      </div>
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guruhni tahrirlash</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(editGroup)}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Sana</FormLabel>
                    <FormControl>
                      <Input placeholder="2025-05-05" {...field} />
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
    </div>
  );
};

export default GroupComponents;
