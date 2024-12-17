import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";

import WithNavbar from "./layouts/WithNavbar";
import WithOutnavbar from "./layouts/WithOutnavbar";

import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";

import Home from './pages/home'
import Adminstockpice from './pages/Adminstockpice'
import Admingovernan from './pages/Admingovernan/index'
import Adminnews from './pages/Adminnews/index'
import Admindocread from './pages/Admindocread/index'
import Adminnewsprint from './pages/Adminnewsprint/index'
import Adminholder from './pages/Adminholderstuc/index'
import Adminevent from "./pages/Adminevent/index";
import Adminfinanstates from "./pages/Adminfinanstates/index";



const RoutesPage = () => {
  return (
    <Router>
      <Routes>
        <Route element={<WithOutnavbar />}>
          <Route exact  path="/auth/signin" element={<Signin />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Route>
        <Route
          element={
            <RequireAuth loginPath={"/auth/signin"}>
              <WithNavbar />
            </RequireAuth>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/Adminstockpice" element={<Adminstockpice />} />
          <Route path="/Admingovernan" element={<Admingovernan />} />
          <Route path="/Adminnews" element={<Adminnews />} />
          <Route path="/Admindocread" element={<Admindocread />} />
          <Route path="/Adminnewsprint" element={<Adminnewsprint />} />
          <Route path="/Adminholder" element={<Adminholder />} />
          <Route path="/Adminevent" element={<Adminevent />} />
          <Route path="/Adminfinanstates" element={<Adminfinanstates />} />
          
        </Route>
      </Routes>
    </Router>
  );
};

export default RoutesPage;
