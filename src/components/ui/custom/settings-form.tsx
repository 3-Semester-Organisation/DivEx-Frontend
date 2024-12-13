"use client";
import React, { useEffect, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { getUserDetails } from "@/api/user";
import { updatePassword, updateUserDetails } from "@/api/user";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .or(z.literal('')),
  lastName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .or(z.literal('')),
  email: z.
    string()
    .email({ message: "Invalid email address" })
    .or(z.literal('')),
  //phonenumber, no whitespace, no special characters, no letters
  phone: z
    .string()
    .regex(/^\d{8,12}$/, { message: "Invalid phone number" })
    .or(z.literal('')),
});

const passwordFormSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function SettingsForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const fetchedUser = await getUserDetails(); // Replace with your data fetching function
        setUser(fetchedUser);
        form.reset({
          firstName: fetchedUser.firstName || "",
          lastName: fetchedUser.lastName || "",
          email: fetchedUser.email || "",
          phone: fetchedUser.phone || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error (e.g., show an error message)
      }
    }
    fetchUserData();
  }, []);

  async function onSubmitUserDetails(values: z.infer<typeof formSchema>) {
    try {
      const user = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
      };
      await updateUserDetails(user);
      toast.success("User details updated successfully.");
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error("Failed to update user details. Please try again.");
    }
  }

  async function onSubmitPasswordChange(
    values: z.infer<typeof passwordFormSchema>
  ) {
    try {
      const password = {
        password: values.password,
      };
      await updatePassword(password);
      toast.success("Password changed successfully.");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
    }
  }

  return (
    <>
      <div className="grid grid-cols-12">
        {/* User Details Form */}
        <div className="min-h-[60vh] h-full items-center justify-center col-span-4">
          <Card className="mx-auto max-w-3xl w-96 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitUserDetails)}
                  className="space-y-8"
                >
                  <div className="grid gap-4">
                    {/* Name Field */}
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel className="flex justify-start" htmlFor="name">First name</FormLabel>
                          <FormControl>
                            <Input
                              id="name"
                              placeholder="John"
                              defaultValue={user?.firstName}
                              className="bg-primary-foreground"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Name Field */}
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel className="flex justify-start" htmlFor="lastName">Last name</FormLabel>
                          <FormControl>
                            <Input
                              id="lastName"
                              placeholder="Doe"
                              defaultValue={user?.lastName}
                              className="bg-primary-foreground"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel className="flex justify-start" htmlFor="email">Email</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              placeholder="johndoe@mail.com"
                              defaultValue={user?.email}
                              className="bg-primary-foreground"
                              type="email"
                              autoComplete="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone Field */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel className="flex justify-start" htmlFor="phone">Phone</FormLabel>
                          <FormControl>
                            <Input
                              id="phone"
                              placeholder="12 34 56 78"
                              defaultValue={user?.phone}
                              className="bg-primary-foreground"
                              type="tel"
                              autoComplete="tel"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Update
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Password Change Form */}
        <div className="col-span-4">
          <Card className="mx-auto max-w-3xl w-96 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Change password</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onSubmitPasswordChange)}
                  className="space-y-8"
                >
                  <div className="grid gap-4">
                    {/* Password Field */}
                    <FormField
                      control={passwordForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel className="flex justify-start" htmlFor="password">Password</FormLabel>
                          <FormControl>
                            <PasswordInput
                              id="password"
                              placeholder="******"
                              autoComplete="new-password"
                              className="bg-primary-foreground"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password Field */}
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="grid gap-2">
                          <FormLabel className="flex justify-start" htmlFor="confirmPassword">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <PasswordInput
                              id="confirmPassword"
                              placeholder="******"
                              autoComplete="new-password"
                              className="bg-primary-foreground"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Change password
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
