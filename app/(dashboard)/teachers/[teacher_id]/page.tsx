import InfoComponents from "@/components/info";
import React from "react";

const  Info = async ({ params }: { params: Promise<{ teacher_id: string }> }) => {
  const { teacher_id } = await params;
  return (
    <div>
      <InfoComponents id={teacher_id} />
    </div>
  );
};

export default Info;
