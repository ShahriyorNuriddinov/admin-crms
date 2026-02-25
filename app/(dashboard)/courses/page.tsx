import CoursesComponents from "@/components/courses";
import { Myaxios } from "@/request/axios";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const Courses = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["courses"],
    queryFn: async () =>
      await Myaxios.get("/api/course/get-courses").then((res) => res.data.data),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <HydrationBoundary state={dehydratedState}>
        <CoursesComponents />
      </HydrationBoundary>
    </div>
  );
};

export default Courses;
