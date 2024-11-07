import { useEffect } from "react";
import { SearchIcon, FilterIcon } from "./Icon";
const SearchInput = ({ onSearch, filter }) => {
  useEffect(() => {
    document.getElementById("search").focus();
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        document.getElementById("search").focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div
      className=" flex items-center justify-between px-3 text-lg text-gray-200 dark:bg-gray-800 rounded-full 
                 border border-gray-700 focus:outline-none focus:border-gray-500
                 placeholder-gray-400"
    >
      <input
        type="text"
        placeholder="Search"
        id="search"
        className="dark:bg-gray-800 border-none focus:ring-0 sm:p-2 p-1 sm:w-40 w-20"
        onChange={(e) => {
          onSearch?.(e.target.value);
        }}
      />
      <div className="flex items-center gap-2 ">
        {filter && (
          <div onClick={filter}>
            <FilterIcon />
          </div>
        )}
        <div>
          <SearchIcon />
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
