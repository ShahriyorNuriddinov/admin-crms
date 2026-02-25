import AdminsTableComponent from "@/components/admins-table";
import { Myaxios } from "@/request/axios";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const Admins = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["admins"],
    queryFn: async () =>
      await Myaxios.get("/api/staff/all-admins").then((res) => res.data.data
      ),
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <HydrationBoundary state={dehydratedState}>
        <AdminsTableComponent />
      </HydrationBoundary>
    </div>
  );
};

export default Admins;
