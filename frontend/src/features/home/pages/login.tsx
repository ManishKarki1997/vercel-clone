import { LoginForm } from "@/components/login-form";
import PublicHeader from "@/components/shared/public-header";


export default function LoginPage() {
  return (
    <main>
      <PublicHeader />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
