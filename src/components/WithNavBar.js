// Page layout with a Navbar
import React from "react";
import NavBar from "./NavBarResponsive";
import { Outlet } from "react-router";

export default function WithNavBar() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};
