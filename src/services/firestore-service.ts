'use server';

import { collection, getDocs, limit, orderBy, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { NewsArticle, AppEvent, Job, User } from '@/lib/types';

// A helper to serialize Firestore Timestamps, as they are not directly JSON serializable
const serialize = (docData: any) => {
    for (const key in docData) {
        if (docData[key] instanceof Timestamp) {
            docData[key] = docData[key].toDate().toISOString();
        }
    }
    return docData;
};

export async function getRecentNews(): Promise<NewsArticle[]> {
    if (!db) return [];
    try {
        const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'), limit(5));
        const snapshot = await getDocs(newsQuery);
        return snapshot.docs.map(doc => serialize({ id: doc.id, ...doc.data() }) as NewsArticle);
    } catch (e) {
        console.error("Error fetching recent news:", e);
        return [];
    }
}

export async function getRecentEvents(): Promise<AppEvent[]> {
    if (!db) return [];
    try {
        const eventsQuery = query(collection(db, 'events'), orderBy('date', 'desc'), limit(5));
        const snapshot = await getDocs(eventsQuery);
        return snapshot.docs.map(doc => serialize({ id: doc.id, ...doc.data() }) as AppEvent);
    } catch (e) {
        console.error("Error fetching recent events:", e);
        return [];
    }
}

export async function getRecentJobs(): Promise<Job[]> {
    if (!db) return [];
    try {
        const jobsQuery = query(collection(db, 'jobs'), orderBy('postedAt', 'desc'), limit(5));
        const snapshot = await getDocs(jobsQuery);
        return snapshot.docs.map(doc => serialize({ id: doc.id, ...doc.data() }) as Job);
    } catch (e) {
        console.error("Error fetching recent jobs:", e);
        return [];
    }
}

export async function searchAlumni(searchTerm: string): Promise<Pick<User, 'firstName' | 'lastName' | 'position' | 'company' | 'country'>[]> {
    if (!db) return [];
    try {
        // This is a simplified search. A real-world app would use a dedicated search service like Algolia.
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'alumni'));
        const querySnapshot = await getDocs(q);
        const alumniData = querySnapshot.docs.map(doc => doc.data() as User);
        
        const lowercasedTerm = searchTerm.toLowerCase();
        const filteredAlumni = alumniData.filter(user => 
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(lowercasedTerm) ||
            user.company?.toLowerCase().includes(lowercasedTerm) ||
            user.position?.toLowerCase().includes(lowercasedTerm)
        ).slice(0, 5); // Limit results

        // Return only a subset of fields to the LLM
        return filteredAlumni.map(({ firstName, lastName, position, company, country }) => ({
            firstName,
            lastName,
            position,
            company,
            country
        }));
    } catch (e) {
        console.error("Error searching alumni:", e);
        return [];
    }
}
