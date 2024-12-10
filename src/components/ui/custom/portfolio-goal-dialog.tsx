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

export function PortfolioGoalDialog({ selectedPortfolio, onSubmit }) {
  const [goal, setGoal] = useState<string>(selectedPortfolio?.name || "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setGoal(selectedPortfolio?.goal || "");
  }, [selectedPortfolio]);

  const handleSubmit = () => {
    onSubmit(goal);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="group">
          <Target className="group-hover:animate-pulse"/>Set portfolio goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set portfolio goal</DialogTitle>
          <DialogDescription>
            Set an annual dividend target you want to hit with this portfolio.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="goal" className="">
              goal
            </Label>
            <Input
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="col-span-4"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} type="submit">
            Save changes
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
