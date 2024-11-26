import { createContext, useContext, useState, useCallback } from 'react';

const SidebarContext = createContext({
  isExpanded: false,
  sidebarWidth: 100,
  toggleSidebar: () => {},
});

export function SidebarProvider({ children }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(100);

  const toggleSidebar = useCallback(() => {
    setIsExpanded(prev => !prev);
    setSidebarWidth(prev => prev === 100 ? 240 : 100);
  }, []);

  const value = {
    isExpanded,
    sidebarWidth,
    toggleSidebar
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}