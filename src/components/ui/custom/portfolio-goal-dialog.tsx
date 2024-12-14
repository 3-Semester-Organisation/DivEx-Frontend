import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target } from "lucide-react";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const schema = z.object({
  goal: z
    .number({ message: "Goal must be a number." })
    .positive({ message: "Goal must be a positive number." }),
});

export function PortfolioGoalDialog({ selectedPortfolio, onSubmit }) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      goal: selectedPortfolio?.goal || 0,
    },
  });

  const [goal, setGoal] = useState<string>(selectedPortfolio?.name || "")
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setGoal(selectedPortfolio?.goal || "");
  }, [selectedPortfolio]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="group">
          <Target className="group-hover:animate-pulse" />
          Set portfolio goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Portfolio Goal</DialogTitle>
          <DialogDescription>
            Set an annual dividend target you want to achieve with this portfolio.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((data) => {
            onSubmit(data.goal);
            setOpen(false);
          })}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="goal">Goal</Label>
              <Input
                id="goal"
                placeholder="Enter goal amount"
                {...form.register("goal", { valueAsNumber: true })}
              />
              {form.formState.errors.goal && (
                <p className="text-red-500">{form.formState.errors.goal.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
