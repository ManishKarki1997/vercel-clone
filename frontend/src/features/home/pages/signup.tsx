import PublicHeader from "@/components/shared/public-header";
import { SignupForm } from "@/components/signup-form";


export default function SignupPage() {
  return (
    <main>
      <PublicHeader />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
    </main>
  )
}
