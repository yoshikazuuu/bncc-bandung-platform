"use client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseCard } from "./card-course";
import { useGetAllCourses, useUserProfile } from "@/api/api-backend";

export function AvailableCoursesCard() {
  const { data: userData } = useUserProfile();
  const { data: coursesData, isLoading } = useGetAllCourses();

  if (isLoading) {
    return (
      <Card className="w-full h-fit flex">
        <div className=" p-6">
          <Skeleton className="h-[150px] w-[150px]" />
        </div>
      </Card>
    );
  }

  return (
    <>
      {coursesData?.map((course, index) => {
        return (
          <CourseCard
            key={index}
            course={course}
            enrolled={userData?.enrollments?.some(
              (enrollment) => enrollment.courseId === course.id
            )}
            approved={userData?.enrollments?.some(
              (enrollment) =>
                enrollment.courseId === course.id && enrollment.approved
            )}
            isLecturer={
              userData?.enrollments?.find(
                (enrollment) => enrollment.courseId === course.id
              )?.isLecturer
            }
            isAdmin={userData?.isAdmin}
            //   session={session}
            //   isAttendance={false}
            //   isButtonHidden={false}
          />
        );
      })}
    </>
  );
}
