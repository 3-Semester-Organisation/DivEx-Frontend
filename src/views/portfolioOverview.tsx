import * as React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { makeAuthOption, checkHttpsErrors } from "@/js/util";
import { getUserIdFromToken } from "@/js/jwt";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/js/AuthContext";

const URL = "http://localhost:8080/api/v1/portfolio";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" }),
});


async function onSubmit(values: z.infer<typeof formSchema>) {
    const token = localStorage.getItem("token");
    if (!token) {
        toast.error("No token found. Please log in.");
        return
    }
    try {  
        console.log(token)
        const postOption = makeAuthOption("POST", values, token);
        console.log(postOption)
        const res = await fetch(URL, postOption);
        console.log(res);
    await checkHttpsErrors(res);

    toast.success("Portfolio created.");
  } catch (error) {
    console.error("Form submission error", error);
    toast.error(error.message);
  }
}

export default function PortfolioOverview() {
  const { subscriptionType } = React.useContext(AuthContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });


  return (
    <>
      <h1 className="font-semibold text-5xl flex p-6" >Portfolio</h1>
      <div className="p-6">
        <Label>TESTING Subscription type: {subscriptionType}</Label>
        </div>
      <div className="flex justify-left p-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create portfolio</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>Create portfolio</DialogTitle>
                  <DialogDescription>Create a new portfolio.</DialogDescription>
                </DialogHeader>
                <div className=" gap-4 py-4">
                  <div className="items-center gap-4">
                  <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel className="flex justify-between items-center" htmlFor="name">Portfolio name</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          type="name"
                          autoComplete="name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div>
      </div>
    </>
  );
}
