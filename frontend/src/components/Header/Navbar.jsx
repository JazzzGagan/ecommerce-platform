import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo/logo2.svg";
import API from "../../api/api";
import SearchIcon from "../../assets/Search 1.svg";
import { IoMdArrowDropdown } from "react-icons/io";
import { LuShoppingCart } from "react-icons/lu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  console.log("categories", categories);

  useEffect(() => {
    API.get(`/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const mainCategories = categories.filter((c) => !c.parent);
  const subCategories = categories.filter((c) => c.parent);
  console.log("subcategories", subCategories);
  

  if (loading) return <div>Loading...</div>;
  return (
    <>
      <header className="w-full h-auto flex flex-col items-center justify-center border-b border-gray-500">
        <div className="w-full h-auto flex items-center justify-center bg-primary">
          <div className="w-[90%] py-2  flex items-center space-x-2 justify-end">
            <LuShoppingCart className="text-3xl cursor-pointer" />
            <FontAwesomeIcon icon={faHeart} className="text-3xl ml-4 cursor-pointer" />
            <FontAwesomeIcon icon={faUser} className="text-3xl ml-4 cursor-pointer" />
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
        <div className=" w-[90%]  flex  items-center justify-between">
          {!loading &&
            mainCategories.slice(0, 7).map((c) => (
              <>
                <NavLink
                  key={c.id || c._id || c.slug}
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
              </>
            ))}
        </div>
      </nav>
    </>
  );
};

export default Header;
