import * as React from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { AuthContext } from "@/js/AuthContext";
import { toast } from "sonner";

const formSchema = z.object({
  portfolioName: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" }),
});

export function CreatePortfolioButton({ onSubmit, portfolios }) {
  const [open, setOpen] = React.useState(false);
  // AUTH CONTEXT
  const { subscriptionType } = React.useContext(AuthContext);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      portfolioName: "",
    },
  });

  const onTriggerClick = (event) => {
    if (handleCreateButtonClick() === false) {
      event.preventDefault()
    } else {
      setOpen(true);
    }
  }

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
    setOpen(false);
  };

  // limit amount of portfolios based on subscription type
  function handleCreateButtonClick() {
    if (portfolios.length >= 1 && subscriptionType === "FREE") {
      toast.error("Free users can only have one portfolio.");
      return false;
    }
    else if (portfolios.length >= 10 && subscriptionType === "PREMIUM") {
      toast.error("Premium users can only have up to 10 portfolios.");
      return false;
    }
  }

  return (
    <>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={onTriggerClick} >Create Portfolio</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <DialogHeader>
                <DialogTitle>Create portfolio</DialogTitle>
                <DialogDescription>Create a new portfolio.</DialogDescription>
              </DialogHeader>
              <div className=" gap-4 py-4">
                <div className="items-center gap-4">
                  <FormField
                    control={form.control}
                    name="portfolioName"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel
                          className="flex justify-between items-center"
                          htmlFor="portfolioName"
                        >
                          name
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="portfolioName"
                            type="portfolioName"
                            autoComplete="portfolioName"
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
    </>
  );
}
