import { notificationApi } from "@/shared/generics/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookie from "js-cookie";
import { Myaxios } from "../axios";
import { EditGroupType, studentMutationType, TatilType, User } from "@/types";
import { AddType } from "@/components/admins-table/admin-add";
import { EditProfileType } from "@/components/profile-update";
import { AddTeacherType } from "@/components/teachers-table/teacher-add";
import { AddGroupType } from "@/components/groups/group_add";
import { toast } from "react-toastify";
const notify = notificationApi();
export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: object) =>
      axios({
        url: "https://admin-crm.onrender.com/api/auth/sign-in",
        method: "POST",
        data: data,
      }),
    onSuccess(res) {
      Cookie.set("token", res.data.data.token, { expires: 1 / 24 });
      Cookie.set("user", JSON.stringify(res.data.data), { expires: 1 / 24 });
      notify("login");
    },
    onError() {
      notify("wrong_login");
    },
  });
};

export const editCase = () => {
  const queryClient = useQueryClient();
  return (data: any) => {
    return queryClient.setQueryData(["admins"], (old: User[]) => {
      return old.map((value) =>
        value._id === data._id ? { ...value, ...data } : value
      );
    });
  };
};

export const useEditMutation = () => {
  const editCases = editCase();
  return useMutation({
    mutationKey: ["edit"],
    mutationFn: (data: object) => {
      editCases(data);
      return Myaxios.post("/api/staff/edited-admin", data);
    },
  });
};

export const deleteAdminCase = () => {
  const queryClient = useQueryClient();
  return (data: any) => {
    return queryClient.setQueryData(["admins"], (old: User[]) => {
      return old.map((value) =>
        value._id === data._id ? { ...value, ...data } : value
      );
    });
  };
};

export const AddAdminCase = () => {
  const queryClient = useQueryClient();
  return (data: any) => {
    return queryClient.setQueryData(["admins"], (old: User[]) => {
      return [...old, { ...data }];
    });
  };
};

export const useAddAdminMutaion = () => {
  const AddAdminCas = AddAdminCase();
  return useMutation({
    mutationKey: ["addFn"],
    mutationFn: async (data: AddType) => {
      AddAdminCas(data);
      return await Myaxios.post("/api/staff/create-admin", data);
    },
    onSuccess(data) {
      notify("add");
    },
  });
};

export const useEditProfileMutaion = () => {
  return useMutation({
    mutationKey: ["editProfile"],
    mutationFn: (data: EditProfileType) => {
      return Myaxios.post("/api/auth/edit-profile", data);
    },
    onSuccess() {
      notify("edit");
    },
  });
};

export const TatilCase = () => {
  const queryClient = useQueryClient();
  return (data: any) => {
    return queryClient.setQueryData(["admins"], (old: User[]) => {
      return old.map((value) =>
        value._id === data._id ? { ...value, ...data } : value
      );
    });
  };
};

export const useTatildaMutaion = () => {
  const tatil = TatilCase();
  return useMutation({
    mutationKey: ["tatil"],
    mutationFn: (data: TatilType) => {
      tatil(data);
      return Myaxios.post("/api/staff/leave-staff", data);
    },
    onSuccess() {
      notify("chiq");
    },
  });
};

export const useAddTeacherMutaion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["teacher"],
    mutationFn: async (data: AddTeacherType) =>
      await Myaxios.post("/api/teacher/create-teacher", data),
    onSuccess() {
      notify("addTeacher");
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
    },
    onError() {
      toast.error("Nimadur xato!");
    },
  });
};
export const AddGroupCase = () => {
  const queryClient = useQueryClient();
  return (data: any) => {
    return queryClient.setQueryData(["groups"], (old: User[]) => {
      return [...old, { ...data }];
    });
  };
};
export const useAddGroupMutation = () => {
  const AddGroupCas = AddGroupCase();
  return useMutation({
    mutationKey: ["groups"],
    mutationFn: async (data: AddGroupType) => {
      return Myaxios.post("/api/group/create-group", data).then((res) =>
        AddGroupCas(data)
      );
    },
    onSuccess(data) {
      notify("addGroup");
    },
  });
};
// strudent
export const useEditGroupMutation = () => {
  return useMutation({
    mutationFn: (data: EditGroupType) =>
      Myaxios.put("/api/group/edit-end-group", data),
    onSuccess() {
      notify("editGroup");
    },
  });
};

export const AddStudentCase = () => {
  const queryClient = useQueryClient();
  return (data: any) => {
    return queryClient.setQueryData(["students"], (old: User[]) => {
      return [...old, { ...data }];
    });
  };
};

export const useAddStrudentMutation = () => {
  const AddGroupCas = AddStudentCase();
  return useMutation({
    mutationKey: ["students"],
    mutationFn: async (data: studentMutationType) =>
      Myaxios.post("/api/student/create-student", data).then((res) => {
        AddGroupCas(data);
      }),
    onSuccess() {
      notify("addStundent");
    },
  });
};

export const useDeleteStrudentMutation = () => {
  const AddGroupCas = AddStudentCase();
  return useMutation({
    mutationKey: ["students"],
    mutationFn: async (data: { _id: string }) =>
      Myaxios.delete("/api/student/delete-student", { data }).then((res) => {
        AddGroupCas(data);
      }),
    onSuccess() {
      notify("deleteStundent");
    },
  });
};

export const useAddStrudentGroupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["students"],
    mutationFn: async (data: any) =>
      await Myaxios.post("/api/student/added-new-group-student", data),
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(data.data.message);
    },
  });
};
