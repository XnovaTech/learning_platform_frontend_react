'';

import { AuthProvider } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const PUBLIC_PATHS = ['/auth/login', '/auth/register'];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
    if (!storedUser && !isPublicPath) {
      router.push('/auth/login');
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const role = parsedUser?.data?.user?.roles?.[0];

        if (role === 'student') {
          if (pathname.startsWith('/dashboard')) {
            router.push('/student');
          }
        } else if (role === 'teacher' || role === 'admin') {
          if (pathname.startsWith('/student')) {
            router.push('/dashboard');
          }
        }

        if (isPublicPath) {
          router.push(role === 'student' ? '/student' : 'dashboard');
        }
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
        router.push('/auth/login');
      }
    }

    setIsAuthChecked(true);
  }, [pathname, router]);

  if (!isAuthChecked) {
    return <div className='min-h-screen flex items-center justify-center'>Loading ...</div>
  }

  return <AuthProvider>{children}</AuthProvider>;
}
