import Navbar from "@/components/ui/custom/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Homepage from "@/views/homepage";
import StockDetailsPage from "@/views/stockDetailsPage";
import ModeToggle from "@/components/ui/mode-toggle";
import StocksPage from "@/views/stocksPage"
import Login from "@/views/login";
import Register from "@/views/register";
import CalendarPage from "@/views/calendarPage";



function App() {
  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex justify-between mb-2">
          <h1 className="font-semibold text-2xl" >DivEX</h1>
          { /*< img src="/public/divex-logo.png" alt="logo" className="logo" /> */}
          <div>
            <ModeToggle />
          </div>
        </div>

        <Router>

          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<p>dashboard</p>} />
            <Route path="/account" element={<p>account</p>} />
            <Route path="/portfolio" element={<p>portfolio</p>} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/stocks" element={<StocksPage />} />
            <Route path="/stocks/:ticker" element={<StockDetailsPage />} />

          </Routes>

        </Router>
      </ThemeProvider>
  );
}

export default App;
