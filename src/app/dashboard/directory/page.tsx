import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUsers } from '@/lib/mock-data';
import { Briefcase, GraduationCap, Search } from 'lucide-react';

export default function DirectoryPage() {
  const alumni = mockUsers.filter((user) => user.role === 'alumni');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Alumni Directory</h1>
        <p className="text-muted-foreground">
          Find and connect with fellow alumni.
        </p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search by name, company, or year..." className="pl-10" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {alumni.map((user) => (
          <Card key={user.id} className="text-center transition-all hover:shadow-lg">
            <CardHeader className="items-center">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={`https://placehold.co/100x100.png`} alt={`${user.firstName} ${user.lastName}`} data-ai-hint="professional headshot"/>
                <AvatarFallback>
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle>
                {user.firstName} {user.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>
                  {user.jobTitle} at {user.company}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>Class of {user.graduationYear}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
