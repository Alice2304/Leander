"use client"
import { useRouter } from "next/navigation";

export function LogoutRedirect({ children }) {
  const router = useRouter();
  const handleClick = (e) => {
    e.preventDefault();
    router.push("/");
  };
  return children(handleClick);
}
