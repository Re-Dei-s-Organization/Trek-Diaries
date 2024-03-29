"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FaHiking } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ModeToggle } from "@/app/(site)/components/DarkMode/Darkmode";
import { loginSchema, LoginFormData } from "@/lib/zodSchema/login";

const STATUS_INCORRECT_LOGIN_CREDENTIALS = 401;

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onLogIn: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const signIn = (await import("next-auth/react")).signIn;

      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: "/",
      });

      console.log("response received");

      /* if error occured */
      if (res?.error) {
        /* if the status code matches with the incorrect login credentials status */
        if (res.status === STATUS_INCORRECT_LOGIN_CREDENTIALS) {
          console.log("The email or the password is incorrect.");
          form.setError("root", {
            type: "custom",
            message: "The email or the password is incorrect.",
          });
          return;
        }
        throw res.error;
      }

      console.log("log in successfull");
      router.push(res?.url as string);
      return;
    } catch (error) {
      const err = error as string;
      if (err.length > 0) {
        form.setError("root", {
          type: "custom",
          message: "Error occured. Please try again later.",
        });
      }
    }
  };

  return (
    <div className="relative bg-white dark:bg-black rounded-xl p-16 z-10 sm:p-2 sm:w-64 md:w-72 lg:w-80">
      <div className="flex absolute top-12 right-8 sm:top-3 sm:right-2 xl:right-4">
        <ModeToggle />
      </div>
      <div className="flex-row sm:p-2">
        <h2 className="text-3xl mb-6 sm:max-[text-4xl]: sm:mb-8 md:mb-10 lg:text-3xl xl:text-4xl font-bold text-blue-500 ">
          Login 
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onLogIn)}
            className="space-y-4 flex-row justify-center items-center"
          >
            {form.formState.errors && (
              <h3 className=" text-red-600 font-medium">
                {form.formState.errors.email?.message ||
                  form.formState.errors.password?.message ||
                  form.formState.errors.root?.message}
              </h3>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="justify-start flex">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="h-12 w-full"
                      placeholder="user@gmail.com"
                      {...field}
                      type="text"
                    ></Input>
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
                  <FormLabel className="flex justify-start">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="h-12 w-full"
                      placeholder="password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3 space-y-1 justify-center items-center md:flex-row lg:flex-row  sm:gap-2 md:gap-4 lg:gap-5 ">
              <div className="flex space-x-1 gap-2 sm:space-x-2 items-center ">
                <Checkbox
                  id="show_password"
                  onCheckedChange={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                />
                <label
                  htmlFor="show_password"
                  className=" text-xs font-medium leading-none cursor-pointer sm:text-sm"
                >
                  Show Password
                </label>
              </div>

              <div className="flex items-center">
                <Link
                  className="text-xs font-medium leading-none cursor-pointer hover:text-gray-400 text-blue-500 sm:text-sm"
                  href="/reset-password"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                variant="outline"
                className=" btn px-3 py-2 transition ease-in-out delay-100 text-xs text-white rounded-md w-full bg-cyan-600 sm:h-8 md:h-10 xl:h-11 "
                type="submit"
              >
                Sign In
              </Button>
            </div>

            <div className=" flex flex-col text-xs font-medium justify-center items-center gap-2 md:flex-row sm:text-sm md:text-sm md:gap-2">
              <>Don&apos;t have an account?</>
              <Link
                className="text-blue-500  hover:text-gray-400"
                href="/sign_up"
              >
                {" "}
                Sign Up
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
