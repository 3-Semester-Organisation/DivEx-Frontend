"use client";

import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "@/js/AuthContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { useNavigate } from "react-router-dom";
import ModeToggle from "../mode-toggle";
import { AlignLeft } from 'lucide-react';
import SearchBar from "@/components/divex/searchBar";

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
  const navigate = useNavigate();
  const { logout, subscriptionType } =
    useContext(AuthContext);

  const isPremium = (subscriptionType: string) => {
    return subscriptionType !== "PREMIUM";
  };

  const handleLogout = () => {
    logout();
    toast.success("Logout successful.");
  };

  return (
    <>
      <NavigationMenu className="flex flex-row p-6 ml-10">
        <NavigationMenuList className="flex gap-2">
          <NavigationMenuItem>
            <NavigationMenuTrigger> <AlignLeft /></NavigationMenuTrigger>
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
            <NavigationMenuTrigger className="text-lg">Portfolio</NavigationMenuTrigger>
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
                className="border"
                variant={"ghost"}
                onClick={() => navigate("/pricing")}
              >
                <Rocket />
                Upgrade to Premium
              </Button>
            ) : (
              ""
            )}
          </NavigationMenuItem>

          <NavigationMenuItem className="flex justify-end">
            <ModeToggle />
          </NavigationMenuItem>

          <NavigationMenuItem className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  className={cn(
                    "border mr-13 flex items-center justify-center p-2 rounded-md cursor-pointer",
                    "hover:bg-primary-foreground"
                  )}
                >
                  <User />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
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

      <div className="ml-auto w-96">
        <SearchBar placeholder={"Search..."} />
      </div>
    </>
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
