import { SearchIcon } from "./Icons";
const SearchInput = ({ onSearch }) => {
  return (
    <div className="relative max-w-lg">
      <input
        type="text"
        placeholder="Search"
        id="search"
        className="w-full px-6 text-lg text-gray-200 dark:bg-gray-800 rounded-full 
                 border border-gray-700 focus:outline-none focus:border-gray-500
                 placeholder-gray-400"
        onChange={(e) => {
          e.preventDefault();
          onSearch?.(e.target.value);
        }}
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <SearchIcon />
      </div>
    </div>
  );
};

export default SearchInput;