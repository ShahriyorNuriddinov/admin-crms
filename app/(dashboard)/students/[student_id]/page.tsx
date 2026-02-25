import React from "react";
import Student_info_component from "@/components/students/student-info";

const Student_info = async ({
  params,
}: {
  params: Promise<{ student_id: string }>;
}) => {
  const { student_id } = await params;

  return <div>
    <Student_info_component id={student_id}/>
  </div>;
};

export default Student_info;
