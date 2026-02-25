"use client";
import { Myaxios } from "@/request/axios";
import { useQuery } from "@tanstack/react-query";
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
import { studentType } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Search, X, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../ui/command";
import { Skeleton } from "../ui/skeleton";
import { Params } from "next/dist/server/request/params";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Student_tools from "./student-add";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Student_addGroup from "./addStudent-group";
const StudentsComponents = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [tatildaValue, setTatildaValue] = useState<{
    leave_days: string;
    reason: string;
  }>({
    leave_days: "",
    reason: "",
  });
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [search, setSearch] = useState(false);
  const [addgroup, setAddgroup] = useState(false);
  const [tatilBoll, setTatilBool] = useState(false);
  const [tatil, setTatil] = useState({ id: "" });
  const [student, setStudent] = useState<studentType>();
  const router = useRouter();
  // const [searchValue, setSearchValue] = useState<string>("");
  const params: Params = {};
  if (selectedStatus !== "all") {
    params.status = selectedStatus;
  }
  if (searchValue.trim() !== "") {
    params.search = searchValue.trim();
  }
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["students"],
    queryFn: () =>
      Myaxios.get(
        "/api/student/get-all-students",
        Object.keys(params).length > 0 ? { params } : {}
      ),
  });
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
  const delteStudent = (_id: string) => {
    Myaxios.delete("/api/student/delete-student", { data: { _id: _id } }).then(
      (res) => {
        toast.success(res.data.message);
        refetch();
      }
    );
  };
  const returnStudent = (_id: string) => {
    Myaxios.post("/api/student/return-student", { _id: _id }).then((res) => {
      toast.success(res.data.message);
      refetch();
    });
  };
  const leaveStudent = (e: FormEvent) => {
    e.preventDefault();
    Myaxios.post("/api/student/leave-student", {
      ...tatildaValue,
      student_id: tatil.id,
    }).then((res) => {
      toast.success(res.data.message);
      refetch();
      setTatildaValue({ leave_days: "", reason: "" });
      setTatilBool(false);
      setTatil({ id: "" });
    });
  };
  const returnLeaveStudent = (_id: string) => {
    Myaxios.post("/api/student/return-leave-student", { _id: _id }).then(
      (res) => {
        toast.success(res.data.message);
        refetch();
      }
    );
  };
  return (
    <div>
      <div className="flex items-center justify-between  gap-2 ">
        <h2 className="text-xl font-semibold mb-4 max-[525px]:text-lg max-[385px]:text-[16px] max-[355px]:hidden truncate">
          O'quvchilar ro&apos;yxati
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
                  placeholder="O'quvchi ismi yoki telefon..."
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

          <Student_tools />
          <div className="mb-4">
            <Select onValueChange={handleSelectChange} value={selectedStatus}>
              <SelectTrigger className="w-fit">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="faol">Faol</SelectItem>
                  <SelectItem value="ta'tilda">Tatilda</SelectItem>
                  <SelectItem value="yakunladi">Yakunladi</SelectItem>
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
            <TableHead>Telefon raqam</TableHead>
            <TableHead>Guruhlar soni</TableHead>
            <TableHead>Holat</TableHead>
            <TableHead className="text-center">Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && !isError && data
            ? data?.data.data?.map((student: studentType, idx: number) => (
              <TableRow key={student._id ? student._id : idx}>
                <TableCell>{student.first_name}</TableCell>
                <TableCell>{student.last_name}</TableCell>
                <TableCell>
                  {student.phone.startsWith("+")
                    ? student.phone
                    : `+${student.phone}`}
                </TableCell>
                <TableCell className="capitalize pl-13">
                  {student.groups.length}
                </TableCell>
                <TableCell>{student.status}</TableCell>
                <TableCell className=" space-x-2 flex justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="">
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => delteStudent(student._id)}
                      >
                        O&apos;chirish
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`${student.status !== "yakunladi" && "hidden"
                          }`}
                        onClick={() => returnStudent(student._id)}
                      >
                        Orqaga qaytarish
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`${student.status !== "faol" && "hidden"
                          } `}
                        onClick={() => {
                          setTatil({ id: student._id });
                          setTatilBool(true);
                        }}
                      >
                        Ta&apos;tilga chiqarish
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`${student.status == "yakunladi" && "hidden"
                          } ${student.status == "faol" && "hidden"}`}
                        onClick={() => returnLeaveStudent(student._id)}
                      >
                        Ta&apos;tildan qaytarish
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`${student.status == "yakunladi" && "hidden"
                          } ${student.status == "ta'tilda" && "hidden"} `}
                        onClick={() => {
                          setAddgroup(true);
                          setStudent(student);
                        }}
                      >
                        Yangi guruhga qo&apos;shish
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          router.push(`students/${student._id}`);
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
      <Student_addGroup
        student={student!}
        setAddgroup={setAddgroup}
        addgroup={addgroup}
      />
      <Dialog open={tatilBoll} onOpenChange={setTatilBool}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tatilga chiqarish</DialogTitle>
          </DialogHeader>
          <form onSubmit={leaveStudent} className="flex flex-col gap-5">
            <Input
              value={tatildaValue.leave_days}
              onChange={(e) =>
                setTatildaValue({ ...tatildaValue, leave_days: e.target.value })
              }
              type="text"
              placeholder="10"
            />
            <Input
              value={tatildaValue.reason}
              onChange={(e) =>
                setTatildaValue({ ...tatildaValue, reason: e.target.value })
              }
              type="text"
              placeholder="Tobi yoq"
            />
            <Button type="submit">Save changes</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsComponents;
