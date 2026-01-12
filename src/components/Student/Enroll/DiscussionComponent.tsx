import { createDiscussion, getDiscussionsByClass } from '@/services/discussionService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, MessageCircle, Send } from 'lucide-react';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export interface DiscussionComponentProps {
  classId?: number;
  userId?: number | string | undefined;
}

export function DiscussionComponent({ classId, userId }: DiscussionComponentProps) {
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data: discussions = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['discussions', classId],
    queryFn: () => getDiscussionsByClass(classId as number),
    enabled: !!classId,
  });

  const createMutation = useMutation({
    mutationFn: createDiscussion,
    onSuccess: async () => {
      toast.success('message sent');
      await queryClient.invalidateQueries({ queryKey: ['discussions', classId] });
      setMessage('');
      refetch();
    },
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to send message!');
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId || !userId) {
      toast.error('Class ID or Student ID is missing!');
      return;
    }
    await createMutation.mutateAsync({
      class_id: classId,
      user_id: Number(userId),
      message: message,
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [discussions]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-80 text-gray-600">
        <Loader2 className="w-6 h-6 text-primary animate-spin mr-2" />
        <span className="ml-2 text-gray-600">Loading Messages ...</span>
      </div>
    );

  if (isError) return <div className="text-center text-red-500 font-medium py-10">Failed to load message. Please try again later.</div>;

  return (
    <div className="flex flex-col bg-white/50 backdrop-blur-xl rounded-2xl p-4 shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <MessageCircle size={22} />
        Discuss Room
      </h2>

      <div ref={scrollRef} className="flex flex-col gap-3 max-h-96 overflow-y-auto px-2 py-3 bg-gray-50 rounded-xl">
        {discussions.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-full bg-primary/90 p-4 mb-4">
              <MessageCircle className="size-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-1">No Message Found</h4>
          </div>
        ) : (
          discussions.map((discussion) => {
            const isMine = discussion.user.id == userId;
            return (
              <div
                key={discussion.id}
                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}
                                animate-in`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl shadow-sm
                                        ${isMine ? ' bg-sunset text-white rounded-br-none' : 'bg-sunset/90 text-white border border-gray-200 rounded-bl-none'}`}
                >
                  <p className=" text-sm leading-relaxed">{discussion.message}</p>
                  <span className="text-xs text-gray-50 mt-1">
                    {discussion.user.first_name} {discussion.user.last_name} • {moment(discussion.created_at).fromNow()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={onSubmit} className="mt-4 flex items-center gap-3 border-t pt-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className=" flex-1 resize-none p-3 text-sm rounded-lg border border-gray-300 bg-white focus:outline-sunset focus:border-transparent"
          placeholder="Type a message..."
          rows={1}
          required
        ></textarea>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className=" flex items-center justify-center bg-sunset text-white px-4 py-2 rounded-xl hover:bg-sunset/90 transition disabled:opacity-50"
        >
          {createMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className=" w-5 h-5" />}
        </button>
      </form>
    </div>
  );
}
