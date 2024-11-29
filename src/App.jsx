import Navbar from "@/components/ui/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Homepage from "@/pages/homepage";
import StockDetailsPage from "@/pages/stockDetailsPage";
import ModeToggle from "@/components/ui/mode-toggle";
import StocksPage from "@/pages/stocksPage"
import Login from "@/pages/login";
import Register from "@/pages/register";
import CalendarPage from "@/pages/calendarPage";


function App() {
  return (
    <div className="container main-container" >
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex flex-row justify-between items-center mb-2">
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
    </div>
  );
}

export default App;
