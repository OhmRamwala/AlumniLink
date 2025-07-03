'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { onAuthStateChanged, type User as AuthUser } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  CornerUpLeft,
  MoreVertical,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ForumThread, ForumReply, User as UserProfile } from '@/lib/types';

function ThreadSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-11/12" />
        </CardContent>
      </Card>
      <Skeleton className="h-6 w-32 mt-4" />
      <Card>
        <CardHeader className="flex-row items-start gap-3 space-y-0">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function ForumThreadPage() {
  const params = useParams();
  const threadId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [thread, setThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newReplyContent, setNewReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const { toast } = useToast();

  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState('');
  const [editedVideoUrl, setEditedVideoUrl] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    if (!auth || !db) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setCurrentUser(userDoc.exists() ? ({ id: user.uid, ...userDoc.data() } as UserProfile) : null);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db || !threadId) return;

    const threadDocRef = doc(db, 'threads', threadId);
    const unsubscribeThread = onSnapshot(threadDocRef, (doc) => {
      if (doc.exists()) {
        setThread({ id: doc.id, ...doc.data() } as ForumThread);
      } else {
        notFound();
      }
      setIsLoading(false);
    });

    const repliesQuery = query(collection(db, 'threads', threadId, 'replies'), orderBy('postedAt', 'asc'));
    const unsubscribeReplies = onSnapshot(repliesQuery, (snapshot) => {
      const repliesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ForumReply));
      setReplies(repliesData);
    });

    return () => {
      unsubscribeThread();
      unsubscribeReplies();
    };
  }, [threadId]);

  const handlePostReply = async () => {
    if (!newReplyContent.trim() || !currentUser || !db || !threadId) return;
    setIsSubmittingReply(true);
    try {
      const threadRef = doc(db, 'threads', threadId);
      const repliesRef = collection(threadRef, 'replies');

      await addDoc(repliesRef, {
        content: newReplyContent,
        postedAt: serverTimestamp(),
        postedBy: {
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          avatar: currentUser.avatar || '',
        },
      });

      await updateDoc(threadRef, {
        replyCount: increment(1),
        lastActivity: serverTimestamp(),
      });

      setNewReplyContent('');
      toast({ title: 'Success', description: 'Your reply has been posted.' });
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to post reply.' });
    } finally {
      setIsSubmittingReply(false);
    }
  };
  
  const handleEditClick = (type: 'thread' | 'reply', post: ForumThread | ForumReply) => {
    if (type === 'thread' && 'title' in post) {
        setEditingPost('thread');
        setEditedContent(post.content);
        setEditedImageUrl(post.imageUrl || '');
        setEditedVideoUrl(post.videoUrl || '');
    } else {
        setEditingPost(`reply-${post.id}`);
        setEditedContent(post.content);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditedContent('');
    setEditedImageUrl('');
    setEditedVideoUrl('');
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim() || !editingPost || !db || !threadId) return;
    setIsSavingEdit(true);
    
    try {
      let docRef;
      let dataToUpdate: any = { content: editedContent };

      if (editingPost === 'thread') {
        docRef = doc(db, 'threads', threadId);
        dataToUpdate.imageUrl = editedImageUrl || '';
        dataToUpdate.videoUrl = editedVideoUrl || '';
      } else {
        const replyId = editingPost.replace('reply-', '');
        docRef = doc(db, 'threads', threadId, 'replies', replyId);
      }
      await updateDoc(docRef, dataToUpdate);
      toast({ title: 'Success', description: 'Your changes have been saved.' });
      handleCancelEdit();
    } catch (error) {
      console.error('Error saving edit:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save changes.' });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (type: 'thread' | 'reply', id: string) => {
      if (!db || !threadId) return;
      
      const isConfirmed = window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`);
      if (!isConfirmed) return;

      try {
        if (type === 'thread') {
            await deleteDoc(doc(db, 'threads', threadId));
            toast({ title: 'Success', description: 'Thread deleted.' });
            router.push('/dashboard/forum');
        } else {
            await deleteDoc(doc(db, 'threads', threadId, 'replies', id));
            await updateDoc(doc(db, 'threads', threadId), { replyCount: increment(-1) });
            toast({ title: 'Success', description: 'Reply deleted.' });
        }
      } catch (error) {
         console.error(`Error deleting ${type}:`, error);
         toast({ variant: 'destructive', title: 'Error', description: `Failed to delete ${type}.` });
      }
  };
  
  const formatTimestamp = (ts: Timestamp | undefined) => {
    if (!ts) return 'just now';
    return formatDistanceToNow(ts.toDate(), { addSuffix: true });
  }

  const canEditOrDelete = (authorId: string) => {
      return currentUser && (currentUser.id === authorId || currentUser.role === 'admin');
  }

  const getEmbedUrl = (url: string) => {
    try {
        const videoUrl = new URL(url);
        if (videoUrl.hostname.includes('youtube.com')) {
            const videoId = videoUrl.searchParams.get('v');
            if (videoId) return `https://www.youtube.com/embed/${videoId}`;
        }
        if (videoUrl.hostname === 'youtu.be') {
            return `https://www.youtube.com/embed/${videoUrl.pathname.slice(1)}`;
        }
    } catch (error) {
        console.error("Invalid video URL", error);
        return url;
    }
    return url;
  };

  if (isLoading || !thread) {
    return <ThreadSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" asChild>
          <Link href="/dashboard/forum">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forum
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle>{thread.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={thread.postedBy.avatar || `https://placehold.co/100x100.png`}
                    alt={thread.postedBy.firstName}
                    data-ai-hint="person face"
                  />
                  <AvatarFallback>
                    {thread.postedBy.firstName[0]}
                    {thread.postedBy.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {thread.postedBy.firstName} {thread.postedBy.lastName}
                </span>
                <span>•</span>
                <span>{formatTimestamp(thread.postedAt)}</span>
              </div>
            </div>
            {canEditOrDelete(thread.postedBy.id) && !editingPost && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleEditClick('thread', thread)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => handleDelete('thread', thread.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editingPost === `thread` ? (
            <div className="space-y-4">
              <Textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} rows={5} />
              <div className="space-y-2">
                <Label>Image URL (Optional)</Label>
                <Input value={editedImageUrl} onChange={(e) => setEditedImageUrl(e.target.value)} placeholder="https://example.com/image.png" />
              </div>
              <div className="space-y-2">
                <Label>Video URL (Optional)</Label>
                <Input value={editedVideoUrl} onChange={(e) => setEditedVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit} disabled={isSavingEdit}>
                  {isSavingEdit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
              </div>
            </div>
          ) : (
             <>
                {thread.imageUrl && (
                    <div className="my-4 relative aspect-video">
                        <Image src={thread.imageUrl} alt={thread.title} fill className="rounded-lg object-contain" data-ai-hint="forum post image" />
                    </div>
                )}
                {thread.videoUrl && (
                    <div className="my-4 aspect-video">
                        <iframe
                            className="w-full h-full rounded-lg"
                            src={getEmbedUrl(thread.videoUrl)}
                            title="Embedded Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
                <p className="text-base leading-relaxed whitespace-pre-wrap">{thread.content}</p>
            </>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Replies ({thread.replyCount})</h2>
        {replies.map((reply) => (
          <Card key={reply.id}>
            <CardHeader className="flex-row items-start gap-3 space-y-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={reply.postedBy.avatar || `https://placehold.co/100x100.png`} alt={reply.postedBy.firstName} data-ai-hint="professional headshot" />
                <AvatarFallback>{reply.postedBy.firstName[0]}{reply.postedBy.lastName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">{reply.postedBy.firstName} {reply.postedBy.lastName}</span>
                    <span className="text-muted-foreground">• {formatTimestamp(reply.postedAt)}</span>
                  </div>
                  {canEditOrDelete(reply.postedBy.id) && !editingPost && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditClick('reply', reply)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete('reply', reply.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                {editingPost === `reply-${reply.id}` ? (
                  <div className="space-y-2 mt-2">
                    <Textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} rows={3} />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit} disabled={isSavingEdit}>{isSavingEdit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save</Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-base mt-1 whitespace-pre-wrap">{reply.content}</p>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Separator />

      {currentUser && (
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.avatar || `https://placehold.co/100x100.png`} alt={currentUser.firstName} data-ai-hint="person face" />
            <AvatarFallback>{currentUser.firstName[0]}{currentUser.lastName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Write a reply..."
              rows={4}
              value={newReplyContent}
              onChange={(e) => setNewReplyContent(e.target.value)}
              disabled={isSubmittingReply}
            />
            <Button onClick={handlePostReply} disabled={isSubmittingReply || !newReplyContent.trim()}>
              {isSubmittingReply ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CornerUpLeft className="mr-2 h-4 w-4" />}
              Post Reply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
