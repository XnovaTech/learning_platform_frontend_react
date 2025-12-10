import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Trash2, SearchIcon, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/dialog-context-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { deleteEnroll, listsEnrolls, updateEnroll } from '@/services/enrollService';

export default function EnrollmentsPage() {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<'current' | 'old' | 'new'>('current');
  const [page, setPage] = useState(1);

  const filters = (() => {
    if (tab === 'current') return { is_active: 1, is_finish: 0 };
    if (tab === 'old') return { is_active: 0, is_finish: 1 };
    return { is_active: 0, is_finish: 0 };
  })();

  const { data, isLoading } = useQuery({
    queryKey: ['enrollments', { search: searchTerm, page, ...filters }],
    queryFn: async () => {
      const params: any = {
        search: searchTerm || undefined,
        page,
        is_active: filters.is_active,
        is_finish: filters.is_finish,
      };
      return await listsEnrolls(params as any);
    },
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });

  const currentPage = data?.current_page ?? page;
  const lastPage = data?.last_page ?? 1;
  const canPrev = currentPage > 1;
  const canNext = currentPage < lastPage;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteEnroll(id),
    onSuccess: async () => {
      toast.success('Deleted enrollment record successfully');
      await queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      setConfirmOpen(false);
      setDeletingId(null);
    },
    onError: (e) => {
      toast.error(e?.message || 'Failed to delete enrollments !');
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => updateEnroll(id, { status: 1, student_id: studentId }),
    onSuccess: async () => {
      toast.success('Enrollment approved successfully');
      await queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      setApproveConfirmOpen(false);
      setApprovingId(null);
    },
    onError: (e) => {
      toast.error(e?.message || 'Failed to approve enrollment !');
    },
  });

  const askDelete = (id: number) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const askApprove = (id: number, student_id: number) => {
    setApprovingId(id);
    setStudentId(student_id);
    setApproveConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (deletingId == null) return;
    deleteMutation.mutate(deletingId);
  };

  const confirmApprove = async () => {
    if (approvingId == null || studentId == null) return;
    approveMutation.mutate(approvingId);
  };

  const formatTimeToHi = (time: string): string => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    if (!hours || !minutes) return '';
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes.padStart(2, '0')}${ampm}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Enrollment List</h2>
          <p className="text-muted-foreground text-sm">Manage and organize your enrollment list.</p>
        </div>

        {(data?.total ?? 0) > 0 && (
          <Button className="rounded-full hidden md:flex">
            Enrollments :<span>{data?.total}</span>
          </Button>
        )}
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <form
              className=" w-full flex items-center max-w-lg md:max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
                setSearchTerm(searchInput.trim());
              }}
            >
              <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search enrollments..." className="mr-2 w-full" />

              <Button type="submit">
                <SearchIcon size="4" />
              </Button>
            </form>

            <Tabs
              value={tab}
              onValueChange={(value) => {
                setPage(1);
                setTab(value as 'current' | 'old' | 'new');
              }}
              className="w-full sm:w-auto"
            >
              <TabsList className="rounded-2xl bg-white shadow h-10">
                <TabsTrigger
                  value="current"
                  className="rounded-xl transition-all capitalize duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5.5"
                >
                  Current
                </TabsTrigger>
                <TabsTrigger value="old" className="rounded-xl transition-all capitalize duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5.5">
                  Old
                </TabsTrigger>
                <TabsTrigger value="new" className="rounded-xl transition-all capitalize duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5.5">
                  New
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
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
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Course</th>
                  <th className="px-4 py-3 font-medium">Class</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right  ">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!data || data.enrollments?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 px-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="rounded-full bg-primary/90 p-4 mb-4">
                          <ClipboardList className="size-8 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-foreground mb-1">No Enrollments Found</h4>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.enrollments?.map((enrollment: any) => (
                    <tr key={enrollment.id} className="border-t group hover:bg-muted transition-colors">
                      <td className="px-4 py-3 font-medium">
                        {enrollment.student?.first_name} {enrollment.student?.last_name}
                      </td>
                      <td className="px-4 py-3  text-muted-foreground">
                        {enrollment.class_room?.course?.title || '-'} ({enrollment.class_room?.course?.title?.category || '-'}){' '}
                      </td>

                      <td className="px-4 py-3  text-muted-foreground">{enrollment.class_room?.class_name || '-'}</td>
                      <td className="px-4 py-3  text-muted-foreground">
                        {formatTimeToHi(enrollment.class_room?.start_time)} - {formatTimeToHi(enrollment.class_room?.end_time)}
                      </td>

                      <td className="px-4  py-3">
                        <span className={`px-2 py-1  text-xs rounded-full  font-medium ${enrollment.status ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {enrollment.status ? 'Approved' : 'Pending'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {!enrollment.status && (
                            <Button
                              size="sm"
                              variant="primary"
                              className="gap-2 py-4 cursor-pointer"
                              onClick={() => askApprove(enrollment.id, enrollment.student.id)}
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle2 className="size-4 transition-all duration-300 ease-in-out" />
                              <span className="hidden text-xs lg:flex">Approve</span>
                            </Button>
                          )}

                          <Button size="sm" variant="destructive" className="gap-2 py-4 cursor-pointer" onClick={() => askDelete(enrollment?.id)} disabled={deleteMutation.isPending}>
                            <Trash2 className="size-4 transition-all duration-300 ease-in-out" />
                            <span className="hidden text-xs lg:flex">Delete</span>
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

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete enrollment record?"
          description="This action cannot be undone. The enrollment record will be permanently removed."
          confirmText="Delete"
          cancelText="Cancel"
          loading={deleteMutation.isPending}
          destructive
          onCancel={() => {
            setConfirmOpen(false);
            setDeletingId(null);
          }}
          onConfirm={confirmDelete}
        />

        <ConfirmDialog
          open={approveConfirmOpen}
          onOpenChange={setApproveConfirmOpen}
          title="Approve enrollment?"
          description="Are you sure you want to approve this enrollment? The student will be enrolled in the class."
          confirmText="Approve"
          cancelText="Cancel"
          loading={approveMutation.isPending}
          destructive={false}
          onCancel={() => {
            setApproveConfirmOpen(false);
            setApprovingId(null);
          }}
          onConfirm={confirmApprove}
        />

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
