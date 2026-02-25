import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "../../ui/dialog";
import { Plus, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Myaxios } from "@/request/axios";
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
import { useAddStrudentMutation } from "@/request/mutation";
import { GroupType } from "@/types";
import { Params } from "next/dist/server/request/params";
const formSchema = z.object({
  first_name: z.string().min(5),
  last_name: z.string(),
  phone: z
    .string()
    .startsWith("+", { message: "iltimos O'zbek raqamidan kirning" }),
  groups: z.array(
    z.object({
      group: z.string(),
    })
  ),
});
export interface AddStudentType {
  first_name: string;
  last_name: string;
  phone: string;
  groups: [
    {
      group: string;
    }
  ];
}
interface GroupStudentType {
  name: string;
  id: string;
}
const Student_tools = () => {
  const { mutate } = useAddStrudentMutation();
  const [open, setOpen] = useState(false);
//   const router = useRouter();
  const [group, setGroup] = useState<GroupStudentType>({
    name: "",
    id: "",
  });
  const [searchValue, setSearchValue] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      groups: [{ group: "" }],
    },
  });
  const debounce = useDebounce<string>(searchValue, 500);
  const params: Params = {};
  if (debounce.trim() !== "") {
    params.name = searchValue;
  }
  const addStundent = (values: z.infer<typeof formSchema>) => {
    mutate(
      { ...values, groups: [{ group: group.id }] },
      {
        onSuccess() {
          setGroup({
            name: "",
            id: "",
          });
          form.reset();
          setSearchValue("");
          setOpen(false);
        },
      }
    );
    setGroup({
      name: "",
      id: "",
    });
    form.reset();
    setOpen(false);
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["search-guruh"],
    queryFn: () => Myaxios.get("/api/student/search-group", { params }),
    enabled: Object.keys(params).length > 0,
  });
  useEffect(() => {
    if (debounce.trim() !== "" || searchValue.trim() !== "") {
      refetch();
    }
  }, [debounce, refetch, searchValue]);
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => setOpen(!open)}
        className="mb-4 flex items-center justify-center "
        size="sm"
      >
        <Plus />
        <p className="max-[620px]:hidden">Student Qo&apos;shish</p>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={`min-w-[600px] ${data && "min-h-[400px] !pb-20"} ${
            group.id && "min-h-[200px] !pb-0"
          } ${!data?.data?.data?.length && " !pb-0"} max-[649px]:!min-w-[10px] `}
        >
          <DialogHeader>
            <DialogTitle>Tahrirlash</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(addStundent)}
              className="grid gap-5 py-4 items-start "
            >
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Ism</FormLabel>
                    <FormControl>
                      <Input placeholder="Davron" {...field} />
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
                    <FormLabel className="text-foreground">Famiyla</FormLabel>
                    <FormControl>
                      <Input placeholder="Raimjonov" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="groups"
                render={({ field }) => (
                  <FormItem className="relative ">
                    <FormLabel className="text-foreground">Guruh</FormLabel>
                    <FormControl>
                      <div>
                        {group.id ? (
                          <div className="flex items-center justify-between">
                            <Input
                              className="w-[93%]"
                              readOnly
                              value={group.name}
                            />
                            <X onClick={() => setGroup({ name: "", id: "" })} />
                          </div>
                        ) : (
                          <div>
                            <Input
                              {...field}
                              value={searchValue}
                              placeholder="Frontend N1"
                              onChange={(e) => setSearchValue(e.target.value)}
                            />
                            {data?.data?.data?.length && (
                              <div
                                className={`absolute  overflow-y-auto h-[200px] top-17 rounded-xl p-2 flex flex-col gap-3  border border-accent-foreground/40 bg-[#161514] w-full  ${
                                  !data?.data?.data?.length &&
                                  "!h-[140px] !pb-0"
                                } ${debounce.trim() == "" && "hidden"} `}
                              >
                                <Table>
                                  <TableHeader>
                                    <TableRow className="sticky top-0 bg-[#161514] ">
                                      <TableHead className="w-[30px]">
                                        No
                                      </TableHead>
                                      <TableHead>Guruh</TableHead>
                                      <TableHead>Ustoz</TableHead>
                                      <TableHead>Haqida</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {!isLoading || !isError
                                      ? data?.data?.data?.map(
                                          (value: GroupType, idx: number) => (
                                            <TableRow
                                              key={value._id}
                                              onClick={() => {
                                                setGroup({
                                                  id: value._id,
                                                  name: value.name,
                                                });
                                              }}
                                            >
                                              <TableCell className="text-center">
                                                {idx + 1}
                                              </TableCell>
                                              <TableCell className="font-medium">
                                                {value.name}
                                              </TableCell>
                                              <TableCell>
                                                {value.teacher.first_name +
                                                  " " +
                                                  value.teacher.last_name}
                                              </TableCell>
                                              {/* <TableCell
                                                // onClick={() =>
                                                //   router.push(
                                                //     `teachers/${teacher._id}`
                                                //   )
                                                // }
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
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Telefon raqam
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+998900000000" {...field} />
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

export default Student_tools;
