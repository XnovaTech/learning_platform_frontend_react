import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Eye, EyeOff, Upload, X } from 'lucide-react';
import type { PayloadUser, UserType } from '@/types/user';
import { updateProfile } from '@/services/userService';

interface ProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: UserType | null;
  form: PayloadUser;
  setForm: React.Dispatch<React.SetStateAction<PayloadUser>>;
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

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, cover: file }));
    }
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, cover: null }));
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
      <DialogContent className="  w-full lg:min-w-xl max-h-[90vh] max-w-3xl overflow-y-scroll p-4">
        <form onSubmit={onSubmit} className="space-y-4  px-4 py-1">
          <DialogTitle className="text-xl  font-semibold text-gray-800">Edit Profile</DialogTitle>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input id="first_name" name="first_name" value={form.first_name || ''} onChange={handleChange} disabled={isLoading} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input id="last_name" name="last_name" value={form.last_name || ''} onChange={handleChange} disabled={isLoading} />
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

            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input placeholder="eg.yangon" id="address" name="address" value={form.address || ''} onChange={handleChange} disabled={isLoading} />
            </div>

            <div className="space-y-2 lg:col-span-2">
              <div className="relative w-full">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Set New Password"
                  name="password"
                  value={form.password || ''}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pr-12"
                />
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
            <div className="space-y-3 lg:col-span-2">
              <Label htmlFor="cover">Profile Cover</Label>
              {form?.cover ? (
                <div className=" relative group">
                  <div className="w-full overflow-hidden rounded-lg botder-2 border-primary/20 bg-muted/20">
                    <img src={form.cover instanceof File ? URL.createObjectURL(form.cover) : form.cover} alt="Cover" className="w-full h-44 object-cover" />
                  </div>
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" onClick={removeImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="cover"
                  className="w-full h-32 flex items-center justify-center rounded-lg border-2 border-primary/30 bg-primary/10 text-primary cursor-pointer hover:border-primary/60 transition-colors"
                >
                  <span className="text-6xl font-bold">{(form.first_name?.[0] ?? 'S').toUpperCase()}</span>
                </label>
              )}
              <Input id="cover" name="cover" type="file" accept="image/*" onChange={handleImgChange} className="hidden" />{' '}
              {!form.cover && (
                <Button type="button" className="w-full" onClick={() => document.getElementById('cover')?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Cover
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
