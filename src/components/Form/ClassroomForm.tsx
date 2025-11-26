import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createClassRoom, updateClassRoom } from '@/services/classService';
import { listTeachers } from '@/services/userService';
import { getCourse } from '@/services/courseService';
import type { ClassRoomPayloadType, ClassRoomType } from '@/types/class';
import { X } from 'lucide-react';

interface ClassroomFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: ClassRoomType | null;
  courseId: number;
  form: ClassRoomPayloadType;
  setForm: React.Dispatch<React.SetStateAction<ClassRoomPayloadType>>;
  onSuccess: () => void;
  formatTimeToHi: (time: string) => string;
}

export function ClassroomForm({ open, onOpenChange, editingItem, courseId, form, setForm, onSuccess, formatTimeToHi }: ClassroomFormProps) {
  const queryClient = useQueryClient();

  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: listTeachers,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const { data: courseData } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId && open,
    refetchOnWindowFocus: false,
  });

  const nextIndex = ((courseData?.class_rooms?.length as number | undefined) ?? 0) + 1;

  const createMutation = useMutation({
    mutationFn: (payload: ClassRoomPayloadType) => createClassRoom(payload),
    onSuccess: async () => {
      toast.success('Class created successfully');
      await queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      onSuccess();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to create class!'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ClassRoomPayloadType }) => updateClassRoom(id, payload),
    onSuccess: async () => {
      toast.success('Class updated successfully');
      await queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      onSuccess();
    },
    onError: (e: any) => toast.error(e?.message || 'Failed to update class!'),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const defaultClassName = `Class ${nextIndex}`;
    const formattedPayload = { ...form, class_name: defaultClassName, start_time: formatTimeToHi(form.start_time), end_time: formatTimeToHi(form.end_time) };

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, payload: formattedPayload });
    } else {
      await createMutation.mutateAsync(formattedPayload);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-xl max-w-3xl">
        <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
          <DialogTitle className="text-lg font-semibold mb-7">{editingItem ? 'Edit Class Room' : 'Create Class Room'}</DialogTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`space-y-2 `}>
              <Label htmlFor="teacher_id">
                Teacher <span className="text-destructive">*</span>
              </Label>
              <Select value={String(form.teacher_id ?? '')} onValueChange={(v) => setForm({ ...form, teacher_id: v })}>
                <SelectTrigger id="teacher_id">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers?.map((t: any) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.first_name} {t.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {editingItem && (
              <div className="space-y-2 ">
                <Label htmlFor="is_active">Active</Label>
                <Select value={form.is_active ? 'true' : 'false'} onValueChange={(v) => setForm({ ...form, is_active: v === 'true' })}>
                  <SelectTrigger id="is_active">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className={`space-y-2  ${editingItem ? 'col-span-2' : 'col-span-1'} `}>
              <Label htmlFor="zoom_link">Zoom Link</Label>
              <Input id="zoom_link" type="url" value={form.zoom_link || ''} onChange={(e) => setForm({ ...form, zoom_link: e.target.value })} placeholder="https://zoom.us/..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start">
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Input id="start" type="date" autoComplete="off" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">
                End Date <span className="text-destructive">*</span>
              </Label>
              <Input id="end" type="date" autoComplete="off" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_time">
                Start Time <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input id="start_time" type="time" autoComplete="off" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="pr-10" />
                {form.start_time && (
                  <Button type="button" variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted" onClick={() => setForm({ ...form, start_time: '' })}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">
                End Time <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input id="end_time" type="time" autoComplete="off" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="pr-10" />
                {form.end_time && (
                  <Button type="button" variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted" onClick={() => setForm({ ...form, end_time: '' })}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button className="rounded-md" type="submit" disabled={isLoading}>
              {isLoading ? <Spinner className="mr-2" /> : editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
