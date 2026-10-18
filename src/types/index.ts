export type RoomCategory = 'all' | 'study' | 'music' | 'lab' | 'creative';

export interface Room {
  id: string;
  name: string;
  category: 'study' | 'music' | 'lab' | 'creative';
  building: string;
  floor: string;
  capacity: number;
  image: string;
  amenities: string[];
  rules: string[];
  description: string;
}

export interface RoomBooking {
  id: string;
  roomId: string;
  roomName: string;
  category: 'study' | 'music' | 'lab' | 'creative';
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 - 10:00"
  studentName: string;
  studentId: string;
  grade: string;
  groupSize: number;
  purpose: string;
  notes?: string;
  createdAt: string;
}

export interface MenuItem {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  dateStr?: string;
  soup?: string;
  main: string;
  vegetarian: string;
  side: string;
  dessert?: string;
  calories?: number;
  allergens: string[];
  chefPick?: boolean;
  ratings?: number[];
}

export interface ReadingEntry {
  id: string;
  studentName: string;
  studentId: string;
  grade: string;
  bookTitle: string;
  author: string;
  genre: string;
  totalPages: number;
  minutesSpent: number;
  dateCompleted: string;
  rating: number; // 1-5
  summary: string;
  comprehensionScore: number; // 0-100
  pointsEarned: number;
  verifiedTeacher?: string;
}

export interface ReadingBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  threshold: number; // e.g. total points or books
  category: 'points' | 'books' | 'pages';
}

export interface PortalLinkItem {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'resources' | 'campus' | 'student-life';
  url: string;
  icon: string;
  badge: string;
  badgeColor: string;
  isExternal: boolean;
  actionType?: 'sms' | 'library' | 'reading' | 'link';
}

export interface AnnouncementItem {
  id: string;
  title: string;
  category: 'urgent' | 'event' | 'academic' | 'club';
  date: string;
  content: string;
}

export interface BellPeriod {
  name: string;
  start: string; // "08:30"
  end: string;   // "09:20"
  periodNumber?: number;
  isBreak?: boolean;
}
