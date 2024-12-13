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
import Landing from "@/Landing.jsx";


// eslint-disable-next-line react/prop-types
function Layout({ children, isLoggedIn}) {
  return (
      <>
        <div className="flex justify-between mb-2">
          <a href="/"><h1 className="font-semibold text-2xl">DivEX</h1></a>
          <div>
            <ModeToggle/>
          </div>
        </div>
        {isLoggedIn ? <Navbar/> : <DefaultNavbar/>}
        {children}
      </>
  );
}





function App() {
  // gets login state from AuthContext
  const { isLoggedin: isLoggedIn } = useContext(AuthContext);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Other Routes with Shared Layout */}
          <Route
            path="/*"
            element={
              <Layout isLoggedIn={isLoggedIn}>
                <Routes>
                  <Route path="/trending" element={<Trending />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/account" element={<p>account</p>} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/stocks" element={<StocksPage />} />
                  <Route
                    path="/portfolio/overview"
                    element={<PortfolioOverview isLoggedIn={isLoggedIn} />}
                  />
                  <Route path="/stocks/:ticker" element={<StockDetailsPage />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
