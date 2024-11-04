import { SearchIcon, FilterIcon } from "./Icons";
const SearchInput = ({ onSearch, filter }) => {
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
        className="dark:bg-gray-800 border-none focus:ring-0 "
        onChange={(e) => {
          e.preventDefault();
          onSearch?.(e.target.value);
        }}
      />
      <div className="flex items-center gap-2">
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
