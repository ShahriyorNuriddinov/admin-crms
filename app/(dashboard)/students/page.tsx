import StudentsComponents from "@/components/students";
import { Myaxios } from "@/request/axios";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const Students = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["admins"],
    queryFn: () =>
      Myaxios.get("/api/student/get-all-students").then((res) => res.data),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="p-4 ">
      <HydrationBoundary state={dehydratedState}>
        <StudentsComponents />
      </HydrationBoundary>
    </div>
  );
};

export default Students;
