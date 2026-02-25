import { ReactNode } from "react";

export interface ChildrenType {
  children: ReactNode;
}

export interface SidebarType {
  name: string;
  icon: ReactNode;
  path: string;
}
export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  image: string;
  role?: string;
  status?: string;
  token?: string;
  active?: boolean;
  is_deleted?: boolean;
  createdAt?: string | number | Date;
  updatedAt?: string;
  work_date?: string;
  work_end?: string | null;
  last_active_date?: string;
}
export interface TatilType {
  _id: string;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface TeacherType {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  image: string | null;
  field: string;
  salary: number;
  status: string;
  is_deleted: boolean;
  groups: any[];
  work_date: string;
  work_end: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GroupType {
  createdAt: string;
  disable: boolean;
  end_group: null;
  is_deleted: boolean;
  name: string;
  started_group: string;
  students: object[];
  teacher: TeacherType;
  updatedAt: string;
  _id: string;
}
export interface deleteGroupType {
  _id: string;
}
export interface EditGroupType {
  _id: string;
  date: string;
}

export interface studentType {
  adress: null | string;
  createdAt: string;
  first_name: string;
  groups: studentGroupType[];
  is_deleted: boolean;
  last_name: string;
  phone: string;
  status: string;
  updatedAt: string;
  leave_history: {
    days: number | string;
    end_date: string;
    reason: string;
    start_date: string;
    _id: string;
  }[];
  _id: string;
}

export interface studentGroupType {
  exitedAt: null | string;
  group: {
    createdAt: string;
    disable: boolean;
    end_group: string;
    is_deleted: boolean;
    name: string;
    started_group: string;
    teacher: string;
    updatedAt: string;
    _id: string;
  };
  joinedAt: string;
  payments: any;
  status: string;
}

export interface studentMutationType {
  first_name: string;
  last_name: string;
  phone: string;
  groups: { group: string }[];
}

// courses type
export interface NameDetailsType {
  createdAt: string | Date;
  name: string;
  updatedAt: string | Date;
  __v: number;
  _id: string;
}

export interface CourseType {
  createdAt: string | Date;
  description: string;
  duration: string;
  name: NameDetailsType;
  price: number;
  is_freeze:boolean
  updatedAt: string | Date;
  __v: number;
  _id: string;
}

export interface editCourseType {
  course_id?: string;
  duration: string;
  price: number;
}
