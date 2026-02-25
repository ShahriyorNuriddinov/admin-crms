import { toast } from "react-toastify";

type notificationApi =
  | "login"
  | "wrong_login"
  | "LogOut"
  | "add"
  | "edit"
  | "error_admin"
  | "chiq"
  | "addTeacher"
  | "editGroup"
  | "addStundent"
  | "deleteStundent"
  | "addGroup";

export const notificationApi = () => {
  const notify = (type: notificationApi) => {
    switch (type) {
      case "login":
        return toast.success("Tizimga muvaffaqiyatli kirdingiz! 🎉");
      case "wrong_login":
        return toast.error("Tizimga kirishda xatolik yuz berdi! ❌");
      case "LogOut":
        return toast.info("Tizimdan muvaffaqiyatli chiqdingiz! 👋");
      case "add":
        return toast.success("Administrator muvaffaqiyatli qo'shildi! ✅");
      case "edit":
        return toast.success("Ma'lumotlar muvaffaqiyatli o'zgartirildi! ✏️");
      case "error_admin":
        return toast.error("Sizda ruxsat yo'q! Faqat menejer boshqaradi! 🚫");
      case "chiq":
        return toast.success("Ta'tilga muvaffaqiyatli chiqdingiz! 🏖️");
      case "addTeacher":
        return toast.success("O'qituvchi muvaffaqiyatli qo'shildi! 👨‍🏫");
      case "addGroup":
        return toast.success("Guruh muvaffaqiyatli qo'shildi! 👥");
      case "addStundent":
        return toast.success("O'quvchi muvaffaqiyatli qo'shildi! 🎓");
      case "editGroup":
        return toast.success("Guruh ma'lumotlari o'zgartirildi! 📝");
      case "deleteStundent":
        return toast.success("O'quvchi muvaffaqiyatli o'chirildi! 🗑️");
    }
  };
  return notify;
};
