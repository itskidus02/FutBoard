// App.js

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateTableAndClub from "./pages/CreateTableAndClub";
import DisplayTable from "./pages/DisplayTable";
import ManageMatches from "./pages/ManageMatches";
import UpdateTableAndClub from "./pages/UpdateTableAndClub";
import ResultDisplay from "./pages/ResultDisplay";
import NotFound from "./pages/NotFound"; // Import the NotFound component
import { BorderBeam } from "./components/magicui/border-beam";
import Footer from "./components/Footer";
import MatchDisplay from './pages/MatchDisplay';
// import { AccordionDemo } from "./components/Demo/AccordionDemo";
export default function App() {
  return (
    <BrowserRouter>
      <Header />
    
      {/* <AccordionDemo /> */}

      <div className="mt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/display-table/:tableId" element={<DisplayTable />} />
          <Route path="/display-result" element={<ResultDisplay />} />
          <Route path="/match/:matchId" element={<MatchDisplay />} /> {/* New Route */}

          
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-table-team" element={<CreateTableAndClub />} />
            <Route
              path="/manage-matches/:tableId"
              element={<ManageMatches />}
            />
            <Route
              path="/update-table/:tableId"
              element={<UpdateTableAndClub />}
            />

            {/* 404 Page */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer/>
    </BrowserRouter>
  );
}
