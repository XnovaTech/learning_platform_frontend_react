import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, GraduationCap, Menu, Tag, User, LogOut, ChevronDown, UserCircle, ClipboardList, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';

const navigationItems = [
  { title: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
  { title: 'Categories', href: '/teacher/categories', icon: Tag },
  { title: 'Courses', href: '/teacher/courses', icon: BookOpen },
  { title: 'Enrollments', href: '/teacher/enrollments', icon: ClipboardList },
  {
    title: 'Users',
    href: '/teacher/users/teachers',
    icon: Users,
    children: [
      { title: 'Teachers', href: '/teacher/users/teachers' },
      { title: 'Students', href: '/teacher/users/students' },
    ],
  },
  { title: 'Contacts', href: '/teacher/contacts', icon: MessageCircle },

];

const getNavButtonClasses = (active: boolean, collapsed: boolean) =>
  ['group py-5.5 px-3 w-full transition-all duration-300', active && 'bg-blue-50 text-blue-600 shadow-sm border-blue-50', collapsed && 'justify-center'].filter(Boolean).join(' ');

const getIconClasses = (active: boolean) =>
  ['size-4.5 flex-shrink-0 transition-all duration-300 ease-in-out group-hover:text-blue-700', active ? 'text-blue-700' : 'text-gray-600'].filter(Boolean).join(' ');

function SidebarHeader({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="border-b  border-gray-100 px-4 py-5 bg-linear-to-br from-white to-gray-50">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary/40 to-primary/95 shadow-sm shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:scale-105">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="transition-all duration-500 font-semibold  tracking-tight text-gray-900">Crystal Learning</span>
          </div>
        )}
      </div>
    </div>
  );
}
function NavList({ collapsed }: { collapsed: boolean }) {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (title: string, open: boolean) => {
    setOpenDropdown(open ? title : null);
  };

  return (
    <>
      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto px-3 py-4 bg-white">
        {!collapsed && (
          <div className="mb-3 px-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</p>
          </div>
        )}

        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.includes(item.href);
            const hasChildren = Array.isArray(item.children);
            const isDropdownOpen = openDropdown === item.title;
            const isChildActive = item.children?.some((child) => pathname.includes(child.href)) ?? false;

            if (!hasChildren) {
              return (
                <Button key={item.href} variant="navigation" asChild className={getNavButtonClasses(active, collapsed)}>
                  <Link to={item.href}>
                    <Icon className={getIconClasses(active)} />
                    {!collapsed && <span className="ml-3 flex-1 text-left font-medium">{item.title}</span>}
                  </Link>
                </Button>
              );
            }

            return (
              <DropdownMenu key={item.title} open={isDropdownOpen} onOpenChange={(open) => handleDropdownToggle(item.title, open)}>
                <DropdownMenuTrigger asChild>
                  <Button variant="navigation" className={getNavButtonClasses(active || isChildActive, collapsed)}>
                    <Icon className={getIconClasses(active || isChildActive)} />
                    {!collapsed && (
                      <>
                        <span className="ml-3 flex-1 text-left font-medium">{item.title}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align={collapsed ? 'end' : 'start'}
                  sideOffset={5}
                  className={`${collapsed ? 'w-30' : 'w-58'} bg-white/95 backdrop-blur-xl border border-gray-200 shadow-lg rounded-xl p-2`}
                >
                  {item.children?.map((child) => {
                    const childActive = pathname.includes(child.href);
                    return (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link
                          to={child.href}
                          className={`cursor-pointer rounded-lg hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-200 ${childActive ? 'bg-blue-50 text-blue-700 font-semibold' : ''}`}
                        >
                          <User className={getIconClasses(childActive)} />
                          <DropdownMenuLabel>{child.title}</DropdownMenuLabel>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>
      </div>

      {/* Logout  */}
      <div className="border-t border-gray-100 p-4 bg-linear-to-br from-white to-gray-50">
        <Button onClick={logout} variant="red" className="flex rounded-xl shadow-md transition-all items-center justify-center  w-full text-white  ">
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2 font-semibold">Logout</span>}
        </Button>
      </div>
    </>
  );
}

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  return (
    <>
      <SidebarHeader collapsed={collapsed} />
      <NavList collapsed={collapsed} />
    </>
  );
}

function HeaderBar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const { pathname } = useLocation();
  const current = navigationItems.find((item) => pathname === item.href || pathname.startsWith(item.href + '/'))?.title ||
    navigationItems.find((item) => item.children?.some((child) => pathname === child.href || pathname.startsWith(child.href + '/')))?.title ||
    'Dashboard';
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0  z-10  ">
      <div className="mx-4 my-3 md:mx-6 md:my-4">
        <div className="relative flex h-18 items-center gap-3 px-4 md:px-6 bg-white backdrop-blur-xl rounded-3xl  shadow-sm border border-white/30 transition-all duration-500 before:absolute before:inset-0 before:rounded-2xl before:bg-linear-to-br before:from-white/60 before:to-transparent before:pointer-events-none">
          {/* Toggle */}
          <Button onClick={() => setCollapsed(!collapsed)} variant="ghost" size="icon" className="hidden md:flex relative z-10   transition-all duration-300   ">
            <Menu className="h-5 w-5 text-gray-700" />
          </Button>

          {/* Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden relative z-10 hover:bg-white/60 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg border border-transparent hover:border-white/40"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-gray-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 rounded-r-2xl backdrop-blur-xl bg-white/95">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="h-full flex flex-col">
                <SidebarContent collapsed={false} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-3 relative z-10">
            <div className="h-8 w-px bg-linear-to-b from-transparent via-gray-400/50 to-transparent" />
            <h1 className="text-lg md:text-xl font-medium bg-linear-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent drop-shadow-sm">{current}</h1>
          </div>

          <div className="ml-auto flex items-center gap-3 relative z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 px-3 py-2 rounded-xl backdrop-blur-md  transition-all duration-300 cursor-pointer group">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary/40 to-primary/95 shadow-sm shadow-primary/20 group-hover:shadow-md transition-all duration-300">
                    <User className="h-5 w-5 text-white drop-shadow-md" />
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-900 drop-shadow-sm">{user?.first_name}</span>
                    <span className="text-xs text-gray-500 font-medium">{user?.roles[0]}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600 group-hover:text-gray-900 transition-transform duration-300 group-hover:rotate-180" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 bg-white/95 backdrop-blur-xl border border-gray-200 shadow-lg rounded-xl p-2">
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg hover:bg-primary focus:bg-primary/20 transition-colors duration-200">
                  <Link to='/teacher/profile' className='flex items-center'>
                    <UserCircle className="mr-2 h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={logout} className="cursor-pointer rounded-lg hover:bg-primary focus:bg-primary/20 transition-colors duration-200">
                  <LogOut className="mr-2 h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function TeacherLayout() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-primary/10 flex">
      <aside className={`hidden md:flex  flex-col bg-primary/10  border-r border-gray-200 shadow-xl shadow-gray-200/50 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        <SidebarContent collapsed={collapsed} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <HeaderBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
