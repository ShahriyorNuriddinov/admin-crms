"use client";
import { Myaxios } from "@/request/axios";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { TeacherType } from "@/types";
import { Loader, Mail, Phone, Calendar, Briefcase, TrendingUp, Users, DollarSign, Award } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";

interface Id {
  id: string;
}

const InfoComponents = ({ id }: Id) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["teacher-info", id],
    queryFn: () =>
      Myaxios.get(`/api/teacher/get-teacher/${id}`).then(
        (res: { data: { data: TeacherType } }) => res.data.data
      ),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (isError || !data) {
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
      case 'faol': return 'default';
      case "ta'tilda": return 'secondary';
      case "ishdan bo'shatilgan": return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">O'qituvchi profili</h2>
          <p className="text-muted-foreground">
            Batafsil ma'lumot va statistika
          </p>
        </div>
        <Badge variant={getStatusBadge(data.status)} className="text-sm px-3 py-1">
          {data.status}
        </Badge>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="h-32 w-32">
                {data.image ? (
                  <AvatarImage src={data.image} alt={data.first_name} />
                ) : (
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold">
                  {data.first_name} {data.last_name}
                </h3>
                <p className="text-muted-foreground">{data.field}</p>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden md:block" />

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{data.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Telefon:</span>
                  <span className="font-medium">{data.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Yo'nalish:</span>
                  <span className="font-medium">{data.field}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ish boshlagan:</span>
                  <span className="font-medium">
                    {new Date(data.work_date).toLocaleDateString("uz-UZ")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ro'yxatdan o'tgan:</span>
                  <span className="font-medium">
                    {new Date(data.createdAt).toLocaleDateString("uz-UZ")}
                  </span>
                </div>
                {data.work_end && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Ish tugagan:</span>
                    <span className="font-medium">
                      {new Date(data.work_end).toLocaleDateString("uz-UZ")}
                    </span>
                  </div>
                )}
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
              Oylik maosh
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.salary?.toLocaleString()} so'm
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Joriy oy uchun
            </p>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Guruhlar soni
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.groups?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Faol guruhlar
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
              O'quvchilar
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.groups?.reduce((sum, group) => sum + (group.students?.length || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Jami o'quvchilar
            </p>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
              <TrendingUp className="h-3 w-3" />
              <span>+12% bu oyda</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Ish tajribasi
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor((Date.now() - new Date(data.work_date).getTime()) / (1000 * 60 * 60 * 24 * 30))} oy
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Platformada
            </p>
            <Progress value={60} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Groups Section */}
      {data.groups && data.groups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Guruhlar</CardTitle>
            <CardDescription>
              O'qituvchi boshqarayotgan barcha guruhlar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.groups.map((group, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{group.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">O'quvchilar:</span>
                      <Badge variant="secondary">{group.students?.length || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline">Faol</Badge>
                    </div>
                    <Separator className="my-2" />
                    <div className="text-xs text-muted-foreground">
                      Boshlangan: {new Date(group.started_group).toLocaleDateString("uz-UZ")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InfoComponents;
