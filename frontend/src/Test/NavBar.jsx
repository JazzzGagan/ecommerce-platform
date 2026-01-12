import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo/logo2.svg";
import API from "../api/api";
import SearchIcon from "../assets/Search 1.svg";
import { IoMdArrowDropdown } from "react-icons/io";
import { LuShoppingCart } from "react-icons/lu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    API.get(`/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const mainCategories = categories.filter((c) => !c.parent);
  const getSubCategories = (parentId) =>
    categories.filter((c) => c.parent?._id === parentId);

  if (loading) return <div>Loading...</div>;
  return (
    <>
      <header className="w-full h-auto flex flex-col items-center justify-center border-b border-gray-500">
        <div className="w-full h-auto flex items-center justify-center bg-primary">
          <div className="w-[90%] py-2  flex items-center space-x-2 justify-end">
            <LuShoppingCart className="text-3xl cursor-pointer" />
            <FontAwesomeIcon
              icon={faHeart}
              className="text-3xl ml-4 cursor-pointer"
            />
            <FontAwesomeIcon
              icon={faUser}
              className="text-3xl ml-4 cursor-pointer"
            />
          </div>
        </div>
        <div className="w-[90%] flex   items-center justify-between   py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-auto h-30 " />
          </Link>
          <div className="w-300  flex border  rounded-full overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-4 py-4 border  text-[20px]  rounded-l-full focus:outline-none"
            />
            <button className="bg-neutral px-4  rounded-r-full    ">
              <img src={SearchIcon} alt="Search" />
            </button>
          </div>
        </div>
      </header>

      <nav className="w-full flex items-center justify-center   bg-primary  ">
        <div className=" w-[90%]  flex  items-center justify-between relative">
          {!loading &&
            mainCategories.slice(0, 7).map((c) => {
              const categoryId = c.id || c._id;
              const subCategories = getSubCategories(categoryId);
              console.log("test", subCategories);

              return (
                <div key={categoryId} className="relative group">
                  <NavLink
                    to={`/category/${c.slug || c.name}`}
                    className={({ isActive }) =>
                      `text-[20px] flex items-center justify-center font-heading px-4 py-8  rounded-md transition-colors ${
                        isActive
                          ? "bg-secondary text-white"
                          : " hover:bg-neutral/20 hover:text-secondary-dark"
                      }`
                    }
                  >
                    {c.name}
                    <IoMdArrowDropdown />
                  </NavLink>
                  {subCategories.length > 0 && (
                    <div className="absolute left-0 top-full mt-0 w-screen max-w-[90vw] -translate-x-[calc((100vw-90vw)/2)] bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <ul className="py-2 flex">
                        {subCategories.map((sub) => (
                          <li key={sub._id || sub.id}>
                            <NavLink
                              to={`/category/${sub.slug || sub.name}`}
                              className="block px-4 py-3 text-[16px] text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              {sub.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </nav>
    </>
  );
};

export default Header;
