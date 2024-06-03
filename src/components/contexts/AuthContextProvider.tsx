"use client";
import type { AxiosError } from "axios";
import type { AuthType } from "@/types/auth-type";
import type { UserProfileType } from "@/types/user-data-type";
import { createContext, useEffect, useState } from "react";
import axios from "@/api/axios-instace";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteSession, getUserProfile } from "@/api/api-backend";

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthType<UserProfileType> | null>(null);

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const defaultUserData: UserProfileType = {
    fullName: "",
    NIM: "",
    email: "",
    address: "",
    phone: "",
    role: 0,
    enrollments: [],
    bnccId: "",
    isAdmin: false,
  };

  const [userData, setUserData] = useState(defaultUserData);
  const [error, setError] = useState("");

  const {
    data,
    isLoading,
    refetch: getProfile,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
    refetchInterval: 60 * 15 * 1000,
  });

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data]);

  const { mutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: deleteSession,
  });

  const value = {
    userData,
    setUserData,
    error,
    setError,
    getProfile,
    logout: mutate,
    isUserLoading: isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthContextProvider };
