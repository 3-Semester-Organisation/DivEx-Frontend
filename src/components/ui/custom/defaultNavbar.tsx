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


export default function DefaultNavbar() {
  return (
    <NavigationMenu className="flex flex-row p-6 ml-10">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavLink to="/login" className={navigationMenuTriggerStyle()}>
            Login
          </NavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
            <NavLink to="/register" className={navigationMenuTriggerStyle()}>
              Create account
            </NavLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger className="userbutton">
              <User />
            </DropdownMenuTrigger>
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
