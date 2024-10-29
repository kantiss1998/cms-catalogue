import { motion } from "framer-motion";
import { LuUserCheck } from "react-icons/lu";
import { FaUserPlus } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaUserXmark } from "react-icons/fa6";
import Header from "../components/re-usable-components/Header";
import StatCard from "../components/re-usable-components/StatCard";

const userStats = {
    totalUsers: 152845,
    newUsersToday: 243,
    activeUsers: 98520,
    churnRate: "2.4%",
};

const UsersPage = () => {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Users' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* STATS */}
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name='Total Users'
                        icon={FaUser}
                        value={userStats.totalUsers.toLocaleString()}
                        color='#6366F1'
                    />
                    <StatCard name='New Users Today' icon={FaUserPlus} value={userStats.newUsersToday} color='#10B981' />
                    <StatCard
                        name='Active Users'
                        icon={LuUserCheck}
                        value={userStats.activeUsers.toLocaleString()}
                        color='#F59E0B'
                    />
                    <StatCard name='Churn Rate' icon={FaUserXmark} value={userStats.churnRate} color='#EF4444' />
                </motion.div>

            </main>
        </div>
    );
};
export default UsersPage;