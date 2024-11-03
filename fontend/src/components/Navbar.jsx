import {
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/outline";

const Navbar = () => {
  return (
    <header className="bg-gray-200 py-4 shadow-md rounded-md">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <img src="logo.png" alt="Medicare Logo" className="h-8" />
          <span className="text-2xl font-semibold text-green-600">
            Medicare
          </span>
        </div>

        {/* Location Selector */}
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <span className="absolute inset-y-1 text-gray-500">
            Select Location
          </span>
          <select className="border-none text-black font-semibold rounded-lg">
            <option>New York</option>
            <option>San Francisco</option>
            <option>Los Angeles</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 mx-6 mb-4 md:mb-0">
          <div className="absolute inset-y-0 left-1 pl-0 flex items-center pointer-events-none">
            <div className="bg-green-500 rounded-full p-2">
              <SearchIcon className="h-4 w-4 text-black" />
            </div>
          </div>
          <input
            type="text"
            placeholder="Medicine and healthcare items"
            className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Links and Icons */}
        <div className="flex items-center space-x-6">
          <a
            href="#"
            className="text-sm font-semibold text-orange-500 bg-orange-100 px-2 py-1 rounded-lg"
          >
            New Healthcare Services
          </a>
          <a href="#" className="text-sm text-orange-500 hover:text-orange-600">
            Offers
          </a>
          <a href="#" className="text-gray-600 hover:text-green-500">
            <ShoppingCartIcon className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-600 hover:text-green-500">
            <UserIcon className="h-6 w-6" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
