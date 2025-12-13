import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import type { UpdatePayloadUser, UserType } from '@/types/user';
import { updateProfile } from '@/services/userService';
import ImageUploader from '../ImageUploader';

interface ProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: UserType | null;
  form: UpdatePayloadUser;
  setForm: React.Dispatch<React.SetStateAction<UpdatePayloadUser>>;
  onSuccess: () => void;
  refetch: () => void;
}

export function ProfileForm({ open, onOpenChange, editingItem, form, setForm, onSuccess, refetch }: ProfileFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value || null,
    }));
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FormData }) => updateProfile(id, payload),
    onSuccess: async () => {
      refetch();
      toast.success('User updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      onSuccess();
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || `Failed to update'}`);
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    const payload = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      if (key === 'cover') {
        if (value instanceof File) {
          payload.append('cover', value);
        }
        return;
      }
      payload.append(key, value as any);
    });

    e.preventDefault();
    await updateMutation.mutateAsync({ id: Number(editingItem?.id), payload });
  };

  const isLoading = updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="  w-full  lg:min-w-xl max-h-[90vh] max-w-3xl overflow-y-scroll p-4">
        <form onSubmit={onSubmit} className="space-y-4  px-4 py-1">
          <DialogTitle className="text-lg font-semibold flex items-center  mb-6 gap-2">
            <div className="h-8 w-1 bg-primary rounded-full" />
            Edit Profile
          </DialogTitle>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label htmlFor="first_name">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input id="first_name" name="first_name" value={form.first_name || ''} onChange={handleChange} disabled={isLoading} />
            </div>

            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label htmlFor="last_name">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input id="last_name" name="last_name" value={form.last_name || ''} onChange={handleChange} disabled={isLoading} />
            </div>

            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input placeholder="learninghub@email.com" id="email" name="email" type="email" value={form.email || ''} onChange={handleChange} disabled={isLoading} />
            </div>

            <div className="col-span-2 md:col-span-1 space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input placeholder="+95" id="phone" name="phone" type="tel" value={form.phone || ''} onChange={handleChange} disabled={isLoading} />
            </div>

            <div className="space-y-2 col-span-2 ">
              <Label htmlFor="address">Address</Label>
              <Input placeholder="eg.yangon" id="address" name="address" value={form.address || ''} onChange={handleChange} disabled={isLoading} />
            </div>

            <div className="space-y-2 col-span-2 ">
              <Label htmlFor="password">Set New Password</Label>
              <div className="relative w-full">
                <Input id="password" type={showPassword ? 'text' : 'password'} name="password" value={form.password || ''} onChange={handleChange} disabled={isLoading} className="w-full pr-12" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute hover:bg-transparent right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>

            <ImageUploader label="Profile Cover" value={form?.cover || null} onChange={(file) => setForm((prev) => ({ ...prev, cover: file }))} />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="min-w-[100px] rounded-md">
              {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
