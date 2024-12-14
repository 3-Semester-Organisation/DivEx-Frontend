import useCheckCredentials from "@/js/useCredentials";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
    const navigate = useNavigate();

  useCheckCredentials();

  return (
    <>
      <div className="flex">
        <h1 className="text-5xl mb-10">Pricing</h1>
      </div>

      <div className="grid grid-cols-8 mt-10">
        <div className="col-span-2 col-start-3">
          <Card className="mx-auto max-w-3xl w-96 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Free. forever.</CardDescription>
            </CardHeader>
                      <CardContent>
                            <ol className=" list-disc list-inside space-y-2">
                                <li>1 portfolio</li>
                                <li>max 10 stocks</li>
                          </ol>
                          <Button className="w-full mt-2" disabled>Current Plan</Button>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2">
          <Card className="mx-auto max-w-3xl w-96 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription>$10/month</CardDescription>
            </CardHeader>
                      <CardContent>
                      <ol className=" list-disc list-inside space-y-2">
                                <li>Unlimited portfolios</li>
                                <li>Unlimited stocks</li>
                          </ol>
                          <Button onClick={() => navigate("/upgrade")} className="w-full mt-2">Upgrade</Button>
                      </CardContent>
                      
          </Card>
        </div>
      </div>
    </>
  );
}
