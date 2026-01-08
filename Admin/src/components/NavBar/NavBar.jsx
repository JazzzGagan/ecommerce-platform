import React from "react";
import { FaBars } from "react-icons/fa";
const NavBar = ({ toogleSidebar }) => {
  return (
    <div className="w-full h-20  flex items-center justify-start  text-white bg-neutral">
      <button onClick={toogleSidebar}>
        <FaBars className="ml-8 text-3xl cursor-pointer" />
      </button>
    </div>
  );
};

export default NavBar;
