
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
import { Separator } from '@/components/ui/separator';
import { Send, Loader2, MessageSquare, Search } from 'lucide-react';
import type { Chat, ChatMessage, User as UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

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
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!db || !chatId || !currentUser) return;

    setIsLoadingMessages(true);
    const chatRef = doc(db, 'chats', chatId);
    
    // Fetch chat details
    getDoc(chatRef).then((docSnap) => {
      if (docSnap.exists()) {
        setCurrentChat({ id: docSnap.id, ...docSnap.data() } as Chat);
      }
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

    try {
      const chatRef = doc(db, 'chats', chatId);
      const messagesRef = collection(db, 'chats', chatId, 'messages');

      await addDoc(messagesRef, {
        senderId: currentUser.id,
        text: messageText,
        timestamp: serverTimestamp(),
      });

      await updateDoc(chatRef, {
        lastMessage: messageText,
        lastActivity: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to send message.' });
    } finally {
      setIsSending(false);
    }
  };

  const getOtherParticipant = (chat: Chat) => {
    const otherId = chat.participants.find(id => id !== currentUser?.id);
    return otherId ? chat.participantDetails[otherId] : null;
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
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {chats.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm">No conversations yet.</p>
                <Button variant="link" className="mt-2" onClick={() => router.push('/dashboard/directory')}>
                  Find alumni to chat with
                </Button>
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
              Choose a conversation from the list or start a new one from the directory.
            </p>
            <Button className="mt-6" variant="outline" onClick={() => router.push('/dashboard/directory')}>
              Go to Alumni Directory
            </Button>
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
