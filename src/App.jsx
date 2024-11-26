import "@/App.css";
import Navbar from "@/components/ui/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Homepage from "@/pages/homepage";
import ModeToggle from "@/components/ui/mode-toggle";
import StocksPaginated from "@/components/divex/StocksPaginated"

function App() {


  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

        <ModeToggle />
        <Navbar />
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/stocks" element={<StocksPaginated />}></Route>
          </Routes>
        </Router>
        
      </ThemeProvider>
    </>
  );
}

export default App;
