'';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '../loading';

const PUBLIC_PATHS = ['/auth/login', '/auth/register'];
//const PUBLIC_PATHS = ['/auth/login'];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

      if (!storedUser && !isPublicPath) {
        router.replace('/auth/login');
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const role = parsedUser.roles?.[0];
          const homePath = role === 'student' ? '/student' : '/teacher/dashboard';

          if (isPublicPath) {
            if (pathname !== homePath) {
              router.replace(homePath);
              return;
            }
          }

          if (role === 'student' && (pathname.startsWith('/teacher') || pathname === '/')) {
            router.replace('/student');
            return;
          }

          if ((role === 'teacher' || role === 'admin') && (pathname.startsWith('/student') || pathname === '/')) {
            router.replace('/teacher/dashboard');
            return;
          }
        } catch (err) {
          console.error(err);
          localStorage.removeItem('user');
          router.replace('/auth/login');
          setIsAuthChecked(true);
          return;
        }
      }

      setIsAuthChecked(true);
    };

    checkAuth();
  }, [pathname, router]);

  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}
