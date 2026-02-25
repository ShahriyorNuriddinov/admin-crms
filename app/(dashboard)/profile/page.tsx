"use client";

import React, { useState, useEffect, useRef } from "react";
import { CircleUser, Calendar, Mail, Shield, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Cookies from "js-cookie";
import { Myaxios } from "@/request/axios";
import { User } from "@/types";
import Profile_tools from "@/components/profile-update";
import Image from "next/image";

const Profile = () => {
  const [userInfo, setUserInfo] = useState<Partial<User>>({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    createdAt: "",
    image: "",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [, setFile] = useState<File | null>(null);

  const cookieData = Cookies.get("user");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookieData = Cookies.get("user");
      if (cookieData) {
        const parsed = JSON.parse(cookieData);
        setUserInfo(parsed);
      }
    }
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      await handleUpload(selectedFile);
    }
  };

  const handleUpload = async (selectedFile: File) => {
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const res = await Myaxios.post("/api/auth/edit-profile-img", formData);
      if (res.data.message == "success") {
        const data = await res.data.data;
        setUserInfo({ ...userInfo, image: data.image });
        const parsed: User = JSON.parse(cookieData!);
        Cookies.set("user", JSON.stringify({ ...parsed, image: data.image }));
        window.location.reload();
        if (data.imageUrl) {
          setUserInfo((prev) => ({ ...prev, image: data.imageUrl }));
        }
      }
    } catch (err) {
      <div className="hidden">{JSON.stringify(err)}</div>;
    }
  };

  const getInitials = () => {
    return `${userInfo.first_name?.[0] || ''}${userInfo.last_name?.[0] || ''}`.toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'manager': return 'default';
      case 'teacher': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profil</h2>
        <p className="text-muted-foreground">
          Shaxsiy ma'lumotlaringizni boshqaring
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profil rasmi</CardTitle>
            <CardDescription>Rasmingizni yangilang</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <Avatar className="h-32 w-32">
                {userInfo.image ? (
                  <AvatarImage src={userInfo.image} alt={userInfo.first_name} />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="h-8 w-8 text-white" />
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">
                {userInfo?.first_name} {userInfo?.last_name}
              </h3>
              <Badge variant={getRoleBadgeVariant(userInfo.role || '')}>
                <Shield className="h-3 w-3 mr-1" />
                {userInfo?.role?.toUpperCase()}
              </Badge>
            </div>

            <Separator />

            <div className="w-full space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{userInfo?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Qo'shilgan: {new Date(userInfo.createdAt!).toLocaleDateString("uz-UZ")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
            <CardDescription>
              Profilingiz haqida batafsil ma'lumot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ism</label>
                <Input value={userInfo?.first_name} readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Familiya</label>
                <Input value={userInfo?.last_name} readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email manzil</label>
                <Input value={userInfo?.email} readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rol</label>
                <Input
                  value={userInfo?.role?.charAt(0).toUpperCase() + userInfo?.role?.slice(1)}
                  readOnly
                />
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium">Hisob sozlamalari</h4>
                <p className="text-sm text-muted-foreground">
                  Ma'lumotlaringizni yangilang yoki parolni o'zgartiring
                </p>
              </div>
              <Profile_tools userInfo={userInfo} setUserInfo={setUserInfo} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Faol kunlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor((Date.now() - new Date(userInfo.createdAt!).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <p className="text-xs text-muted-foreground">
              Ro'yxatdan o'tganingizdan beri
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Hisob holati
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Faol</div>
            <p className="text-xs text-muted-foreground">
              Hisob to'liq faollashtirilgan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Xavfsizlik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Yaxshi</div>
            <p className="text-xs text-muted-foreground">
              Barcha sozlamalar yoqilgan
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
