import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card } from "@heroui/react";
import authService from "@/appwrite/auth";
import { addToast } from "@heroui/react";

const formSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    password: z.string()
      .min(8, "Password must be at least 8 characters long")
      .max(64, "Password must not exceed 64 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
    confirmPassword: z.string()
      .min(8, "Password must be at least 8 characters long")
      .max(64, "Password must not exceed 64 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Account() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await authService.updateAccountPassword(values.password, values.currentPassword);
      addToast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to update password. Please check your current password and try again.",
        color: "danger",
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto space-y-8 p-8">
      <h2 className="text-2xl font-semibold ">Set new password</h2>
      <p className="text-lg ">
        Please enter your current password, new password, and confirm your new password.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField name="currentPassword" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="password" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="confirmPassword" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button type="submit" className="w-full">Set New Password</Button>
        </form>
      </Form>
    </Card>
  );
}
