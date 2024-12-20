import { useContext } from "react";
import { AuthContext } from "@/js/AuthContext";
import Navbar from "@/components/ui/custom/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Trending from "@/views/trendingPage";
import StockDetailsPage from "@/views/stockDetailsPage";


import StocksPage from "@/views/stocksPage"
import Login from "@/views/login";
import Register from "@/views/register";
import CalendarPage from "@/views/calendarPage";
import DefaultNavbar from "@/components/ui/custom/DefaultNavbar";
import Settings from "@/views/settings";
import Pricing from "@/views/pricingPage";
import PortfolioOverview from "@/views/portfolioOverview";
import CardInput from "@/views/cardInput";
import NotFoundView from "@/views/errorviews/404"
import { Footer } from "@/components/ui/custom/Footer";



function App() {
  // gets login state from AuthContext
  const { isLoggedin: isLoggedIn } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <header className="flex justify-between">
      <div className="mb-2">
        <div className="flex justify-start items-center">
          <img src="/divex-icon-no-bg.png" alt="DivEx-icon" width="30px" height="30px"/>  
          <h1 className="font-semibold text-2xl ml-1">DivEX</h1>
        </div>  
          </div>
          </header>
      
      <Router>
          {isLoggedIn ? <Navbar className="h-auto" /> : <DefaultNavbar className="h-auto" />}
          <main className="flex-grow">
        <Routes>
          <Route path="/" element={<p>homepage</p>} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<p>account</p>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/stocks" element={<StocksPage />} />
          <Route path="/upgrade" element={<CardInput />} />

          <Route path="/portfolio/overview" element={<PortfolioOverview isLoggedIn={isLoggedIn} />} />
          <Route path="/stocks/:ticker" element={<StockDetailsPage />} />

          <Route path="*" element={<NotFoundView />} />
            </Routes>
          </main>
        <Footer />
      </Router>
      </ThemeProvider>
      </div>
    
  );
}

export default App;
