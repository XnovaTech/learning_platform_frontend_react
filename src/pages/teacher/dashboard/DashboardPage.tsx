
import { BookOpen, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { overviews } from '@/mocks/dashboard';

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-8xl p-6">
      <div className="space-y-6">
        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {overviews.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item?.id} className={`cursor-pointer opacity-90 shadow-sm px-3 py-4 hover:-translate-y-1  text-white bg-gradient-to-r ${item.color} `}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                  <Icon className="h-7 w-7 " />
                  <p className=" font-semibold text-2xl">{item.value}</p>
                </CardHeader>
                <CardContent  >
                  <CardTitle className="text-xl font-medium">{item.title}</CardTitle>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New course material uploaded</p>
                  <p className="text-xs text-gray-500">Mathematics 101 - 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">15 students joined your class</p>
                  <p className="text-xs text-gray-500">Physics 201 - 5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
