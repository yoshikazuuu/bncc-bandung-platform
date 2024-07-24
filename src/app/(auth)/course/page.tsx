"use client";

import { useUserProfile } from "@/api/api-backend";
import { AvailableCourses } from "./components/available-courses";
import { Courses } from "./components/courses";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AddSession } from "./components/add-session";

export default function CoursePage() {
  const { data } = useUserProfile();
  const enrollments = data?.enrollments.filter(
    (enrollment) => enrollment.approved
  );

  return (
    <div className="layout flex flex-col p-10 min-h-screen">
      <Accordion type="single" collapsible defaultValue="item-0">
        <AccordionItem value="item-main">
          <AccordionTrigger>
            <h1 className="text-2xl font-bold">Available Courses</h1>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-4">
              <AvailableCourses />
            </div>
          </AccordionContent>
        </AccordionItem>
        {enrollments?.map((course, idx) => (
          <AccordionItem key={idx} value={`item-${idx}`}>
            <AccordionTrigger>
              <h1 className="text-2xl font-bold">{course.course.name}</h1>
            </AccordionTrigger>
            <AccordionContent>
              {course.isLecturer && <AddSession courseId={course.courseId} />}
              <div className="grid grid-cols-2 gap-4">
                <Courses courseId={course.courseId} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
