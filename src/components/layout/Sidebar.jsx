import { useAuth } from "../../context/auth/AuthContext";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ProductsIcon,
  GalleryIcon,
  RecycleIcon,
  CatalogIcon,
  ProfileIcon,
  SidebarIcon,
  LoginIcon,
  LogoutIcon,
} from "../Icons";
import Portal from "../Portal/Portal";
import { useEffect, useState } from "react";

const navagate = [
  {
    title: "Home",
    path: "/",
    icon: <HomeIcon />,
    useAuth: false,
    header: true,
  },
  {
    title: "Products",
    path: "/products",
    icon: <ProductsIcon />,
    useAuth: true,
    header: true,
  },
  {
    title: "Gallery",
    path: "/gallery",
    icon: <GalleryIcon />,
    useAuth: true,
    header: true,
  },
  {
    title: "Recycle",
    path: "/recycle",
    icon: <RecycleIcon />,
    useAuth: true,
    header: true,
  },
  {
    title: "Catalog",
    path: "/catalog",
    icon: <CatalogIcon />,
    useAuth: true,
    header: true,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <ProfileIcon />,
    useAuth: true,
    header: false,
  },
];
const logoutNavagate = {
  title: "Logout",
  icon: <LogoutIcon />,
};
const loginNavagate = {
  title: "Login",
  path: "/login",
  icon: <LoginIcon />,
};
const Sidebar = (props) => {
  const { isOpen, setIsOpen } = props;
  const { currentUseruid, logout } = useAuth();
  const { pathname } = useLocation() || {};
  const [headernavagate, setHeadernavagate] = useState([]);
  const [footerNavagate, setFooterNavagate] = useState([]);
  useEffect(() => {
    setHeadernavagate(
      navagate.filter(
        (item) => item.header && (item.useAuth ? currentUseruid : true)
      )
    );
    setFooterNavagate(
      navagate.filter(
        (item) => !item.header && (item.useAuth ? currentUseruid : true)
      )
    );
  }, [currentUseruid]);

  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  const renderLink = (item, index) => {
    return (
      <li key={index}>
        <Link
          to={item.path}
          className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
            isOpen ? "" : "justify-center"
          } ${pathname === item.path ? "dark:bg-gray-700" : ""}`}
          onClick={item.click}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          <span className={`ms-3 ${!isOpen && "hidden"}`}>{item.title}</span>
          {!isOpen && (
            <div
              className="absolute left-16 scale-0 group-hover:scale-100 transition-all rounded-lg bg-gray-800 p-3 text-sm text-white
                before:content-[''] before:absolute before:top-1/2 before:-left-2 before:-translate-y-1/2
                before:border-8 before:border-transparent before:border-r-gray-800"
            >
              {item.title}
            </div>
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      <Portal wrapperId="sidebar-icon">
        <button
          onClick={toggleSidebar}
          className={`w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-50 ${
            isOpen ? "absolute top-5 left-64" : "fixed top-5 left-14"
          }`}
        >
          <span
            className={` transform transition-transform duration-300 ${
              isOpen ? "rotate-0" : "-rotate-180"
            }`}
          >
            <SidebarIcon />
          </span>
        </button>
      </Portal>
      <aside
        className={`fixed top-0 left-0 z-40  h-screen transition-transform ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-16"
        } sm:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-bg flex flex-col border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center ps-2.5 mb-5">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-6 me-3 sm:h-7"
              alt="Flowbite Logo"
            />
            <span
              className={`self-center text-xl font-semibold whitespace-nowrap dark:text-white  ${
                !isOpen && "hidden"
              } `}
            >
              Your Logo
            </span>
          </div>
          <ul className="space-y-2 font-medium flex-grow">
            {headernavagate.map((item, index) => renderLink(item, index))}
          </ul>
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <ul className="space-y-2">
              {[
                ...footerNavagate,
                ...(!currentUseruid
                  ? [loginNavagate]
                  : [{ ...logoutNavagate, click: logout }]),
              ].map((item, index) => renderLink(item, index))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
