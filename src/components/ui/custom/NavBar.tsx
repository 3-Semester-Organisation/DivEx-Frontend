"use client";

import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "@/js/AuthContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/NavigationMenu";
import { User, Rocket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../button";
import { fetchSubscriptionChange } from "@/api/subscription";
import { getSubscriptionTypeFromToken } from "@/js/jwt";

const portfolioNavigation: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: "Overview",
    href: "/portfolio/overview",
    description:
      "Overview of your portfolio, including total value, performance, and more.",
  },
];

const homeNavigation: { title: string; to: string; description: string }[] = [
  {
    title: "Calendar",
    to: "/calendar",
    description: "Info about upcoming and past dividends.",
  },
  {
    title: "All stocks",
    to: "/stocks",
    description: "All stocks available on the platform.",
  },
  {
    title: "Trending stocks",
    to: "/trending",
    description: "The most viewed stocks this week.",
  },
];

export default function Navbar({ onLogout }) {
  const { logout, subscriptionType, setSubscriptionType } =
    useContext(AuthContext);

  const isPremium = (subscriptionType: string) => {
    return subscriptionType !== "PREMIUM";
  };

  const handleLogout = () => {
    logout();
    toast.success("Logout successful.");
  };

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

  return (
    <NavigationMenu className="flex flex-row p-6 ml-10">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Home</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[400px] ">
              {homeNavigation.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  to={component.to}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Portfolio</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[400px] ">
              {portfolioNavigation.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  to={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem className="flex justify-end">
          {isPremium(subscriptionType) ? (
            <Button
              className="mr-5 border"
              variant={"ghost"}
              onClick={handleUpgrade}
            >
              <Rocket />
              Upgrade to Premium
            </Button>
          ) : (
            ""
          )}
        </NavigationMenuItem>

        <NavigationMenuItem className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div
                className={cn(
                  "mr-13 flex items-center justify-center p-2 rounded-md cursor-pointer",
                  "hover:bg-primary-foreground"
                )}
              >
                <User />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <NavLink
                  to="/settings"
                  className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Settings
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLogout()} asChild>
                <NavLink
                  to="/"
                  className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Sign out
                </NavLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<typeof NavLink>
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <NavLink
          ref={ref}
          to={to}
          title={title}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {typeof children === "function" ? null : (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </NavLink>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
