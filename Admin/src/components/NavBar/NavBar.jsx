import React from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const NavBar = ({ toogleSidebar }) => {
  const { user } = useAuth();

  return (
    <div className="w-full h-20 flex items-center justify-between text-white bg-neutral px-8">
      <button onClick={toogleSidebar}>
        <FaBars className="text-3xl cursor-pointer" />
      </button>

      <div className="flex items-center gap-2">
        <FaUserCircle className="text-2xl" />
        <span className="text-sm font-medium">
          {user?.firstName} {user?.lastName}
        </span>
      </div>
    </div>
  );
};

export default NavBar;
