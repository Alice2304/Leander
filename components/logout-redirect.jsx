"use client"
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function LogoutRedirect({ children }) {
  const router = useRouter();
  const handleClick = (e) => {
    e.preventDefault();
    // Borrar token y usuario de localStorage y cookies
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Cookies.remove("token", { path: "/" });
    Cookies.remove("user", { path: "/" });
    router.push("/");
  };
  return children(handleClick);
}
