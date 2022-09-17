import { SearchIcon } from "../../icons/search";

export const Search = () => {
  return (
    <div className="grid gap-6 mb-6 md:grid-cols-2">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="search"
          id="default-search"
          className="block p-2 pl-10 text-sm text-gray-800 bg-white rounded-full shadow-xl full-screen-input lg:w-96 dark:text-white dark:bg-nav-dark-500 focus:ring-blue-500 focus:border-blue-500 "
          placeholder="Search NFT’s and Account’s."
          required
        />
      </div>
    </div>
  );
};
