import { School, Users, BookOpen, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function QuickActionsCard() {
  return (
    <Card className='bg-white rounded-2xl shadow-xl border-none'>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button asChild className="h-auto p-4  flex flex-col items-center gap-2">
            <Link to="/teacher/classes">
              <School className="h-6 w-6" />
              <span>View Classes</span>
            </Link>
          </Button>
          <Button asChild className="h-auto p-4 bg-blue-500 hover:bg-blue-600 flex flex-col items-center gap-2">
            <Link to="/teacher/courses/create">
              <BookOpen className="h-6 w-6" />
              <span>Create Course</span>
            </Link>
          </Button>
          <Button asChild className="h-auto p-4 bg-purple-500 hover:bg-purple-600  flex flex-col items-center gap-2">
            <Link to="/teacher/users/students">
              <Users className="h-6 w-6" />
              <span>View Students</span>
            </Link>
          </Button>
          <Button asChild className="h-auto p-4 bg-amber-500 hover:bg-amber-600 flex flex-col items-center gap-2">
            <Link to="/teacher/contacts">
              <MessageCircle className="h-6 w-6" />
              <span>View Messages</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
