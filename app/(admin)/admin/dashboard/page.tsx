"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutButton from "@/components/application/LogoutButton";

export default function AdminDashboard() {
  const auth = useSelector((state: any) => state.authStore.auth);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      router.push("/auth/login");
    } else if (auth.role !== "admin") {
      router.push("/my-account");
    }
  }, [auth, router]);

  if (!auth || auth.role !== "admin") return null;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <LogoutButton />
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Logged In User</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Name:</span> {auth.name}</p>
            <p><span className="font-medium">Email:</span> {auth.email}</p>
            <p><span className="font-medium">Role:</span> <span className="capitalize text-green-600 font-semibold">{auth.role}</span></p>
            <p><span className="font-medium">Email Verified:</span> {auth.isEmailVerified ? "✅ Yes" : "❌ No"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
