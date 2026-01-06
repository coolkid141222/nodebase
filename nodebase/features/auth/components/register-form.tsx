"use client";

import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link"; // 在此环境中使用 <a> 标签代替
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowRight, Chrome, Github, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// --- 1. 更新 Zod 验证 ---
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // 在“确认密码”字段下显示错误
});


type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() { // --- 2. 更改组件名称 ---
  const router = useRouter();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
        }
      }
    )
  };

  const isPending = form.formState.isSubmitting;

  return (
    //   -- 样式与登录页面保持一致 --
    <div className="font-sans relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-700 px-4 py-12 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-10 -top-16 h-48 rounded-full bg-gradient-to-r from-blue-300/50 via-white/30 to-purple-300/50 blur-3xl" />

      <Card className="relative w-full max-w-md overflow-hidden rounded-xl border-0 bg-white shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400" />
        <CardHeader className="space-y-2 text-center pt-8">

          {/* -- 3. 更改标题和描述 -- */}
          <CardTitle className="text-3xl font-bold text-slate-900">
            Create your account
          </CardTitle>
          <CardDescription className="text-base text-slate-600 pt-1">
            Get started by creating a new account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <div className="grid gap-4 sm:grid-cols-2">

            {/* -- 4. 更改社交按钮文字 -- */}
            <Button
              variant="outline"
              className="group flex w-full items-center justify-center gap-3 rounded-lg border-slate-300 bg-white h-12 text-base text-slate-800 transition hover:-translate-y-[1px] hover:border-blue-400 hover:bg-blue-50"
              type="button"
              disabled={isPending}
            >
              <Chrome className="h-5 w-5 text-blue-500" />
              Google
            </Button>

            <Button
              variant="outline"
              className="group flex w-full items-center justify-center gap-3 rounded-lg border-slate-800 bg-slate-900 h-12 text-base text-white transition hover:-translate-y-[1px] hover:bg-slate-800"
              type="button"
              disabled={isPending}
            >
              <Github className="h-5 w-5" />
              GitHub
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm font-medium uppercase tracking-wide text-slate-500">
              or
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* -- 5. 添加“全名”字段 -- */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-800">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Name"
                        autoComplete="name"
                        className="h-12 rounded-lg border-slate-300 bg-slate-50 px-4 text-base transition focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-800">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        autoComplete="email"
                        className="h-12 rounded-lg border-slate-300 bg-slate-50 px-4 text-base transition focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-800">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="h-12 rounded-lg border-slate-300 bg-slate-50 px-4 text-base transition focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* -- 6. 添加“确认密码”字段 -- */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-800">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="h-12 rounded-lg border-slate-300 bg-slate-50 px-4 text-base transition focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* -- 7. 移除“记住我”和“忘记密码” -- */}

              <Button
                type="submit"
                className="group relative w-full h-12 rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-base text-white shadow-lg transition-all hover:-translate-y-[1px] hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-80"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    {/* -- 图标在左侧 -- */}
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 transition group-hover:translate-x-1">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                    {/* -- 文字在中间 -- */}
                    Sign up
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* -- 9. 添加返回登录的链接 -- */}
          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <a
              href="/login" // 假设登录页路由为 /login
              className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}