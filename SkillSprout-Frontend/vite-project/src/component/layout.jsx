import React from "react";
import { Outlet } from "react-router-dom";
import MainNavigation from "./main-navbar/main-navigation";

function Layout() {
  return (
    <main>
      <section>
        <div>
          <MainNavigation />
        </div>
        <Outlet />
      </section>
    </main>
  );
}

export default Layout;
