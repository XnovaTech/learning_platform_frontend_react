'';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, MessageSquare, User, SearchIcon, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import moment from 'moment';
import { getAllContacts, updateContact } from '@/services/contactService';
import type { ContactPayloadType, ContactType } from '@/types/contact';
import { Input } from '@/components/ui/input';

export default function ContactsPage() {
  const queryClient = useQueryClient();
  const [replyMessages, setReplyMessages] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);
  const [replyingToMessageId, setReplyingToMessageId] = useState<number | null>(null);

  const {
    data: groupedContacts = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['contacts', { search: searchQuery }],
    queryFn: () => getAllContacts(searchQuery),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ContactPayloadType }) => updateContact(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setReplyMessages('');
      refetch();
      toast.success('Reply sent successfully');
    },
    onError: (e: any) => {
      toast.error(e?.message || 'Failed to send reply!');
    },
  });

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReply = async () => {
    if (!selectedGroup || !replyingToMessageId) return;
    const contact = selectedGroup.messages.find((msg: ContactType) => msg.id === replyingToMessageId);

    if (!replyMessages || !replyMessages.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    if (contact) {
      await updateMutation.mutateAsync({
        id: contact.id,
        payload: {
          sender_id: contact.sender_id,
          message: contact.message,
          reply: replyMessages,
        },
      });
    }

    setReplyingToMessageId(null);
  };

  useEffect(() => {
    if (groupedContacts.length > 0 && !selectedStudentId) {
      setSelectedStudentId(groupedContacts[0].student.id);
    }
  }, [groupedContacts, selectedStudentId]);

  const selectedGroup = groupedContacts.find((group) => group.student.id === selectedStudentId);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-80 text-gray-600">
        <Spinner className="text-primary size-7 md:size-8" />
        <span className="ml-2 text-gray-600">Loading messages...</span>
      </div>
    );

  if (isError) return <div className="text-center text-red-500 font-medium py-10">Failed to load messages. Please try again later.</div>;

  return (
    <div className="space-y-4">
      {/* Search Box */}
      <div className="w-full flex items-center">
        <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Search contacts..." className="mr-2 border-primary/80 w-full" />
        <Button onClick={handleSearch}>
          <SearchIcon className="w-4 h-4" />
        </Button>
      </div>

      {groupedContacts.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <MessageSquare className="size-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-1">No Messages Yet</h4>
            <p className="text-sm text-muted-foreground">Student messages will appear here.</p>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-200px)]">
          {/* users */}
          <Card className=" w-full md:w-60  flex-shrink-0 p-4 border-primary/40 border overflow-hidden">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 px-2 ">Students</h3>
            <div className="flex flex-row md:flex-col  gap-2 overflow-auto md:h-[calc(100%-2rem)]">
              {groupedContacts.map((group) => {
                const isSelected = selectedStudentId === group.student.id;
                const hasUnrepliedMessages = group.messages.some((msg: ContactType) => !msg.reply);

                return (
                  <div
                    key={group.student.id}
                    onClick={() => setSelectedStudentId(group.student.id)}
                    className={`flex items-center gap-2.5 hover:cursor-pointer px-3 py-3 rounded-lg duration-300 transition-all hover:bg-primary/15 ${isSelected && 'bg-primary/15'}`}
                  >
                    <div className="relative">
                      <div className={`rounded-full p-2.5 ${isSelected ? 'bg-primary' : 'bg-primary/20'}`}>
                        <User className={`size-4 ${isSelected ? 'text-white' : 'text-primary'}`} />
                      </div>
                      {hasUnrepliedMessages && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                        {group.student?.first_name} {group.student?.last_name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* chatbox */}
          <div className="flex-1 min-w-0">
            {selectedGroup ? (
              <Card className="p-4 border-primary/40 border h-full flex flex-col">
                <div className="flex items-center justify-between pb-4 border-b mb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2.5">
                      <User className="size-4 text-primary" />
                    </div>
                    <div className="items-start gap-2">
                      <p className="font-semibold text-sm">
                        {selectedGroup.student?.first_name} {selectedGroup.student?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">{selectedGroup.student?.email}</p>
                    </div>
                  </div>
                </div>

                {/* messages */}
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto px-2 py-2 mb-4 rounded-lg">
                  {selectedGroup.messages.map((contact: ContactType) => (
                    <div key={contact.id} className="space-y-2">
                      <div className="flex flex-col  items-start  group" onMouseEnter={() => setHoveredMessageId(contact.id)} onMouseLeave={() => setHoveredMessageId(null)}>
                        <div className="max-w-[80%] relative p-3 rounded-2xl rounded-tl-none shadow-sm bg-primary text-white">
                          <p className="text-sm leading-relaxed text-white whitespace-pre-wrap break-words">{contact.message}</p>
                          <span className="text-xs text-gray-100 mt-1">{moment(contact.created_at).fromNow()}</span>

                          {!contact.reply && hoveredMessageId === contact.id && (
                            <div
                              onClick={() => {
                                setReplyingToMessageId(contact.id);
                                setReplyMessages('');
                              }}
                              className="absolute -right-4 top-8  -translate-y-1/2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-all duration-300 border border-gray-200"
                              title="Reply to this message"
                            >
                              <Reply className="w-4 h-4 text-primary" />
                            </div>
                          )}
                        </div>
                      </div>

                      {contact.reply && (
                        <div className="flex flex-col items-end">
                          <div className="max-w-[80%] p-3 rounded-2xl rounded-tr-none shadow-sm bg-primary/90 text-white border border-gray-200">
                            <p className="text-sm leading-relaxed text-white whitespace-pre-wrap break-words">{contact.reply}</p>
                            <span className="text-xs text-gray-100 mt-1">{moment(contact.updated_at).fromNow()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {replyingToMessageId && (
                  <div className="border-t pt-4">
                    <div className="mb-2 text-xs text-muted-foreground flex items-center justify-between">
                      <span>Replying to message...</span>
                      <Button
                        size="sm"
                        variant={'destructive'}
                        onClick={() => {
                          setReplyingToMessageId(null);
                          setReplyMessages('');
                        }}
                        className="text-xs cursor-pointer bg-transparent  hover:text-red-600 hover:bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>
                    <div className="flex items-end gap-3">
                      <textarea
                        placeholder="Type your reply..."
                        className="flex-1 resize-none p-3 text-sm rounded-lg border border-gray-300 bg-white focus:outline-primary/60 focus:border-transparent"
                        rows={1}
                        value={replyMessages}
                        onChange={(e) => setReplyMessages(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (replyMessages.trim() && !updateMutation.isPending) {
                              handleReply();
                            }
                          }
                        }}
                        autoFocus
                      />
                      <Button size="sm" className="gap-2 py-3 px-4 rounded-xl h-fit" onClick={handleReply} disabled={updateMutation.isPending || !replyMessages.trim()}>
                        {updateMutation.isPending ? (
                          <Spinner />
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Reply
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-8 h-full flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <MessageSquare className="size-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">Select a Contact</h4>
                  <p className="text-sm text-muted-foreground">Choose a contact from the left to view messages.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
