import { LoginForm } from "@/components/login-form"


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
