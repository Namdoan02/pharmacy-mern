import { motion } from "framer-motion";
import StatCard from "../components/StatCard";
import { DollarSign, ShoppingCart, Box } from "lucide-react";

const Home = () => {
  return (
    <div>
      {/* <Header username={user?.name} onLogout={handleLogout} /> */}
      <main className="justify-center max-w-7x1 mx-auto py-6 px-4 lg:px-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Tổng doanh thu"
            icon={DollarSign}
            value="1,200"
            color="#FFC107"
          />
          <StatCard
            name="Tổng đơn hàng"
            icon={ShoppingCart}
            value="150"
            color="#33FFFF"
          />
          <StatCard
            name="Tổng sản phẩm"
            icon={Box}
            value="350"
            color="#4CAF50"
          />
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
