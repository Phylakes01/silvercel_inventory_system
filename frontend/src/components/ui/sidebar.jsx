import React, { createContext, useContext, useState } from 'react';
import { Menu } from 'lucide-react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      <div className="flex">
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const Sidebar = ({ children }) => {
  const { isOpen } = useSidebar();
  return (
    <aside className={`bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-64 min-h-screen transition-all duration-300 ${isOpen ? 'ml-0' : '-ml-64'}`}>
      {children}
    </aside>
  );
};

export const SidebarHeader = ({ children }) => (
  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
    {children}
  </div>
);

export const SidebarContent = ({ children }) => (
  <div className="p-4">
    {children}
  </div>
);

export const SidebarFooter = ({ children }) => (
  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
    {children}
  </div>
);

export const SidebarGroup = ({ children }) => (
  <div>
    {children}
  </div>
);

export const SidebarGroupLabel = ({ children }) => (
  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
    {children}
  </h3>
);

export const SidebarGroupContent = ({ children }) => (
  <div>
    {children}
  </div>
);

export const SidebarMenu = ({ children }) => (
  <ul className="space-y-2">
    {children}
  </ul>
);

export const SidebarMenuItem = ({ children }) => (
  <li>
    {children}
  </li>
);

export const SidebarMenuButton = ({ children, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
  >
    {children}
  </button>
);

export const SidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
      <Menu />
    </button>
  );
};