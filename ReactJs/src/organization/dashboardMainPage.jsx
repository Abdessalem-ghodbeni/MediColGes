import React from "react";
// import Slidebar from "./slidebar";
import Slidebar from "../SuperAdmin/dashboardSuperAdmin";
import TopbarStart from "./topbarStart";
// import TopbarStart from "../SuperAdmin/dashboardSuperAdmin";
import List from "./organizationList";
import Details from "./organizationDetails";
import { Link, Outlet } from "react-router-dom";

function dashboardMainPage() {
  return (
    <>
      <Slidebar />

      {/* Page content START */}
      <div className="page-content">
        {/* <TopbarStart /> */}
        {/* <Outlet/> */}
          {/* Page main content START */}

          {/* Page main content END */}
        {/* </Outlet> */}
      </div>
    </>
  );
}
export default dashboardMainPage;
