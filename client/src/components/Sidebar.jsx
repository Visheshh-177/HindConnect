import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Ticket, 
  BookOpen, 
  FolderOpen
} from 'lucide-react';

export default function Sidebar({ currentSubpage, onSubpageChange }) {
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role;

  const menuItems = {
    Employee: [
      { id: 'dashboard_home', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'raise_ticket', label: 'Raise Ticket', icon: PlusCircle },
      { id: 'my_tickets', label: 'My Tickets', icon: Ticket },
      { id: 'kb', label: 'Knowledge Base', icon: BookOpen },
    ],
    'IT Staff': [
      { id: 'staff_home', label: 'Assigned Tickets', icon: Ticket },
      { id: 'kb', label: 'Knowledge Base', icon: BookOpen },
    ],
    Admin: [
      { id: 'admin_home', label: 'Analytics Panel', icon: LayoutDashboard },
      { id: 'admin_tickets', label: 'All Tickets', icon: FolderOpen },
      { id: 'kb', label: 'Knowledge Base', icon: BookOpen },
    ]
  };

  const activeRoleItems = menuItems[role] || [];

  return (
    <aside className="w-64 bg-white text-slate-700 min-h-screen flex flex-col justify-between border-r border-corporate-grayBorder">
      <div>
        {/* User Card */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-corporate-orange/10 text-corporate-orange flex items-center justify-center font-bold text-lg shadow-sm border border-corporate-orange/20 transform hover:scale-105 transition-transform">
              {user.name.charAt(0)}
            </div>
            <div className="truncate">
              <h4 className="font-bold text-slate-800 text-sm truncate">{user.name}</h4>
              <p className="text-[10px] text-corporate-orange font-bold uppercase tracking-wider">{user.role}</p>
            </div>
          </div>
          <div className="mt-3 bg-slate-100/80 rounded-xl p-2 text-center text-[10px] font-bold text-slate-600 border border-slate-200/55">
            {user.department} Department
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1.5">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 mb-3">Navigation</p>
          {activeRoleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSubpage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSubpageChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 transform active:scale-95 border-l-4 ${
                  isActive 
                    ? 'bg-corporate-orange/10 text-corporate-orange shadow-sm border border-corporate-orange/20 border-l-corporate-orange' 
                    : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900 border-l-transparent'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-corporate-orange' : 'text-slate-455'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

    </aside>
  );
}
