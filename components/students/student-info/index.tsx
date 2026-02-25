"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Myaxios } from "@/request/axios";
import { studentType } from "@/types";
import React, { useEffect, useState } from "react";
import {
  Phone,
  Calendar,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader
} from "lucide-react";

const Student_info_component = ({ id }: { id: string }) => {
  const [data, setData] = useState<studentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Myaxios.get(`/api/student/student/${id}`)
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Ma'lumot topilmadi</p>
      </div>
    );
  }

  const getInitials = () => {
    return `${data.first_name?.[0] || ''}${data.last_name?.[0] || ''}`.toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'faol': return { variant: 'default' as const, icon: <CheckCircle2 className="h-3 w-3" /> };
      case "ta'tilda": return { variant: 'secondary' as const, icon: <Clock className="h-3 w-3" /> };
      case 'yakunladi': return { variant: 'outline' as const, icon: <Award className="h-3 w-3" /> };
      default: return { variant: 'outline' as const, icon: <AlertCircle className="h-3 w-3" /> };
    }
  };

  const statusInfo = getStatusBadge(data.status);
  const activeGroups = data.groups.filter(g => g.status === 'faol').length;
  const completedGroups = data.groups.filter(g => g.status === 'yakunladi').length;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">O'quvchi profili</h2>
          <p className="text-muted-foreground">
            Batafsil ma'lumot va o'quv jarayoni
          </p>
        </div>
        <Badge variant={statusInfo.variant} className="text-sm px-3 py-1 gap-1">
          {statusInfo.icon}
          {data.status}
        </Badge>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold">
                  {data.first_name} {data.last_name}
                </h3>
                <p className="text-muted-foreground">O'quvchi</p>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden md:block" />

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Telefon:</span>
                  <span className="font-medium">
                    {data.phone.startsWith("+") ? data.phone : "+" + data.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Guruhlar:</span>
                  <span className="font-medium">{data.groups.length} ta</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Faol guruhlar:</span>
                  <span className="font-medium">{activeGroups} ta</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ro'yxatdan o'tgan:</span>
                  <span className="font-medium">
                    {new Date(data.createdAt).toLocaleDateString("uz-UZ")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Yakunlagan:</span>
                  <span className="font-medium">{completedGroups} ta guruh</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ta'til:</span>
                  <span className="font-medium">{data.leave_history.length} marta</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Jami guruhlar
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.groups.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Barcha guruhlar
            </p>
            <Progress value={(activeGroups / data.groups.length) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Faol guruhlar
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeGroups}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Hozirda o'qiyapti
            </p>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
              <TrendingUp className="h-3 w-3" />
              <span>Faol</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Yakunlangan
            </CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{completedGroups}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Muvaffaqiyatli yakunlangan
            </p>
            <Progress value={(completedGroups / data.groups.length) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Ta'til kunlari
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {data.leave_history.reduce((sum, leave) => sum + parseInt(leave.days), 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Jami ta'til kunlari
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {data.leave_history.length} marta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Groups and Leave History */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Groups Table */}
        <Card>
          <CardHeader>
            <CardTitle>O'qiyotgan guruhlar</CardTitle>
            <CardDescription>
              Barcha guruhlar ro'yxati va holati
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.groups.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>№</TableHead>
                      <TableHead>Guruh</TableHead>
                      <TableHead>Holat</TableHead>
                      <TableHead>Qo'shilgan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.groups.map((value, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{idx + 1}</TableCell>
                        <TableCell>{value.group.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant={value.status === 'faol' ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {value.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(value.joinedAt).toLocaleDateString("uz-UZ")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                Guruhlar mavjud emas
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leave History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ta'til tarixi</CardTitle>
            <CardDescription>
              Barcha ta'tillar ro'yxati
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.leave_history.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>№</TableHead>
                      <TableHead>Kunlar</TableHead>
                      <TableHead>Sabab</TableHead>
                      <TableHead>Muddat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.leave_history.map((value, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{idx + 1}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{value.days} kun</Badge>
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {value.reason}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(value.start_date).toLocaleDateString("uz-UZ")} - {new Date(value.end_date).toLocaleDateString("uz-UZ")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                Ta'til tarixi mavjud emas
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Student_info_component;
