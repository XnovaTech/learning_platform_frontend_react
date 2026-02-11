import { BookOpen, School,Tag, Home, MessageCircle, UserRound, BookOpenCheck, BookText } from 'lucide-react';

export const studentNavigation = {
  sidebar: [
    { title: 'Home', href: '/student/home', icon: Home },
    { title: 'Profile', href: '/student/profile', icon: UserRound },
    { title: 'Contacts', href: '/student/contacts', icon: MessageCircle },
  ],

  header: [
    { title: 'My Courses', href: '/student/enrolls', icon: BookText },
    { title: 'New Courses', href: '/student/courses', icon: BookOpen },
    { title: 'Exams', href: '/student/exams', icon: BookOpenCheck },
  ],

  mobile: [
    { title: 'Home', href: '/student/home', icon: Home },
    { title: 'My Courses', href: '/student/enrolls', icon: School },
    { title: 'New Courses', href: '/student/courses', icon: BookOpen },
    { title: 'Exams', href: '/student/exams', icon: Tag },
    { title: 'Profile', href: '/student/profile', icon: UserRound },
    { title: 'Contacts', href: '/student/contacts', icon: MessageCircle },
  ],
};
