"use client";

import { apiRequest } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: (credentials) =>
            apiRequest("/register", {
                method: "POST",
                data: credentials,
            }),
        onSuccess: () => {
            router.push("/login");
        },
    });
}

export function useLogin() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials) =>
            apiRequest("/login", {
                method: "POST",
                data: credentials,
            }),
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            queryClient.invalidateQueries();
            router.push("/");
        },
    });
}

export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return () => {
        localStorage.removeItem("token");
        queryClient.clear();
        router.push("/login");
    };
}