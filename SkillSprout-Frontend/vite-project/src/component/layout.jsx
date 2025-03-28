import React from "react";
import { Outlet } from "react-router-dom";
import MainNavigation from "./main-navbar/main-navigation";

function Layout({ userDetails }) {

  return (
    <main>
      <section>
        <div>
          <MainNavigation userDetails={userDetails}/>
        </div>
        <Outlet />
      </section>
    </main>
  );
}

export default Layout;
