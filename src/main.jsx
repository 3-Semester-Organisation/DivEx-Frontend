import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./js/AuthContext";
import { PortfoliosProvider } from "./js/PortfoliosContext.tsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Landing from "@/Landing.tsx";

createRoot(document.getElementById("root")).render(
  <>
    <PortfoliosProvider>
      <AuthProvider>
        <App/>
      </AuthProvider>
    </PortfoliosProvider>
    <Toaster />
    </>
);
