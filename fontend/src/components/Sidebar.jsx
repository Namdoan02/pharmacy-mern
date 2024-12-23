import {
  DollarSign,
  ShoppingBag,
  ShoppingCart,
  Users,
  House,
  ScrollText,
  Pill,
  HousePlus,
  UserRound,
  PillBottle,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { name: "Trang chủ", icon: House, href: "/" },
  { name: "Bán thuốc", icon: PillBottle, href: "/sell-medicine" },
  {
    name: "Danh mục thuốc",
    icon: ScrollText,
    children: [
      { name: "Thuốc", icon: Pill, href: "/medicines" },
      { name: "Loại thuốc", icon: ShoppingBag, href: "/category-medicine" },
    ],
  },
  { name: "Nhà cung cấp", icon: HousePlus, href: "/supplier",roles: ["admin"] },
  { name: "Khách hàng", icon: UserRound, href: "/customers" },
  { name: "Nhân viên", icon: Users, href: "/users",roles: ["admin"] },
  { name: "Báo cáo", icon: DollarSign, href: "/reports",roles: ["admin"] },
  { name: "Hóa đơn", icon: ShoppingCart, href: "/order" },
];

const Sidebar = ({userRole}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleExpand = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-200 bg-opacity-90 p-4 flex flex-col border-r border-gray-300 overflow-y-auto hide-scrollbar">
        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-blue-300 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
        {SIDEBAR_ITEMS.map((item) => (
            (!item.role || item.role.includes(userRole)) && (
              <div key={item.name}>
              <Link to={item.href || "#"}>
                <motion.div
                  onClick={() =>
                    item.children ? toggleExpand(item.name) : null
                  }
                  className={`flex items-center p-4 text-md font-medium rounded-lg mb-2 cursor-pointer transition-all ${
                    location.pathname === item.href
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-300 text-gray-800"
                  }`}
                >
                  <item.icon
                    size={20}
                    style={{ minWidth: "20px" }}
                    className={
                      location.pathname === item.href ? "text-white" : ""
                    }
                  />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-4 whitespace-nowrap"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>

              {/* Render children */}
              {item.children && expandedItems[item.name] && isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                  className="ml-8"
                >
                  {item.children.map((subItem) => (
                    <Link key={subItem.href} to={subItem.href}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center p-2 text-sm font-medium rounded-lg mb-1 transition-all ${
                          location.pathname === subItem.href
                            ? "bg-blue-400 text-white"
                            : "hover:bg-blue-200 text-gray-800"
                        }`}
                      >
                        <subItem.icon
                          size={18}
                          style={{ minWidth: "18px" }}
                          className={
                            location.pathname === subItem.href
                              ? "text-white"
                              : ""
                          }
                        />
                        <span className="ml-3">{subItem.name}</span>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
            )
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
