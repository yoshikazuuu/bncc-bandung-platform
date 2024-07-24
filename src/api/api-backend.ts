import { toast } from "sonner"
import axios from "./axios-instance";
import { UserProfileType } from "@/types/user-data-type";
import { SessionDataType } from "@/types/session-data-type";
import { AxiosError } from "axios";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LoginSchema } from "@/validations/login-schema";
import { CourseDataType } from "@/types/course-data-type";
import { queryClient } from "@/components/contexts/ReactQueryProvider";
import { SessionSchema } from "@/validations/session-schema";

async function getUserProfile() {
  try {
    const response = await axios.get("/users/profile");
    return response.data.data.user as UserProfileType;
  } catch (err) {
    await refreshToken();
  }
}

async function refreshToken() {
  try {
    await axios.post("/auth/refresh");
    await getUserProfile();
  } catch (err) {
    const axiosError = err as AxiosError<any>;
    throw new Error(axiosError.response?.data.message);
  }
}

// REACT QUERY

export function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: LoginSchema) => {
      await axios.post("/auth/login", values);
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
    onError: (error: AxiosError) => {
      return error;
    },
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });
}

export function useLogout() {
  const router = useRouter();
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      try {
        const response = await axios.delete("/auth/logout");
        return response.data.data;
      } catch (err) {
        const axiosError = err as AxiosError<any>;
        throw new Error(axiosError.response?.data.message);
      }
    },
    onSuccess: () => {
      router.push("/login");
      router.refresh();
    },
  });
}

export function useGetAllSessions(courseId: string, options?: Omit<UseQueryOptions<SessionDataType[]>, "queryKey">) {
  return useQuery({
    queryKey: ["sessions", courseId],
    queryFn: async () => {
      try {
        const response = await axios.get(`/courses/${courseId}/sessions`);
        return response.data.data.sessions as SessionDataType[];
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        throw new Error(axiosError.response?.data.message);
      }
    },
    ...options,
  });
}

export function useGetAllCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      try {
        const response = await axios.get("/courses");
        return response.data.data.courses as CourseDataType[];
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        throw new Error(axiosError.response?.data.message);
      }
    },
  });
}

export function useEnrollCourse() {
  return useMutation({
    mutationKey: ["enroll"],
    mutationFn: async (courseId: string) => {
      try {
        const response = await axios.post(`/courses/${courseId}/enrollment`);
        return response.data.message;
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        throw new Error(axiosError.response?.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  });
}

export function useUnenrollCourse() {
  return useMutation({
    mutationKey: ["unenroll"],
    mutationFn: async (courseId: string) => {
      try {
        const response = await axios.delete(`/courses/${courseId}/enrollment`);
        return response.data.message;
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        throw new Error(axiosError.response?.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  });
}

export function useUpcomingSessions(courseId: string) {
  return useQuery({
    queryKey: ["upcoming", courseId],
    queryFn: async () => {
      try {
        const response = await axios.get(`/courses/${courseId}/sessions/upcoming`);
        return response.data.data.sessions as SessionDataType[];
      } catch (error) {
        const axiosError = error as AxiosError<any>;
        throw new Error(axiosError.response?.data.message);
      }
    },
  });
}

export function useAddSession(courseId: string, setFormOpen: (isOpen: boolean) => void) {
  return useMutation({
    mutationKey: ["add-session"],
    mutationFn: async (values: SessionSchema) => {
      await axios.post(`/courses/${courseId}/sessions`, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
      toast.success("Session created successfully ✅", {
        description: new Date().toLocaleString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
      });
      setFormOpen(false);
    },
    onError: (error: AxiosError) => {
      return error;
    },
  });
}

export function useDeleteSession(courseId: string, sessionId: string) {
  return useMutation({
    mutationKey: ["delete-session"],
    mutationFn: async () => {
      await axios.delete(`/courses/${courseId}/sessions/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Session deleted successfully 🗑️");
    },
    onError: (error: AxiosError) => {
      return error;
    },
  });
}