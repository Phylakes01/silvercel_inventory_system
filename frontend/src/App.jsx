import { Outlet } from "react-router-dom";
import AppSidebar from "./components/AppSidebar";
import { useNavigation } from "@/context/NavigationContext";

function App() {
  const { selectedMenu } = useNavigation();

  return (
    <div className="flex w-full relative">
      <AppSidebar />
      <main className="flex-1 p-4 sm:p-6 mb-6 mt-10 lg:mt-0 max-w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
