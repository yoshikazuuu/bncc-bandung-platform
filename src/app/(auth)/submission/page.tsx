import { UserData } from "@/api/course-context";
import AdminSubmission from "@/components/Submission/admin-submission";
import UserSubmission from "@/components/Submission/user-submission";

export default function Submission() {
  return (
    <div className="layout flex flex-col p-10 min-h-screen gap-10">
      {UserData.isAdmin ? <AdminSubmission /> : <UserSubmission />}
    </div>
  );
}
