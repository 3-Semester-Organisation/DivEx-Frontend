import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Icons } from "@/icons/icons";
import { toast } from "sonner";
import { fetchSubscriptionChange } from "@/api/subscription";
import { getSubscriptionTypeFromToken } from "@/js/jwt";
import { useContext } from "react";
import { AuthContext } from "@/js/AuthContext";
import { useNavigate } from "react-router-dom";

const cardSchema = z.object({
  paymentMethod: z.enum(["card", "paypal", "apple"]),
  name: z.string().min(1, { message: "Name is required" }),
  city: z.string().min(1, { message: "City is required" }),
  number: z
    .string()
    .regex(/^\d{16}$/, { message: "Card number must be 16 digits" }),
  month: z.string().min(1, { message: "Month is required" }),
  year: z.string().min(1, { message: "Year is required" }),
  cvc: z
    .string()
    .regex(/^\d{3,4}$/, { message: "CVC must be 3 or 4 digits" }),
});

type CardFormValues = z.infer<typeof cardSchema>;

export function CardInput() {
  const { subscriptionType, setSubscriptionType } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
  });

  const navigate = useNavigate();

  const handleUpgrade = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetchSubscriptionChange("PREMIUM", token);
      const jwtToken = await response.json();
      const tkn = jwtToken.jwt;

      localStorage.setItem("token", tkn);
      const newSubType = getSubscriptionTypeFromToken();
      setSubscriptionType(newSubType);

      toast.success("Upgrade successful.");
    } catch (error) {
      console.error(error);
      toast.error("Upgrade failed.");
    }
  };

  const onSubmit = (data: CardFormValues) => {
    // IRL, should use a payment processing library
    // and send the payment data to the backend
    // right now if form is correct, we just upgrade the user
    handleUpgrade();
    navigate("/portfolio/overview");
  };

    return (
      <div className="flex ">
    <Card className="mx-auto mt-10">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Label>Payment Method</Label>
          <RadioGroup {...register("paymentMethod")}>
            <div className="grid grid-cols-3 gap-4">
            <div>
            <RadioGroupItem
              value="card"
              id="card"
              className="peer sr-only"
              aria-label="Card"
            />
            <Label
              htmlFor="card"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="mb-3 h-6 w-6"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
              Card
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="paypal"
              id="paypal"
              className="peer sr-only"
              aria-label="Paypal"
            />
            <Label
              htmlFor="paypal"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Icons.paypal className="mb-3 h-6 w-6" />
              Paypal
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="apple"
              id="apple"
              className="peer sr-only"
              aria-label="Apple"
            />
            <Label
              htmlFor="apple"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Icons.apple className="mb-3 h-6 w-6" />
              Apple
            </Label>
          </div>
            </div>
          </RadioGroup>
          {errors.paymentMethod && (
            <p className="text-red-500">{errors.paymentMethod.message}</p>
          )}

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input className="bg-primary-foreground" id="name" placeholder="First Last" {...register("name")} />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input className="bg-primary-foreground" id="city" placeholder="City" {...register("city")} />
            {errors.city && (
              <p className="text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="number">Card Number</Label>
            <Input className="bg-primary-foreground" id="number" placeholder="1234 5678 9012 3456" {...register("number")} />
            {errors.number && (
              <p className="text-red-500">{errors.number.message}</p>
            )}
          </div>

          {/* Expiration Date and CVC */}
          <div className="grid grid-cols-3 gap-4">
            {/* Month */}
            <Controller
              name="month"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div className="grid gap-2">
                  <Label htmlFor="month">Expires</Label>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-primary-foreground" id="month">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>
                          {new Date(0, i).toLocaleString("default", { month: "long" })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.month && (
                    <p className="text-red-500">{errors.month.message}</p>
                  )}
                </div>
              )}
            />

            {/* Year */}
            <Controller
              name="year"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <div className="grid gap-2">
                  <Label htmlFor="year">Year</Label>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-primary-foreground" id="year">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={i} value={`${new Date().getFullYear() + i}`}>
                          {new Date().getFullYear() + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.year && (
                    <p className="text-red-500">{errors.year.message}</p>
                  )}
                </div>
              )}
            />

            <div className="grid gap-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input className="bg-primary-foreground" id="cvc" placeholder="CVC" {...register("cvc")} />
              {errors.cvc && (
                <p className="text-red-500">{errors.cvc.message}</p>
              )}
            </div>
          </div>

          <Button className="w-full" type="submit" onSubmit={handleUpgrade}>Submit</Button>
        </form>
      </CardContent>
            </Card>
            </div>
  );
}

export default CardInput;