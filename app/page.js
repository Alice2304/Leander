import { LoginForm } from "@/components/login-form"


export default function Home() {
  return (
      <div
        className=" flex min-h-svh flex-col items-center bg-gray-900 justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
  );
}
