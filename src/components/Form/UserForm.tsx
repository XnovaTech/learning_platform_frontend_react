import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { payloadUser, TeacherType } from '@/types/user';
import { registerUser } from '@/services/authService';
import { updateUser } from '@/services/userService';

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: TeacherType | null;
  form: payloadUser;
  setForm: React.Dispatch<React.SetStateAction<payloadUser>>;
  onSuccess: () => void;
  isStudent: boolean;
}

export function UserForm({ open, onOpenChange, editingItem, form, setForm, onSuccess, isStudent = false }: UserFormProps) {
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value || null,
    }));
  };

  const createMutation = useMutation({
    mutationFn: (payload: payloadUser) => registerUser(payload),
    onSuccess: async () => {
      toast.success('User created successfully');
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      onSuccess();
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || `Failed to create ${isStudent ? 'student' : 'teacher'}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: payloadUser }) => updateUser(id, payload),
    onSuccess: async () => {
      toast.success('User updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      onSuccess();
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || `Failed to update ${isStudent ? 'student' : 'teacher'}`);
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, payload: form });
    } else {
      await createMutation.mutateAsync(form);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-xl max-w-3xl">
        <form onSubmit={onSubmit} className="space-y-4">
          <DialogTitle className="text-lg font-semibold">{editingItem ? `Edit ${isStudent ? 'Student' : 'Teacher'}` : `Create New ${isStudent ? 'Student' : 'Teacher'}`}</DialogTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input id="first_name" name="first_name" value={form.first_name || ''} onChange={handleChange} required disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input id="last_name" name="last_name" value={form.last_name || ''} onChange={handleChange} required disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input placeholder="learninghub@email.com" id="email" name="email" type="email" value={form.email || ''} onChange={handleChange} disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input placeholder="+95" id="phone" name="phone" type="tel" value={form.phone || ''} onChange={handleChange} disabled={isLoading} />
            </div>

            {!editingItem && (
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input placeholder="Enter user password" id="password" name="password" type="password" value={form.password || ''} onChange={handleChange} disabled={isLoading} />
              </div>
            )}

            <div className={`space-y-2 ${editingItem && 'col-span-2'}`}>
              <Label htmlFor="address">Address</Label>
              <Input placeholder="eg.yangon" id="address" name="address" value={form.address || ''} onChange={handleChange} disabled={isLoading} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[100px] rounded-md">
              {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
