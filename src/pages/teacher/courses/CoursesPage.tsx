import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, SearchIcon, BookOpen, School, EyeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { listCourses } from '@/services/courseService';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';

export default function CoursesPage() {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['courses', { search: searchTerm, page }],
    queryFn: async () => {
      const params: any = { search: searchTerm || undefined, page };
      return await listCourses(params as any);
    },
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });

  const currentPage = data?.current_page ?? page;
  const lastPage = data?.last_page ?? 1;
  const canPrev = currentPage > 1;
  const canNext = currentPage < lastPage;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Courses</h2>
          <p className="text-muted-foreground text-sm">Manage and organize your courses.</p>
        </div>
        <Button type="button" asChild className="gap-2">
          <Link to="/teacher/courses/create">
            <Plus className="size-4" /> Create Course
          </Link>
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <form
            className=" w-full flex items-center max-w-lg md:max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setSearchTerm(searchInput.trim());
            }}
          >
            <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search courses..." className="mr-2 w-full" />
            <Button type="submit">
              <SearchIcon size="4" />
            </Button>
          </form>

          {(data?.total ?? 0) > 0 && (
            <Button className="rounded-full hidden md:flex">
              Courses :<span>{data?.total}</span>
            </Button>
          )}
        </div>

        <div className="overflow-x-auto rounded-md  min-h-60">
          {isLoading ? (
            <div className="flex items-center justify-center py-14">
              <Spinner className="text-primary size-7 md:size-8" />
            </div>
          ) : (
            <table className="min-w-full text-sm ">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Title</th>
                  {/* <th className="px-4 py-3 font-medium">Description</th> */}
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Fee</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-center">Classrooms</th>
                  <th className="px-4 py-3 font-medium text-center">Lessons</th>
                  <th className="px-4 py-3 font-medium text-right  ">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!data || data.courses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-14 px-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="rounded-full bg-primary/90 p-4 mb-4">
                          <BookOpen className="size-8 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-foreground mb-1">No Courses Found</h4>
                        <p className="text-sm text-muted-foreground mb-4">Create your first course</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.courses?.map((course) => (
                    <tr key={course.id} className="border-t group hover:bg-muted transition-colors">
                      <td className="px-4 py-3 font-medium ">{course?.title}</td>
                      {/* <td className="px-4 py-3  line-clamp-1 text-muted-foreground max-w-[35ch] lg:max-w-[42ch] truncate  " dangerouslySetInnerHTML={{ __html: course?.description || '' }}></td> */}
                      <td className="px-4 py-3  ">{course?.category?.name ?? '-'}</td>

                      <td className="px-4 py-3  ">{course?.price?.toLocaleString() ?? '-'}</td>
                      <td className="px-4 py-3  ">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${course?.status == 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                        >
                          {course?.status == 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        {course?.class_rooms?.length ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                            <School className="size-4" />
                            {course.class_rooms.length}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {course?.lessons?.length ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            <BookOpen className="size-4" />
                            {course.lessons.length}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" asChild variant="primary" className="gap-2 py-4">
                            <Link to={`/teacher/courses/${course?.id}`}>
                              <span className=" text-xs ">View</span>
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {data && data.last_page > 1 && (
          <Pagination>
            <PaginationContent className="flex items-center space-x-1">
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    if (canPrev) setPage((p) => Math.max(1, p - 1));
                  }}
                  className={`transition-colors ${!canPrev ? 'pointer-events-none opacity-50' : 'hover:bg-accent hover:text-accent-foreground'}`}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    if (canNext) setPage((p) => (data ? Math.min(data.last_page, p + 1) : p + 1));
                  }}
                  className={`transition-colors ${!canNext ? 'pointer-events-none opacity-50' : 'hover:bg-accent hover:text-accent-foreground'}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </Card>
    </div>
  );
}
