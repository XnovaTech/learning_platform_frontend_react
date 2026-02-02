import { LayoutDashboard, Tag, BookOpen, School, ClipboardList, Users, MessageCircle } from 'lucide-react';
export const teacherNavigation = {
    nav: [
            { title: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
            { title: 'Categories', href: '/teacher/categories', icon: Tag },
            { title: 'Courses', href: '/teacher/courses', icon: BookOpen },
            { title: 'Active Classes', href: '/teacher/classes', icon: School },
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
    ]
}