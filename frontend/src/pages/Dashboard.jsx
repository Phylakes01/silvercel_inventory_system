import { UserAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import StatusCards from "@/components/StatusCards";
import { SalesTrendChart } from "@/components/SalesTrendChart";
import StockByCategory from "../components/StockByCategory";
import LowStockPopover from "@/components/LowStockPopover";
import { 
    PackageCheck, 
    PhilippinePeso, 
    ChartNoAxesCombined, 
    OctagonAlert,
    Bell, 
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const dashboard_cards = [
    {
        title: "Products in Stock",
        value: "9,872",
        icon: PackageCheck,
        color: "text-chart-1",
    },
    {
        title: "Inventory Value",
        value: "₱10,872",
        icon: PhilippinePeso,
        color: "text-chart-4",
    },
    {
        title: "Sales This Month",
        value: "₱10,872",
        icon: ChartNoAxesCombined,
        color: "text-chart-5",
    },
    {
        title: "Low Stock Items",
        value: "2",
        icon: OctagonAlert,
        color: "text-destructive",
    }
]

const exampleLowStockItems = [
  { name: "Pandora charm", stock: 2 },
  { name: "Ring", stock: 5 },
  { name: "Bracelet", stock: 3 },
];

export default function Dashboard() {
    const { session, logout } = UserAuth();
    console.log(session);

    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex gap-6 justify-between items-center">
                <p className="text-2xl font-semibold">Dashboard</p>
                <LowStockPopover lowStockItems={exampleLowStockItems} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatusCards cards={dashboard_cards} />
            </div>
            <SalesTrendChart />
            <StockByCategory />
        </div>
    )
}