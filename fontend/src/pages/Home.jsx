import Header from "../components/Header";
import { motion } from "framer-motion";
import StatCard from "../components/StatCard";
import { DollarSign, ShoppingCart, Users, Box } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useContext } from "react";
import { UserContext } from "../../context/usercontext.jsx";

const Home = () => {
  const { user } = useContext(UserContext);
  return (
    <div className="flex h-screen bg-gray-500 text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="w-screen h-screen overflow-auto z-10">
      <Header title="Tổng quan" username={user?.name} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-10">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="Revenue"
              icon={DollarSign}
              value="1,200"
              color="#FFC107"
            />
            <StatCard
              name="Orders"
              icon={ShoppingCart}
              value="150"
              color="#33FFFF"
            />
            <StatCard name="Users" icon={Users} value="265" color="#FF5722" />
            <StatCard name="Products" icon={Box} value="350" color="#4CAF50" />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Home;
