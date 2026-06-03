import LoginForm from './login';

export const metadata = {
  title: 'Login | My App',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <LoginForm />
    </main>
  );
}