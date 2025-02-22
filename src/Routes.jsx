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
import Adminanalysis from "./pages/Adminanalysis/index";
import Adminreportmuser from "./pages/Adminreportmuser/index";
import Adminmeetinguser from "./pages/Adminmeetinguser/index";
import Admindetailgeneration from "./pages/Admindetailgeneration/index";
import AdminControuser from "./pages/AdminControuser/index";
import Adminthreeyear from "./pages/Adminthreeyear";
import Adminquarter from "./pages/Adminquarter";
import Adminpolicypayment from "./pages/Adminpolicypayment";
import Adminpropose from "./pages/Adminpropose";
import Adminrulecompany from "./pages/Adminrulecompany";
import Adminnewselectic from "./pages/Adminnewselectic";
import AdminVdomeet from "./pages/AdminVdomeet";



const RoutesPage = () => {
  return (
    <Router basename="/thairung/adminir">
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
          <Route path="/Adminanalysis" element={<Adminanalysis />} />
          <Route path="/Adminreportmuser" element={<Adminreportmuser />} />
          <Route path="/Adminmeetinguser" element={<Adminmeetinguser />} />
          <Route path="/Admindetailgeneration" element={<Admindetailgeneration />} />
          <Route path="/AdminControuser" element={<AdminControuser />} />
          <Route path="/Adminthreeyear" element={<Adminthreeyear />} />
          <Route path="/Adminquarter" element={<Adminquarter />} />
          <Route path="/Adminpolicypayment" element={<Adminpolicypayment />} />
          <Route path="/Adminpropose" element={<Adminpropose />} />
          <Route path="/Adminrulecompany" element={<Adminrulecompany />} />
          <Route path="/Adminnewselectic" element={<Adminnewselectic />} />
          <Route path="/AdminVdomeet" element={<AdminVdomeet />} />
          
        </Route>
      </Routes>
    </Router>
  );
};

export default RoutesPage;
