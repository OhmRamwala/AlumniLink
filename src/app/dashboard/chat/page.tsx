
'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, MessageSquare, Plus, Search, User as UserIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import type { Chat, ChatMessage, User as UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

function NewMessageDialog({ currentUser, onChatCreated }: { currentUser: UserProfile, onChatCreated: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const defaultAvatar = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    if (!db) return;
    setIsLoading(true);
    try {
      const q = query(collection(db, 'users'), where('id', '!=', currentUser.id));
      const snapshot = await getDocs(q);
      const userData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async (targetUser: UserProfile) => {
    if (!db) return;
    setOpen(false);

    try {
      // Check for existing chat
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('participants', 'array-contains', currentUser.id));
      const snapshot = await getDocs(q);
      
      let existingChatId = null;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(targetUser.id)) {
          existingChatId = doc.id;
        }
      });

      if (existingChatId) {
        onChatCreated(existingChatId);
      } else {
        const newChat = {
          participants: [currentUser.id, targetUser.id],
          participantDetails: {
            [currentUser.id]: {
              firstName: currentUser.firstName,
              lastName: currentUser.lastName,
              avatar: currentUser.avatar || defaultAvatar,
            },
            [targetUser.id]: {
              firstName: targetUser.firstName,
              lastName: targetUser.lastName,
              avatar: targetUser.avatar || defaultAvatar,
            },
          },
          lastActivity: serverTimestamp(),
          lastMessage: '',
        };
        const docRef = await addDoc(collection(db, 'chats'), newChat);
        onChatCreated(docRef.id);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="h-8 w-8">
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 gap-0 overflow-hidden sm:max-w-[450px]">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>Search for anyone in the community to start a chat.</DialogDescription>
        </DialogHeader>
        <Command className="rounded-none border-none">
          <CommandInput placeholder="Search people..." />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup heading="People">
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => handleStartChat(user)}
                  className="flex items-center gap-3 p-2 cursor-pointer"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || defaultAvatar} />
                    <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chatId = searchParams.get('id');
  const { toast } = useToast();

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const defaultAvatar = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

  useEffect(() => {
    if (!auth || !db) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db!, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ id: user.uid, ...userDoc.data() } as UserProfile);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db || !currentUser) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.id),
      orderBy('lastActivity', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
      setChats(chatData);
      setIsLoadingChats(false);
    }, async (error) => {
      const permissionError = new FirestorePermissionError({
        path: 'chats',
        operation: 'list',
      });
      errorEmitter.emit('permission-error', permissionError);
      setIsLoadingChats(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!db || !chatId || !currentUser) return;

    setIsLoadingMessages(true);
    const chatRef = doc(db, 'chats', chatId);
    
    getDoc(chatRef).then((docSnap) => {
      if (docSnap.exists()) {
        setCurrentChat({ id: docSnap.id, ...docSnap.data() } as Chat);
      }
    }).catch(async () => {
        const permissionError = new FirestorePermissionError({
            path: `chats/${chatId}`,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
    });

    const messagesQuery = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      setMessages(messageData);
      setIsLoadingMessages(false);
      setTimeout(() => scrollToBottom(), 100);
    }, async (error) => {
      const permissionError = new FirestorePermissionError({
        path: `chats/${chatId}/messages`,
        operation: 'list',
      });
      errorEmitter.emit('permission-error', permissionError);
      setIsLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [chatId, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !chatId || !currentUser || !newMessage.trim() || isSending) return;

    setIsSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    const messageData = {
        senderId: currentUser.id,
        text: messageText,
        timestamp: serverTimestamp(),
    };

    try {
      const chatRef = doc(db, 'chats', chatId);
      const messagesRef = collection(db, 'chats', chatId, 'messages');

      addDoc(messagesRef, messageData).catch(async () => {
          const permissionError = new FirestorePermissionError({
              path: `chats/${chatId}/messages`,
              operation: 'create',
              requestResourceData: messageData,
          });
          errorEmitter.emit('permission-error', permissionError);
      });

      updateDoc(chatRef, {
        lastMessage: messageText,
        lastActivity: serverTimestamp(),
      }).catch(async () => {
          const permissionError = new FirestorePermissionError({
              path: `chats/${chatId}`,
              operation: 'update',
              requestResourceData: { lastMessage: messageText },
          });
          errorEmitter.emit('permission-error', permissionError);
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const getOtherParticipant = (chat: Chat) => {
    const otherId = chat.participants.find(id => id !== currentUser?.id);
    return otherId ? chat.participantDetails[otherId] : null;
  };

  const handleChatCreated = (id: string) => {
    router.push(`/dashboard/chat?id=${id}`);
  };

  if (isLoadingChats && !currentUser) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-6 overflow-hidden">
      {/* Sidebar: Chat List */}
      <Card className="w-80 flex flex-col shrink-0">
        <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
          {currentUser && <NewMessageDialog currentUser={currentUser} onChatCreated={handleChatCreated} />}
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {chats.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm">No conversations yet.</p>
              </div>
            ) : (
              <div className="divide-y">
                {chats.map((chat) => {
                  const other = getOtherParticipant(chat);
                  return (
                    <button
                      key={chat.id}
                      onClick={() => router.push(`/dashboard/chat?id=${chat.id}`)}
                      className={cn(
                        "w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors text-left",
                        chatId === chat.id && "bg-accent"
                      )}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={other?.avatar || defaultAvatar} />
                        <AvatarFallback>{other?.firstName?.[0]}{other?.lastName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <p className="text-sm font-semibold truncate">{other?.firstName} {other?.lastName}</p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {chat.lastActivity && formatDistanceToNow(chat.lastActivity instanceof Timestamp ? chat.lastActivity.toDate() : new Date(), { addSuffix: false })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{chat.lastMessage || 'Start a conversation'}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Area: Conversation */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        {chatId ? (
          <>
            <CardHeader className="p-4 border-b flex flex-row items-center gap-3 space-y-0">
              {currentChat && (
                <>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={getOtherParticipant(currentChat)?.avatar || defaultAvatar} />
                    <AvatarFallback>
                      {getOtherParticipant(currentChat)?.firstName?.[0]}
                      {getOtherParticipant(currentChat)?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">
                      {getOtherParticipant(currentChat)?.firstName} {getOtherParticipant(currentChat)?.lastName}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </>
              )}
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden relative flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col max-w-[75%]",
                        msg.senderId === currentUser?.id ? "ml-auto items-end" : "items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2 text-sm",
                          msg.senderId === currentUser?.id
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-muted rounded-tl-none"
                        )}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 px-1">
                        {msg.timestamp && formatDistanceToNow(msg.timestamp instanceof Timestamp ? msg.timestamp.toDate() : new Date(), { addSuffix: true })}
                      </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t mt-auto">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    disabled={isSending}
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim() || isSending}>
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/30">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Select a Message</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Choose a conversation from the list or start a new message.
            </p>
            {currentUser && (
                <div className="mt-6">
                    <NewMessageDialog currentUser={currentUser} onChatCreated={handleChatCreated} />
                    <span className="ml-2 text-sm font-medium">Create a new message</span>
                </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <ChatContent />
    </Suspense>
  );
}
