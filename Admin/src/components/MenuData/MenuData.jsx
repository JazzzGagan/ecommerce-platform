import {
  FaBoxOpen,
  FaListAlt,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const menuData = [
  {
    title: "DashBoard",
    path: "/admin",
    icon: <MdDashboard className="w-5 h-5 mr-3" />,
  },
  {
    title: "Categories",
    path: "/admin/categories",
    icon: <FaListAlt className="w-5 h-5 mr-3" />,
  },
  {
    title: "Products",
    path: "/admin/products",
    icon: <FaBoxOpen className="w-5 h-5 mr-3" />,
  },
  {
    title: "Orders",
    path: "/admin/orders",
    icon: <FaShoppingCart className="w-5 h-5 mr-3" />,
  },
  {
    title: "Users",
    path: "/admin/users",
    icon: <FaUsers className="w-5 h-5 mr-3" />,
  },
  
];

export default menuData;
