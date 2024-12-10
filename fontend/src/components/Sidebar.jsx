import {
  DollarSign,
  ShoppingBag,
  ShoppingCart,
  Users,
  House,
  List,
  Pill,
  HousePlus,
  UserRound,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    name: "Trang chủ",
    icon: House,
    color: "#0066FF",
    href: "/",
  },
  {
    name: "Danh mục thuốc",
    icon: List,
    color: "#007BFF",
    children: [
      {
        name: "Thuốc",
        icon: Pill,
        color: "#66CCFF",
        href: "/medicines",
      },
      {
        name: "Loại thuốc",
        icon: ShoppingBag,
        color: "#33CCFF",
        href: "/category-medicine",
      },
    ],
  },
  {
    name: "Nhà cung cấp",
    icon: HousePlus,
    color: "#FF3366",
    href: "/supplier",
  },
  {
    name: "Khách hàng",
    icon: UserRound,
    color: "#00FF00",
    href: "/customers",
  },
  {
    name: "Người dùng",
    icon: Users,
    color: "#FF00CC",
    href: "/users",
  },
  {
    name: "Báo cáo",
    icon: DollarSign,
    color: "#FFFF00",
    href: "/",
  },
  {
    name: "Đơn hàng",
    icon: ShoppingCart,
    color: "#33FFFF",
    href: "/orders",
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});

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
      <div className="h-full bg-white-200 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-300 overflow-y-auto hide-scrollbar">
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
            <div key={item.name}>
              <Link to={item.href} className="block">
                <motion.div
                  onClick={() =>
                    item.children ? toggleExpand(item.name) : null
                  }
                  className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-blue-300 transition-colors mb-2 cursor-pointer"
                >
                  <item.icon
                    size={20}
                    style={{ color: item.color, minWidth: "20px" }}
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

              {/* Render children with delay if item has children and is expanded */}
              {item.children && expandedItems[item.name] && isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                  className="ml-8"
                >
                  {item.children.map((subItem, index) => (
                    <Link key={subItem.href} to={subItem.href}>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 + index * 0.1 }}
                        className="flex items-center p-2 text-sm font-medium rounded-lg hover:bg-blue-300 transition-colors mb-1"
                      >
                        <subItem.icon
                          size={18}
                          style={{ color: subItem.color, minWidth: "18px" }}
                        />
                        <span className="ml-3">{subItem.name}</span>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
