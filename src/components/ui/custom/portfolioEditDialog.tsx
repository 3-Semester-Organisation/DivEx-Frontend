import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PortfolioEditDialog({ selectedPortfolio, onSubmit }) {
    const [newName, setNewName] = useState<string>(selectedPortfolio?.name || "");
    const [open, setOpen] = useState(false);

  useEffect(() => {
    setNewName(selectedPortfolio?.name || "");
  }, [selectedPortfolio]);

    const handleSubmit = () => {
        if (newName.length < 1) {
            toast.error("Name must be at least 1 character long");
            return
        } else if (newName.length > 20) {
            toast.error("Name must be at most 20 characters long");
            return

        }
        onSubmit(newName);
        setOpen(false);
    }
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="hover:bg-accent rounded-md cursor-pointer ml-2 p-2 h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Pencil className="h-5 w-5" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit portfolio name</DialogTitle>
          <DialogDescription>
            Edit the name of your portfolio.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 ">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="">
              name
            </Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="col-span-4"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
