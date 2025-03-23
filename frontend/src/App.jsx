import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Correct import for Router
import HomePage from "./pages/home/HomePage";
import HomeScreen from "./pages/home/HomeScreen";
import LoginPage from "./pages/LoginPage";
import WatchPage from "./pages/WatchPage";
import SignUpPage from "./pages/SignUpPage";
import Footer from "./components/Footer";
import SearchHistoryPage from "./pages/SearchHistoryPage";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";

function App() {

  return (
    <>
{/* <h1 className="bg-black text-white">Start</h1> */}

<Router>
<Routes>
  <Route path='/' element={<HomePage/>}/>
  <Route path='/login' element={<LoginPage/>}/>
  <Route path='/signup' element={<SignUpPage/>}/>
  <Route path="/home" element={<HomeScreen />} />
   {/* <Route path="/watch" element={<WatchPage />} /> */}
   <Route path="/watch/:contentType/:id" element={<WatchPage />} />
   <Route path='/history' element={<SearchHistoryPage />}/>
   <Route path='/search' element={<SearchPage />}/>
  <Route path='*' element={<NotFound/>}/>
</Routes>
</Router>
<Footer/>
    </>
  );
}

export default App
