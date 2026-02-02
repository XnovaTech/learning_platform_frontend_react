import { useState } from 'react';
import { Link, Outlet, useLocation, useMatch } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {LogOut, Menu, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { StudentDataProvider } from '@/context/StudentDataContext';
import { studentNavigation } from '@/mocks/student-nav';

function MobileSidebarContent() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-2 mt-10">
          {studentNavigation.mobile.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <div key={item.href} className="relative group">
                <Button
                  variant="ghost"
                  asChild
                  className={`hover:bg-primary/60 ease-in-out   rounded-xl  flex  items-center justify-start px-10 overflow-hidden transition-all duration-600 w-64 bg-primary/5 text-primary  py-5.5
      
                      ${active ? 'bg-primary/60 text-white  shadow-md px-3 py-5.5' : ''}`}
                >
                  <Link to={item.href} className="flex items-center justify-between w-full">
                    <Icon className={`h-5 w-5 shrink-0 duration-500 group-hover:text-white transition-colors ${active ? 'text-white' : 'text-gray-600'}`} />

                    <span
                      className={`ml-3 pr-5 font-medium duration-500 transition-colors group-hover:text-white ${
                        active ? 'text-white' : 'text-gray-600'
                      } whitespace-nowrap  transition-opacity duration-600`}
                    >
                      {item.title}
                    </span>
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 p-4  border-t border-gray-100  bg-linear-to-br from-white to-gray-50">
        <Button onClick={logout} variant="red" className="flex rounded-xl shadow-md transition-all items-center justify-center  w-full text-white">
          <LogOut className="h-4 w-4" />
          <span className="ml-3 font-medium">Logout</span>
        </Button>
      </div>
    </>
  );
}

function SidebarContent({ hovered }: { hovered: boolean }) {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto px-2 py-4">
      <div className="space-y-1">
        {studentNavigation.sidebar.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <div key={item.href} className="relative">
              <Button
                variant="ghost"
                asChild
                className={` flex items-center justify-start overflow-hidden 
                  transition-all duration-500
                    ${hovered ? 'w-64 px-3 py-5.5' : ' justify-center py-5.5 bg-transparent'}
                      ${active && !hovered ? 'bg-primary/60 text-white  rounded-2xl shadow-md px-3 py-5.5' : ''}`}
              >
                <Link to={item.href} className="flex items-center w-full">
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-colors 
                      ${hovered ? 'text-ocean/60' : 'text-gray-600'}
                       ${active && !hovered ? 'text-white' : 'text-gray-600'}`}
                  />
                  {hovered && <span className="ml-3 font-medium whitespace-nowrap transition-opacity duration-600">{item.title}</span>}
                </Link>
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 px-2">
        <Button
          onClick={logout}
          variant="ghost"
          className="flex items-center justify-between px-10 overflow-hidden rounded-2xl  hover:bg-red-800/90 hover:text-white text-red-800 bg-white  py-5.5 w-full"
        >
          <LogOut className="h-5 w-5font-bold mx-auto" />
        </Button>
      </div>
    </div>
  );
}

function HeaderBar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-2 bg-white/50 rounded-3xl backdrop-blur-lg drop-shadow-2xl z-30 mx-5  flex h-16.5 items-center gap-2 px-6 justify-between">
      {/*Mobile*/}
      <div className="flex items-center gap-3 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100 rounded-lg" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <div className="h-full flex flex-col">
              <MobileSidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* logo */}
      <Link to="/student" className="flex items-center gap-3 fex-shrink-0">
        <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary/70 to-primary shadow-md">
          <img src="/logo.png" className="object-cover rounded-2xl" />
        </div>
        <img src="/logotext.png" className="object-center max-w-56 drop-shadow-2xl" />
      </Link>

      {/* navigation */}

      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
        {studentNavigation.header.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              to={item.href}
              key={item.href}
              className={`flex items-center uppercase hover:text-primary transition-colors text-xs tracking-wide
                      ${active ? ' font-medium p-3 bg-primary text-white rounded-2xl drop-shadow-2xl' : 'border-b-0'}`}
            >
              <Icon
                className={`h-4 w-4 transition-colors mr-2
                        
                       ${active ? 'text-white' : 'text-gray-700'}`}
              />
              <span className={`  ${active ? 'text-white' : 'text-slate-700'} `}>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* search */}
      <div className=" flex items-center justify-center shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/70 drop-shadow-2xl hover:bg-primary">
          <Link to="/student/profile">
          <UserRound className="h-5 w-5 text-white" />
          </Link>
          
        </div>
      </div>
    </header>
  );
}

export default function StudentLayout() {
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const isExamDetailPage = useMatch('/student/enrolls/:enrollId/exams/:examId');

  return (
    <StudentDataProvider>
      <div className="min-h-screen bg-primary/7 flex">
        <div className="flex-1 flex flex-col min-w-0">
          <HeaderBar />

          <div className="flex relative">
            {!isExamDetailPage && (
            <aside
              onMouseEnter={() => setSidebarHovered(true)}
              onMouseLeave={() => setSidebarHovered(false)}
              className={`hidden md:flex flex-col items-center justify-center fixed top-1/2 left-3 -translate-y-1/2 
              bg-white/50 backdrop-blur-lg drop-shadow-2xl ml-3 rounded-3xl 
              transition-all duration-500 ease-in-out z-50
              ${sidebarHovered ? ' w-36' : ' w-20'}`}
            >
              <SidebarContent hovered={sidebarHovered} />
            </aside> )}

            <main 
              className={`flex-1 overflow-y-auto p-6 md:p-8 transition-all duration-300
                 ${ !isExamDetailPage 
                      ? sidebarHovered ? 'md:ml-[180px]' : 'md:ml-[100px]'
                      : 'ml-0'}`}>
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </StudentDataProvider>
  );
}
