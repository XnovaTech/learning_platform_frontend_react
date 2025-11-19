import { Suspense, lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "@/components/Loading";
import AuthLayout from "@/layout/authLayout";

const Home = lazy(() => import("@/pages/Home"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ContactPage = lazy(() => import("@/pages/Student/ContactPage"));
const StudentLayout = lazy(() => import("@/layout/studentLayout"));

const Login = lazy(() => import("@/pages/Auth/Login"));
const Register = lazy(() => import("@/pages/Auth/Register"));

const RootLayout = () => (
    <Suspense fallback={<Loading />} >
        <Outlet />
    </Suspense>
);



export const routes: RouteObject[] = [
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },

    // auth routes
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> }
        ]
    },
    // student routes
    {
        path: "/student",
        element: <RootLayout />,
        children: [
            {
                element: <StudentLayout />,
                children: [
                    {
                        index: true,
                        element: <Navigate replace to="contacts" />,
                    },
                    {
                        path: "contacts",
                        element: <ContactPage />
                    },
                    {
                        path: "*",
                        element: <NotFound />,
                    },
                ],
            },
        ]
    }
];
