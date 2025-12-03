'';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, SearchIcon, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/dialog-context-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { deleteUser, listUsers } from '@/services/userService';
import { UserForm } from '@/components/Form/UserForm';
import type { PayloadUser, UserType } from '@/types/user';

export default function StudentsPage() {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserType | null>(null);
  const [page, setPage] = useState(1);

  const defaultForm: PayloadUser = {
    first_name: '',
    last_name: '',
    email: null,
    phone: null,
    address: null,
    password: '',
    role: 'student',
  };

  const [form, setForm] = useState<PayloadUser>(defaultForm);

  const openCreate = () => {
    setEditingItem(null);
    setForm(defaultForm);
    setFormOpen(true);
  };

  const openEdit = (s: any) => {
    setEditingItem(s);
    setForm({
      id: s.id,
      first_name: s.first_name,
      last_name: s.last_name,
      email: s.email,
      phone: s.phone,
      password: s.password,
      address: s.address,
    });
    setFormOpen(true);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['users', { search: searchTerm, page, role: 'student' }],
    queryFn: async () => {
      const params: any = { search: searchTerm || undefined, page, role: 'student' };
      return await listUsers(params as any);
    },
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });

  const currentPage = data?.current_page ?? page;
  const lastPage = data?.last_page ?? 1;
  const canPrev = currentPage > 1;
  const canNext = currentPage < lastPage;

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: async () => {
      toast.success('student deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      setConfirmOpen(false);
      setDeletingId(null);
    },
    onError: (e) => {
      toast.error(e?.message || 'Failed to delete student !');
    },
  });

  const askDelete = (id: number) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setEditingItem(null);
  };

  const confirmDelete = async () => {
    if (deletingId == null) return;
    deleteMutation.mutate(deletingId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Student List</h2>
          <p className="text-muted-foreground text-sm">Manage and organize your student list.</p>
        </div>
        <Button type="button" className="gap-2" onClick={openCreate}>
          <Plus className="size-4" /> Create student
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
            <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search users..." className="mr-2 w-full" />
            <Button type="submit">
              <SearchIcon size="4" />
            </Button>
          </form>

          {(data?.total ?? 0) > 0 && (
            <Button className="rounded-full hidden md:flex">
              Students :<span>{data?.total}</span>
            </Button>
          )}
        </div>

        <div className="overflow-x-auto rounded-md  min-h-[240px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-14">
              <Spinner className="text-primary size-7 md:size-8" />
            </div>
          ) : (
            <table className="min-w-full text-sm ">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 hidden md:flex py-3 font-medium">Address</th>
                  <th className="px-4 py-3 font-medium text-right  ">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!data || data.users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-14 px-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="rounded-full bg-primary/90 p-4 mb-4">
                          <Users className="size-8 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-foreground mb-1">No Students Found</h4>
                        <p className="text-sm text-muted-foreground mb-4">Create your first student</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.users?.map((user: any) => (
                    <tr key={user.id} className="border-t group hover:bg-muted transition-colors">
                      <td className="px-4 py-3 font-medium">
                        {user.first_name} {user.last_name}{' '}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.phone || '-'}</td>
                      <td className="px-4 py-3 hidden md:flex text-muted-foreground max-w-[30ch] truncate ">{user.address || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="primary" className="gap-2 py-4 " onClick={() => openEdit(user)}>
                            <Edit className=" size-4 transition-all duration-300 ease-in-out " />
                            <span className="hidden text-xs lg:flex">Edit</span>
                          </Button>

                          <Button size="sm"  variant="destructive" className="gap-2 py-4 " onClick={() => askDelete(user?.id)}>
                            <Trash2 className=" size-4 transition-all duration-300 ease-in-out " />
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
          title="Delete student?"
          description="This action cannot be undone. The student will be permanently removed."
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

        {/* user-form */}
        <UserForm open={formOpen} onOpenChange={setFormOpen} editingItem={editingItem} form={form} setForm={setForm} onSuccess={handleFormSuccess} isStudent={true} />

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
