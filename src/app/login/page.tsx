import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl dark:bg-navy-900">
        <div className="mb-6 text-center">
          <p className="text-2xl font-bold text-navy-900 dark:text-navy-100">columbus</p>
          <p className="text-xs font-semibold tracking-wide text-navy-500 dark:text-navy-100/70">
            LOGÍSTICA INTERNACIONAL
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
