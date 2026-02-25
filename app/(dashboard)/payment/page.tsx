"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Myaxios } from "@/request/axios";
import { PaymentsModal } from "@/components/payment";
import { DollarSign, TrendingUp, Users, CreditCard } from "lucide-react";

interface PaymentType {
  _id: string;
  student: {
    first_name: string;
    last_name: string;
  };
  group: {
    name: string;
  };
  payment_price: number;
  month: string;
  method: string;
  paidAt: string;
}

const PaymentsPage = () => {
  const { data, isLoading, refetch } = useQuery<PaymentType[]>({
    queryKey: ["payments"],
    queryFn: async () => {
      const response = await Myaxios.get("/api/payment/get-debtors");
      return response.data.data;
    },
  });

  const totalPayments = data?.reduce((sum, payment) => sum + payment.payment_price, 0) || 0;
  const totalStudents = new Set(data?.map(p => p.student.first_name + p.student.last_name)).size;

  const getMethodBadge = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cash': return 'default';
      case 'card': return 'secondary';
      case 'transfer': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">To'lovlar</h2>
          <p className="text-muted-foreground">
            Barcha to'lovlarni kuzatib boring
          </p>
        </div>
        <PaymentsModal refetch={refetch} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Jami to'lovlar
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPayments.toLocaleString()} so'm
            </div>
            <p className="text-xs text-muted-foreground">
              Ushbu oyda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              To'lovlar soni
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Jami to'lovlar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              O'quvchilar
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              To'lov qilgan o'quvchilar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              O'rtacha to'lov
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.length ? Math.round(totalPayments / data.length).toLocaleString() : 0} so'm
            </div>
            <p className="text-xs text-muted-foreground">
              Har bir to'lov uchun
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>To'lovlar tarixi</CardTitle>
          <CardDescription>
            Barcha to'lovlarning batafsil ro'yxati
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>O'quvchi</TableHead>
                <TableHead>Guruh</TableHead>
                <TableHead>Miqdor</TableHead>
                <TableHead>Oy</TableHead>
                <TableHead>Usul</TableHead>
                <TableHead>Sana</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : data && data.length > 0 ? (
                data.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell className="font-medium">
                      {payment.student.first_name} {payment.student.last_name}
                    </TableCell>
                    <TableCell>{payment.group.name}</TableCell>
                    <TableCell className="font-semibold">
                      {payment.payment_price.toLocaleString()} so'm
                    </TableCell>
                    <TableCell>{payment.month}</TableCell>
                    <TableCell>
                      <Badge variant={getMethodBadge(payment.method)}>
                        {payment.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(payment.paidAt).toLocaleDateString("uz-UZ")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Hozircha to'lovlar yo'q
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;
