'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUsers } from '@/lib/mock-data';
import { Briefcase, GraduationCap, Search, MapPin } from 'lucide-react';

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const alumni = mockUsers.filter((user) => user.role === 'alumni');
  const countries = ['all', ...new Set(alumni.map((user) => user.country))];

  const filteredAlumni = alumni.filter((user) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName} ${user.company} ${user.graduationYear}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesCountry =
      selectedCountry === 'all' || user.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Alumni Directory</h1>
        <p className="text-muted-foreground">
          Find and connect with fellow alumni from around the world.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, company, or year..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country === 'all' ? 'All Countries' : country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredAlumni.map((user) => (
          <Link href={`/dashboard/directory/${user.id}`} key={user.id}>
            <Card className="h-full text-center transition-all hover:shadow-lg cursor-pointer">
              <CardHeader className="items-center">
                <Avatar className="h-24 w-24 mb-2">
                  <AvatarImage
                    src={`https://placehold.co/100x100.png`}
                    alt={`${user.firstName} ${user.lastName}`}
                    data-ai-hint="professional headshot"
                  />
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
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{user.country}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
