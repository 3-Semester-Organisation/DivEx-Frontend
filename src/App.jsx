import Navbar from "@/components/ui/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Homepage from "@/pages/homepage";
import ModeToggle from "@/components/ui/mode-toggle";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex flex-row mb-2">
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
