"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Myaxios } from "@/request/axios";
import { Skeleton } from "../ui/skeleton";
import { notificationApi } from "@/shared/generics/notification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
const TableComponent = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ashb"],
    queryFn: () =>
      Myaxios.get("/api/staff/all-managers").then((res) => res.data.data),
  });
  const notify = notificationApi();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Menejerlar ro&apos;yxati
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ismi</TableHead>
            <TableHead>Familiyasi</TableHead>
            <TableHead>Elektron pochta</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Harakatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading || isError
            ? data?.map((user: User) => (
              <TableRow key={user._id}>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell
                  onClick={() => notify("error_admin")}
                  className="text-right space-x-2 flex justify-center "
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="">
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Tahrirlash</DropdownMenuItem>
                      <DropdownMenuItem>O&apos;chirish</DropdownMenuItem>
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
    </div>
  );
};

export default TableComponent;
