"use client";

import * as React from "react";
import { NavLink } from "react-router-dom";

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
  navigationMenuTriggerStyle,
} from "@/components/ui/NavigationMenu";
import { ChevronDown, Navigation, User } from "lucide-react";

const authNavigation = [
  { name: "Login", to: "/login" },
  { name: "Register", to: "/register" },
];

const portfolioNavigation: { title: string; href: string; description: string }[] = [
  {
    title: "Overview",
    href: "/",
    description:
      "Overview of your portfolio, including total value, performance, and more.",
  },
];

const homeNavigation: { title: string; to: string; description: string }[] = [
  {
    title: "Dashboard",
    to: "/dashboard",
    description: "Overview of all your data.",
  },
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
    to: "/",
    description: "The most viewed stocks this week.",
  },
]

export default function Navbar() {
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
          <DropdownMenu>
            <DropdownMenuTrigger className="userbutton" ><User /></DropdownMenuTrigger>
            <DropdownMenuContent>
              {authNavigation.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <NavLink
                    to={item.to}
                    className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {item.name}
                  </NavLink>
                </DropdownMenuItem>
              ))}
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
          {typeof children === 'function' ? null : (
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
