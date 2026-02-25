"use client";
import { Myaxios } from "@/request/axios";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { CourseType, editCourseType } from "@/types";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { CourseCard } from "./card";
import { MangaCourseCardSkeleton } from "./courseSkeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { CourseModal } from "./createCourse";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
type CourseFormValues = {
  name: string;
  description: string;
  duration: string;
  price: number;
};
const courseFormSchema = z.object({
  name: z.string().min(1, "Nom majburiy"),
});
type CourseFormValue = z.infer<typeof courseFormSchema>;
const CoursesComponents = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState({
    name: "",
    description: "",
    duration: "",
    price: 0,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data, isLoading, refetch } = useQuery<CourseType[]>({
    queryKey: ["courses"],
    queryFn: () =>
      Myaxios.get("/api/course/get-courses").then((res) => res.data.data),
  });
  const form = useForm<CourseFormValue>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const CreateCategory = (values: { name: string }) => {
    Myaxios.post("/api/course/create-category", values)
      .then((res) => {
        toast.success(res.data.message);
        setEditingCourse({
          ...editingCourse,
          name: values.name,
        });
        setAddOpen(false);
        setIsModalOpen(true);
      })
      .catch((rej) => toast.error(rej.response.data.message));
  };
  const handleSubmit = (values: CourseFormValues) => {
    Myaxios.post("/api/course/create-course", values)
      .then((res) => {
        toast.success(res.data.message);
        setIsModalOpen(false);
        setEditingCourse({
          name: "",
          description: "",
          duration: "",
          price: 0,
        });
        refetch();
      })
      .catch((rej) => toast.error(rej.response.data.message));
  };

  const handleEdit = async (data: editCourseType) => {
    try {
      await Myaxios.post(`/api/course/edit-course`, {
        ...data,
      });

      toast.success("Kurs muvaffaqiyatli yangilandi");
      refetch();
    } catch (err) {
      toast.error("Kursni yangilashda xatolik yuz berdi");
      <div className="hidden">{JSON.stringify(err)}</div>;
    }
  };
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await Myaxios.delete(`/api/course/delete-course`, {
        data: { course_id: id },
      });
      toast.success("Kurs muvaffaqiyatli o'chirildi");
      refetch();
    } catch (err) {
      toast.error("Kursni o'chirishda xatolik yuz berdi");
      <div className="hidden">{JSON.stringify(err)}</div>;
    } finally {
      setDeletingId(null);
    }
  };
  const freeze = (id: string) => {
    Myaxios.put("/api/course/freeze-course", { course_id: id })
      .then((res) => {
        toast.success(res.data.message);
        refetch();
      })
      .catch(() => toast.error("Nimadur xato manager bilan uchrashing!"));
  };
  const unfreeze = (id: string) => {
    Myaxios.put("/api/course/unfreeze-course", { course_id: id })
      .then((res) => {
        toast.success(res.data.message);
        refetch();
      })
      .catch(() => toast.error("Nimadur xato manager bilan uchrashing!"));
  };
  return (
    <div>
      <div className="container mx-auto ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Kurslar</h1>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Kurs Qo&apos;shish
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <MangaCourseCardSkeleton key={index} />
              ))}
            </>
          ) : (
            data?.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={deletingId === course._id}
                freeze={freeze}
                unfreeze={unfreeze}
              />
            ))
          )}
        </div>
        <CourseModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleSubmit}
          initialData={editingCourse || undefined}
        />
      </div>
      {/* edit modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yangi Kurs Qo{"'"}shish</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(CreateCategory)}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Kurs nomi</FormLabel>
                    <FormControl>
                      <Input placeholder="Frontend Dasturlash" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Yaratish</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesComponents;
