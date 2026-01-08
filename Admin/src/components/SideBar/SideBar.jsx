import { useState } from "react";
// import LogoS from "../assets/images/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaXmark, FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";
import MenuData from "../MenuData/MenuData.jsx";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ toogleSidebar, isVisible }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false); // State to manage dropdown

  const toggleSubmenu = () => setSubmenuOpen(!submenuOpen);

  return (
    <div
      className={`nav-bar w-56 h-full absolute top-0 left-0 z-50 bg-white text-gray-900 flex flex-col justify-between border-r border-gray-200 shadow-lg ${
        isVisible ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300`}
    >
      <button onClick={toogleSidebar} className="p-4 hover:bg-gray-100 rounded-lg transition-colors duration-200">
        <FaXmark className="text-2xl text-gray-600" />
      </button>

      <nav className="flex flex-col items-start w-full flex-1 overflow-y-auto px-3 mt-6 space-y-1">
        {MenuData.map((item, index) => (
          <div key={index} className="w-full">
            <NavLink
              className={({ isActive }) =>
                `flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
              exact="true"
              activeclassname="active"
              to={item.path}
              onClick={item.submenu ? toggleSubmenu : () => toogleSidebar()}
            >
              <span className="flex-shrink-0 text-lg">{item.icon}</span>
              <span className="flex-1">{item.title}</span>
              {item.submenu && (
                <span className="flex-shrink-0 text-gray-400">
                  {submenuOpen ? <FaCaretUp size={14} /> : <FaCaretDown size={14} />}
                </span>
              )}
            </NavLink>

            {item.submenu && submenuOpen && (
              <div className="ml-6 mt-2 space-y-1 border-l border-gray-200 pl-3">
                {item.submenu.map((subItem, subIndex) => (
                  <NavLink
                    key={subIndex}
                    to={subItem.path}
                    className={({ isActive }) =>
                      `block py-2.5 px-3 text-xs font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-blue-100 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`
                    }
                    onClick={toogleSidebar}
                  >
                    {subItem.title}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="w-full border-t border-gray-200 p-4 bg-gray-50">
        <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200">
          <FontAwesomeIcon icon={faSignOut} className="text-lg" />
          <p>Logout</p>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
