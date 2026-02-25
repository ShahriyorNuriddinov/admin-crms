"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Lock, User, Palette, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Settings() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sozlamalar</h2>
        <p className="text-muted-foreground">
          Platformangizni boshqaring va sozlang
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="general">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Umumiy</span>
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Bildirishnomalar</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Xavfsizlik</span>
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Ko'rinish</span>
          </TabsTrigger>
          <TabsTrigger value="language">
            <Globe className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Til</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Umumiy sozlamalar</CardTitle>
              <CardDescription>
                Platformaning asosiy sozlamalarini boshqaring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platforma nomi</Label>
                <Input id="platform-name" defaultValue="Ta'lim Platformasi" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email">Administrator email</Label>
                <Input id="admin-email" type="email" defaultValue="admin@platform.uz" />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Avtomatik zaxira nusxa</Label>
                  <p className="text-sm text-muted-foreground">
                    Har kuni avtomatik zaxira nusxa yaratish
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Yangi foydalanuvchilar uchun email tasdiqlash</Label>
                  <p className="text-sm text-muted-foreground">
                    Ro'yxatdan o'tishda email tasdiqlanishi shart
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button className="w-full sm:w-auto">O'zgarishlarni saqlash</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bildirishnoma sozlamalari</CardTitle>
              <CardDescription>
                Qanday bildirishnomalar olishni tanlang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email bildirishnomalar</Label>
                  <p className="text-sm text-muted-foreground">
                    Muhim yangiliklar haqida email orqali xabar olish
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Yangi o'quvchi qo'shilganda</Label>
                  <p className="text-sm text-muted-foreground">
                    Yangi o'quvchi ro'yxatdan o'tganda xabar olish
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>To'lov amalga oshirilganda</Label>
                  <p className="text-sm text-muted-foreground">
                    Har bir to'lov haqida xabar olish
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Guruh to'lganda</Label>
                  <p className="text-sm text-muted-foreground">
                    Guruh maksimal o'quvchilar soniga yetganda
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Haftalik hisobot</Label>
                  <p className="text-sm text-muted-foreground">
                    Har hafta platformaning umumiy hisoboti
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button className="w-full sm:w-auto">O'zgarishlarni saqlash</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Xavfsizlik sozlamalari</CardTitle>
              <CardDescription>
                Hisobingiz xavfsizligini ta'minlang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ikki faktorli autentifikatsiya</Label>
                  <p className="text-sm text-muted-foreground">
                    Qo'shimcha xavfsizlik qatlami qo'shish
                  </p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Sessiya muddati</Label>
                <Select defaultValue="24">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 soat</SelectItem>
                    <SelectItem value="8">8 soat</SelectItem>
                    <SelectItem value="24">24 soat</SelectItem>
                    <SelectItem value="168">1 hafta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Kirish tarixini saqlash</Label>
                  <p className="text-sm text-muted-foreground">
                    Barcha kirish urinishlarini yozib borish
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Noma'lum qurilmalardan ogohlantirish</Label>
                  <p className="text-sm text-muted-foreground">
                    Yangi qurilmadan kirilganda email yuborish
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button className="w-full sm:w-auto">O'zgarishlarni saqlash</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ko'rinish sozlamalari</CardTitle>
              <CardDescription>
                Platformaning ko'rinishini sozlang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Mavzu</Label>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Yorug'</SelectItem>
                    <SelectItem value="dark">Qorong'i</SelectItem>
                    <SelectItem value="system">Tizim sozlamalari</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Asosiy rang</Label>
                <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-md bg-blue-500 cursor-pointer border-2 border-transparent hover:border-foreground" />
                  <div className="h-10 w-10 rounded-md bg-green-500 cursor-pointer border-2 border-transparent hover:border-foreground" />
                  <div className="h-10 w-10 rounded-md bg-purple-500 cursor-pointer border-2 border-transparent hover:border-foreground" />
                  <div className="h-10 w-10 rounded-md bg-orange-500 cursor-pointer border-2 border-transparent hover:border-foreground" />
                  <div className="h-10 w-10 rounded-md bg-pink-500 cursor-pointer border-2 border-transparent hover:border-foreground" />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Kompakt rejim</Label>
                  <p className="text-sm text-muted-foreground">
                    Interfeys elementlarini kichikroq qilish
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animatsiyalarni o'chirish</Label>
                  <p className="text-sm text-muted-foreground">
                    Barcha animatsiyalarni o'chirish (tezroq ishlash)
                  </p>
                </div>
                <Switch />
              </div>

              <Button className="w-full sm:w-auto">O'zgarishlarni saqlash</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Til sozlamalari</CardTitle>
              <CardDescription>
                Platformaning tilini tanlang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Interfeys tili</Label>
                <Select defaultValue="uz">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uz">O'zbekcha</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sana formati</Label>
                <Select defaultValue="dd.mm.yyyy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd.mm.yyyy">DD.MM.YYYY</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Vaqt formati</Label>
                <Select defaultValue="24">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 soatlik</SelectItem>
                    <SelectItem value="12">12 soatlik (AM/PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Avtomatik tarjima</Label>
                  <p className="text-sm text-muted-foreground">
                    Xabarlarni avtomatik tarjima qilish
                  </p>
                </div>
                <Switch />
              </div>

              <Button className="w-full sm:w-auto">O'zgarishlarni saqlash</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
