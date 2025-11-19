import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Loading from '@/components/Loading';

const lazyLoad = (Component:any) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

// pages
const Home = lazy(() => import('@/pages/Home'));
const NotFound = lazy(() => import('@/pages/NotFound'));

//auth
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ContactPage = lazy(() => import('@/pages/student/ContactPage'));

//teacher
const DashboardPage = lazy(() => import('@/pages/teacher/dashboard/DashboardPage'));
const CategoriesPage = lazy(() => import('@/pages/teacher/categories/CategoriesPage'));
const ContactsPage = lazy(() => import('@/pages/teacher/contacts/ContactsPage'));
const CoursesPage = lazy(() => import('@/pages/teacher/courses/CoursesPage'));
const CourseDetailPage = lazy(() => import('@/pages/teacher/courses/CourseDetailPage'));
const CreateCoursePage = lazy(() => import('@/pages/teacher/courses/CreateCoursePage'));
const EditCoursePage = lazy(() => import('@/pages/teacher/courses/EditCoursePage'));

const ClassDetailPage = lazy(() => import('@/pages/teacher/courses/classes/ClassDetailPage'));
const EnrollmentsPage = lazy(() => import('@/pages/teacher/enrollments/EnrollmentsPage'));
const StudentsPage = lazy(() => import('@/pages/teacher/users/StudentsPage'));
const TeachersPage = lazy(() => import('@/pages/teacher/users/TeachersPage'));

// layouts
const StudentLayout = lazy(() => import('@/layout/StudentLayout'));
const AuthLayout = lazy(() => import('@/layout/AuthLayout'));
const TeacherLayout = lazy(() => import('@/layout/TeacherLayout'));

const RootLayout = () => (
  <Suspense>
    <Outlet />
  </Suspense>
);

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: lazyLoad(Home) },
      { path: '*', element: lazyLoad(NotFound) },
    ],
  },

  // auth
  {
    element: lazyLoad(AuthLayout),
    children: [
      { path: '/login', element: lazyLoad(Login) },
      { path: '/register', element: lazyLoad(Register) },
    ],
  },

  // student
  {
    path: '/student',
    element: lazyLoad(StudentLayout),
    children: [
      { index: true, element: <Navigate replace to="contacts" /> },
      { path: 'contacts', element: lazyLoad(ContactPage) },
    ],
  },

  // teacher
  {
    path: '/teacher',
    element: lazyLoad(TeacherLayout),
    children: [
      { index: true, element: <Navigate replace to="dashboard" /> },
      { path: 'dashboard', element: lazyLoad(DashboardPage) },
      { path: 'categories', element: lazyLoad(CategoriesPage) },
      { path: 'contacts', element: lazyLoad(ContactsPage) },
      { path: 'courses', element: lazyLoad(CoursesPage) },
      { path: 'courses/create', element: lazyLoad(CreateCoursePage) },
      { path: 'courses/edit', element: lazyLoad(EditCoursePage) },
      { path: 'courses/classes/:id', element: lazyLoad(ClassDetailPage) },
      { path: 'courses/:id', element: lazyLoad(CourseDetailPage) },
      { path: 'enrollments', element: lazyLoad(EnrollmentsPage) },
      { path: 'users/students', element: lazyLoad(StudentsPage) },
      { path: 'users/teachers', element: lazyLoad(TeachersPage) },
    ],
  },
];
