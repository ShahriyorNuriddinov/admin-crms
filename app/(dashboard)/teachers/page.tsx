import TeachersTableComponent from "@/components/teachers-table";
import { Myaxios } from "@/request/axios";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const Teachers = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["teacher"],
    queryFn: () =>
      Myaxios.get("/api/teacher/get-all-teachers").then((res) =>res.data.data
      ),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="p-4  rounded-xl shadow-sm py-5">
      <HydrationBoundary state={dehydratedState}>
        <TeachersTableComponent />
      </HydrationBoundary>
    </div>
  );
};

export default Teachers;
