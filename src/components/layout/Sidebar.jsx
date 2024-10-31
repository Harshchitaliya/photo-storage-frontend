import { useState, useRef } from "react";
import { useAuth } from "../../context/auth/AuthContext";
const navagate = [
  {
    title: "Home",
    path: "/",
    icon: <></>,
    useAuth: false,
    header: true,
  },
  {
    title: "Products",
    path: "/products",
    icon: <></>,
    useAuth: true,
    header: true,
  },
  {
    title: "Gallery",
    path: "/gallery",
    icon: <></>,
    useAuth: true,
    header: true,
  },
  {
    title: "Recycle",
    path: "/recycle",
    icon: <></>,
    useAuth: true,
    header: true,
  },
  {
    title: "Catalog",
    path: "/catalog",
    icon: <></>,
    useAuth: true,
    header: true,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <></>,
    useAuth: true,
    header: false,
  },
];
const Sidebar = () => {
  const { currentUseruid } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const headernavagate = navagate.filter(
    (item) => item.header && (item.useAuth ? currentUseruid : true)
  );
  const footerNavagate = navagate.filter(
    (item) => !item.header && (item.useAuth ? currentUseruid : true)
  );
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };
  const navigate = (item) => {
    setActiveLink(item.title);
    setIsOpen(false);
  };
  const logout = () => {
    setActiveLink("Logout");
    setIsOpen(false);
  };

  return (
    <div className="flex relative">
      <button
        onClick={toggleSidebar}
        className={`w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen ? "absolute top-4 left-64" : "fixed top-6 left-1"
        }`}
      >
        <span
          className={`transform transition-transform duration-300 ${
            isOpen ? "-rotate-180" : "rotate-0"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-gray-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </span>
      </button>
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full max-w-xs bg-secondary text-white shadow-lg transition-transform duration-300 transform ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        }`}
      >
        <div className="p-4 h-full flex flex-col justify-between">
            <div>
                <ul className="space-y-2">
                {headernavagate.map((item) => (
                    <li
                    onClick={() => navigate(item)}
                    key={item.title}
                    className={`py-2 px-2 rounded hover:bg-button-hover ${
                        activeLink === item.title ? "bg-button-hover" : ""
                    } ${item.useAuth ? "" : "text-xl"}`}
                    >
                    {item.title}
                    </li>
                ))}
                </ul>
            </div>
            <div>
                <ul className="space-y-2">
                    {footerNavagate.map((item) => 
                        <li
                            key={item.title}
                            onClick={() => navigate(item)}
                            className={`py-2 px-2 rounded hover:bg-button-hover ${
                                activeLink === item.title ? "bg-button-hover" : ""
                            }`}
                        >
                            {item.title}
                        </li>
                    )}
                    <li
                        onClick={ () => {currentUseruid ? logout() : navigate({title:"Login",path:"/login"})} }
                        className="py-2 px-2 rounded hover:bg-button-hover"
                    >
                        {currentUseruid ? "Logout" : "Login"}
                    </li>  
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
