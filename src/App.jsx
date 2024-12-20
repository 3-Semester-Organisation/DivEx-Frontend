import { useContext } from "react";
import { AuthContext } from "@/js/AuthContext";
import Navbar from "@/components/ui/custom/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Trending from "@/views/trendingPage";
import StockDetailsPage from "@/views/stockDetailsPage";
import ModeToggle from "@/components/ui/mode-toggle";

import StocksPage from "@/views/stocksPage";
import Login from "@/views/login";
import Register from "@/views/register";
import CalendarPage from "@/views/calendarPage";
import DefaultNavbar from "@/components/ui/custom/DefaultNavbar";
import Settings from "@/views/settings";
import PortfolioOverview from "@/views/portfolioOverview";
import Landing from "@/Landing.tsx";
import NotFoundView from "@/views/errorviews/404";
import Pricing from "@/views/pricingPage";
import CardInput from "@/views/cardInput";
import { Footer } from "@/components/ui/custom/footer";

// eslint-disable-next-line react/prop-types
function Layout({ children, isLoggedIn }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between mb-2 cursor-pointer">
        <div
          onClick={() => {
            navigate("/");
          }}
          className="flex justify-start items-center"
        >
          <img
            src="/divex-icon-no-bg.png"
            alt="DivEx-icon"
            width={"50px"}
            height={"50px"}
          />
          <h1 className="font-semibold text-5xl ml-2">Div</h1>
          <p className="ont-semibold text-5xl text-teal-700">Ex</p>
        </div>
      </div>
      {isLoggedIn ? <Navbar /> : <DefaultNavbar />}
      {children}
    </>
  );
}

function App() {
  // gets login state from AuthContext
    const { isLoggedin: isLoggedIn } = useContext(AuthContext);
    
  return (
    <div className="flex flex-col min-h-screen">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <main className="flex-grow">
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
                      <Route
                        path="/stocks/:ticker"
                        element={<StockDetailsPage />}
                      />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/upgrade" element={<CardInput />} />
                      <Route path="*" element={<NotFoundView />} />
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
                  </main>
                  <Footer />
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
