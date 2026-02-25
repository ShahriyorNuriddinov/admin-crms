"use client";
import { CourseType, editCourseType } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Clock, Users, Pencil, Trash2, Loader, Eye, Snowflake, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";

interface MangaCourseCardProps {
  course: CourseType;
  onEdit: (data: editCourseType) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  freeze: (id: string) => void;
  unfreeze: (id: string) => void;
}

export const CourseCard = ({
  course,
  onEdit,
  onDelete,
  isDeleting,
  freeze,
  unfreeze,
}: MangaCourseCardProps) => {
  const [open, setOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formattedPrice = new Intl.NumberFormat("en-US").format(course.price);

  // Mock students data - backenddan kelganda bu o'rniga course.students ishlatiladi
  const students = course.students || [];
  const studentCount = students.length || 0;

  const { register, handleSubmit } = useForm({
    defaultValues: {
      duration: course?.duration || "",
      price: course?.price || 0,
    },
  });

  const onSubmit = (data: { duration: string; price: number }) => {
    setLoading(true);
    if (!course?._id) return;
    setTimeout(() => {
      onEdit({
        course_id: course._id,
        ...data,
      });
      setLoading(false);
    }, 500);
    setTimeout(() => {
      setOpen(false);
    }, 500);
  };

  return (
    <>
      <Card className="w-full max-w-md hover:shadow-lg transition-all duration-300 border border-muted bg-gradient-to-br from-background to-muted/10 flex flex-col justify-between custom-card-hover">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-primary">
                {course.name.name}
              </CardTitle>
              <CardDescription className="mt-1 text-muted-foreground">
                {course.description}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="px-3 py-1 text-sm whitespace-nowrap ml-2">
              {formattedPrice} so'm
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col justify-between">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">{course.duration}</span>
              </div>
              {course.is_freeze && (
                <Badge variant="secondary" className="gap-1">
                  <Snowflake className="h-3 w-3" />
                  Muzlatilgan
                </Badge>
              )}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{studentCount} o'quvchi</span>
              </div>
              {studentCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStudentsOpen(true)}
                  className="h-8 gap-1"
                >
                  <Eye className="h-4 w-4" />
                  Ko'rish
                </Button>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            className="flex items-center gap-1"
          >
            <Pencil className="h-4 w-4" />
            Tahrirlash
          </Button>

          <Button
            size="sm"
            onClick={() => onDelete(course._id)}
            disabled={isDeleting}
            variant="destructive"
            className="flex items-center gap-1"
          >
            {isDeleting ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
          </Button>

          {course.is_freeze ? (
            <Button
              size="sm"
              onClick={() => unfreeze(course._id)}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4" />
              Davom ettirish
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => freeze(course._id)}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
            >
              <Snowflake className="h-4 w-4" />
              Muzlatish
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kursni tahrirlash</DialogTitle>
            <DialogDescription>
              Kurs ma'lumotlarini yangilang
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">Davomiylik</Label>
              <Input
                id="duration"
                placeholder="6 oy"
                {...register("duration")}
                className="custom-input h-11"
              />
              <p className="text-xs text-muted-foreground">Kurs davomiyligini kiriting</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">Narx (so'm)</Label>
              <Input
                id="price"
                type="number"
                placeholder="2000000"
                {...register("price", { valueAsNumber: true })}
                className="custom-input h-11"
              />
              <p className="text-xs text-muted-foreground">Kurs narxini kiriting</p>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} type="button">
                Bekor qilish
              </Button>
              <Button type="submit" disabled={loading} className="min-w-24">
                {loading ? <Loader className="h-4 w-4 animate-spin" /> : "Saqlash"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Students Dialog */}
      <Dialog open={studentsOpen} onOpenChange={setStudentsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{course.name.name} - O'quvchilar</DialogTitle>
            <DialogDescription>
              Kursda o'qiyotgan barcha o'quvchilar ro'yxati
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Jami: {studentCount} o'quvchi</span>
              </div>
              <Badge variant="secondary">{formattedPrice} so'm</Badge>
            </div>

            <Separator />

            {studentCount > 0 ? (
              <div className="rounded-lg border overflow-hidden">
                <Table className="custom-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">№</TableHead>
                      <TableHead>Ismi</TableHead>
                      <TableHead>Familiyasi</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student: any, idx: number) => (
                      <TableRow key={idx} className="animate-slide-in">
                        <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                        <TableCell className="font-medium">{student.first_name}</TableCell>
                        <TableCell className="font-medium">{student.last_name}</TableCell>
                        <TableCell className="text-muted-foreground">{student.phone}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={student.status === 'faol' ? 'default' : 'secondary'}>
                            {student.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">O'quvchilar yo'q</h3>
                <p className="text-sm text-muted-foreground">
                  Bu kursda hali o'quvchilar ro'yxatdan o'tmagan
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStudentsOpen(false)}>
              Yopish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
