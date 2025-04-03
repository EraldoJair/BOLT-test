import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  FileText, 
  CreditCard, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

type Route = 'dashboard' | 'clients' | 'lots' | 'contracts' | 'payments' | 'settings';

interface SidebarProps {
  currentRoute: Route;
  onRouteChange: (route: Route) => void;
}

const navigation = [
  { name: 'Dashboard', route: 'dashboard' as Route, icon: LayoutDashboard },
  { name: 'Clients', route: 'clients' as Route, icon: Users },
  { name: 'Lots', route: 'lots' as Route, icon: Map },
  { name: 'Contracts', route: 'contracts' as Route, icon: FileText },
  { name: 'Payments', route: 'payments' as Route, icon: CreditCard },
  { name: 'Settings', route: 'settings' as Route, icon: Settings },
];

export function Sidebar({ currentRoute, onRouteChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Handle mobile menu toggling
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle sidebar collapse/expand (only for desktop)
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle route change and close mobile menu if it's open
  const handleRouteChange = (route: Route) => {
    onRouteChange(route);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Handle logout action
  const handleLogout = () => {
    // For now just alert, in real app would handle authentication logout
    alert('Logout functionality will be implemented here');
  };

  return (
    <>
      {/* Mobile menu button - only shown on small screens */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-gray-900 text-white"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar - different classes based on viewport and collapsed state */}
      <div 
        className={`
          ${isCollapsed ? 'w-16' : 'w-64'} 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          flex flex-col h-full bg-gray-900 text-white transition-all duration-300 fixed md:static z-40
        `}
      >
        <div className="p-4">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} mb-8`}>
            <Map className="h-8 w-8 flex-shrink-0" />
            {!isCollapsed && <span className="text-xl font-bold">RealEstate Pro</span>}
          </div>

          {/* Collapse button - only shown on desktop */}
          <button 
            onClick={toggleSidebar}
            className="hidden md:block absolute top-4 right-0 transform translate-x-1/2 bg-gray-800 rounded-full p-1 text-gray-300 hover:text-white"
          >
            {isCollapsed ? 
              <Menu className="h-4 w-4" /> : 
              <X className="h-4 w-4" />
            }
          </button>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleRouteChange(item.route)}
                  className={`
                    flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} 
                    px-4 py-2 text-gray-300 rounded-lg transition-colors duration-200 w-full 
                    ${currentRoute === item.route ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'}
                  `}
                  title={isCollapsed ? item.name : ''}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <button 
            onClick={handleLogout}
            className={`
              flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} 
              px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors duration-200 w-full
            `}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}