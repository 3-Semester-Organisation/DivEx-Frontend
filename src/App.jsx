import { useContext } from "react";
import { AuthContext } from "@/js/AuthContext";
import Navbar from "@/components/ui/custom/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Trending from "@/views/trendingPage";
import StockDetailsPage from "@/views/stockDetailsPage";
import ModeToggle from "@/components/ui/mode-toggle";


import StocksPage from "@/views/stocksPage"
import Login from "@/views/login";
import Register from "@/views/register";
import CalendarPage from "@/views/calendarPage";
import DefaultNavbar from "@/components/ui/custom/DefaultNavbar";
import Settings from "@/views/settings";
import PortfolioOverview from "@/views/portfolioOverview";
import NotFoundView from "@/views/errorviews/404"


function App() {
  // gets login state from AuthContext
  const { isLoggedin: isLoggedIn } = useContext(AuthContext);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex justify-between mb-2">
        <h1 className="font-semibold text-2xl">DivEX</h1>
        <div>
          <ModeToggle />
        </div>
      </div>


     
        <Router>
          {isLoggedIn ? <Navbar/> : <DefaultNavbar/>}
          <Routes>
            <Route path="/" element={<p>homepage</p>} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<p>account</p>} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/stocks" element={<StocksPage />} />

            <Route path="/portfolio/overview" element={<PortfolioOverview isLoggedIn={isLoggedIn} />} />
            <Route path="/stocks/:ticker" element={<StockDetailsPage />} />

            <Route path="*" element={<NotFoundView />} />
          </Routes>
        </Router>
    </ThemeProvider>
  );
}

export default App;
