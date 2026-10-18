import { Room, RoomBooking, MenuItem, ReadingEntry, ReadingBadge, PortalLinkItem, AnnouncementItem, BellPeriod } from '../types';

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'study-a',
    name: 'Quiet Study Room A',
    category: 'study',
    building: 'West Wing Library',
    floor: 'Floor 2 (Room 204)',
    capacity: 6,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
    amenities: ['Ultra-Quiet Zone', 'Magnetic Dry-Erase Wall', '6 Herman Miller Chairs', 'High-Speed USB-C Ports', 'Adjustable Lighting'],
    rules: ['No loud phone calls', 'Lidded drinks only', 'Maximum 2 consecutive slots'],
    description: 'A serene sound-dampened study sanctuary perfect for group research, study circles, and exam preparation.'
  },
  {
    id: 'study-b',
    name: 'Collaborative Lab Room B',
    category: 'study',
    building: 'West Wing Library',
    floor: 'Floor 2 (Room 208)',
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    amenities: ['65" 4K Presentation Display', 'HDMI & AirPlay Cast', 'Full Perimeter Whiteboards', 'Conference Speakerphone'],
    rules: ['Group collaboration encouraged', 'Keep whiteboard markers capped', 'Clean boards before leaving'],
    description: 'Optimized for team projects, student council committees, debate practice, and group slide deck rehearsals.'
  },
  {
    id: 'music-1',
    name: 'Acoustic Piano Suite 1',
    category: 'music',
    building: 'Fine Arts Pavilion',
    floor: 'Floor 1 (Room 112)',
    capacity: 3,
    image: 'https://images.unsplash.com/photo-1520523839898-50712825e3a7?auto=format&fit=crop&w=600&q=80',
    amenities: ['Yamaha U3 Upright Piano', 'Soundproof Double Doors', 'Adjustable Music Stands (2)', 'Metronome & Tuner', 'Audio Monitor'],
    rules: ['No food or open beverages near piano', 'Wipe piano keys after play', 'Tuned weekly - report sticking keys'],
    description: 'Dedicated acoustic practice chamber with professional sound absorption, tuned for solo instrumentalists & vocalists.'
  },
  {
    id: 'music-2',
    name: 'Ensemble & Band Studio 2',
    category: 'music',
    building: 'Fine Arts Pavilion',
    floor: 'Basement Level (Room B04)',
    capacity: 8,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    amenities: ['Roland Electronic Drum Kit', 'Fender Guitar Amp', 'Ampeg Bass Amp', '2 Shure SM58 Microphones & PA System', 'XLR Cables'],
    rules: ['Keep volume within studio limiter levels', 'Return cables to wall rack', 'Power down amps before unplugging'],
    description: 'Sound-isolated rehearsal studio for rock bands, jazz quartets, percussion ensembles, and chamber orchestra sectional practice.'
  },
  {
    id: 'media-lab',
    name: 'Digital Media & Podcast Booth',
    category: 'lab',
    building: 'Innovation Center',
    floor: 'Floor 3 (Room 315)',
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
    amenities: ['4x Shure SM7B Cardioid Mics', 'RØDECaster Pro II Mixer', 'Apple iMac 27" with Logic Pro & Final Cut', 'Acoustic Foam Walls', 'Green Screen Backdrop'],
    rules: ['Save your files to cloud or external drive before logout', 'Do not alter audio router presets without lab tech'],
    description: 'Professional grade broadcasting suite for school podcast shows, video narration, interview recordings, and multimedia editing.'
  },
  {
    id: 'creative-studio',
    name: 'STEM Maker & Design Space',
    category: 'creative',
    building: 'Innovation Center',
    floor: 'Floor 1 (Room 105)',
    capacity: 12,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    amenities: ['Bambu Lab 3D Printers (2)', 'Soldering Stations', 'Arduino & Raspberry Pi Kits', 'Heavy Duty Workbenches', 'First Aid Station'],
    rules: ['Safety goggles required during cutting/soldering', 'Teacher or TA safety authorization required'],
    description: 'Equipped for robotics build season, architectural drafting, science fair experiment fabrication, and collaborative innovation.'
  }
];

export const TIME_SLOTS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00'
];

export const INITIAL_BOOKINGS: RoomBooking[] = [
  {
    id: 'bk-101',
    roomId: 'music-1',
    roomName: 'Acoustic Piano Suite 1',
    category: 'music',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 - 11:00',
    studentName: 'Julian Sterling',
    studentId: 'OAK-2490',
    grade: '11th Grade',
    groupSize: 1,
    purpose: 'Chopin Nocturne Opus 9 rehearsal for Spring Recital',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'bk-102',
    roomId: 'study-a',
    roomName: 'Quiet Study Room A',
    category: 'study',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '13:00 - 14:00',
    studentName: 'Maya Patel',
    studentId: 'OAK-1833',
    grade: '12th Grade',
    groupSize: 4,
    purpose: 'AP Calculus BC peer tutoring group',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'bk-103',
    roomId: 'media-lab',
    roomName: 'Digital Media & Podcast Booth',
    category: 'lab',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '15:00 - 16:00',
    studentName: 'Leo Rodriguez',
    studentId: 'OAK-3109',
    grade: '10th Grade',
    groupSize: 2,
    purpose: 'Recording Episode 14 of "The Oakridge Student Voice"',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    day: 'Monday',
    dateStr: 'Oct 19',
    soup: 'Silky Miso Seaweed Soup with Tofu',
    main: 'Crispy Honey-Teriyaki Chicken with Steamed Jasmine Rice',
    vegetarian: 'Sweet Chili Golden Tofu & Bok Choy Stir-Fry',
    side: 'Sesame Ginger Edamame & Roasted Sesame Carrots',
    dessert: 'Chilled Honeycrisp Apple Slices & Fortune Cookie',
    calories: 580,
    allergens: ['Nut-Free', 'Dairy-Free'],
    chefPick: true,
    ratings: [5, 5, 4, 5, 5]
  },
  {
    day: 'Tuesday',
    dateStr: 'Oct 20',
    soup: 'Hearty Tuscan Minestrone with Fresh Basil',
    main: 'House Italian Baked Lasagna with Angus Beef Bolognese',
    vegetarian: 'Spinach & Ricotta Stuffed Jumbo Shells in Rustic Marinara',
    side: 'Herb Garlic Breadsticks & Crisp Garden Caesar Salad',
    dessert: 'Cannoli Cream Tart or Fresh Bosc Pear',
    calories: 640,
    allergens: ['Nut-Free', 'Vegetarian Available'],
    chefPick: false,
    ratings: [5, 4, 4, 5]
  },
  {
    day: 'Wednesday',
    dateStr: 'Oct 21',
    soup: 'Spiced Black Bean Soup with Lime Crema',
    main: 'Citrus Slow-Roasted Carnitas Burrito Bowl with Cilantro Rice',
    vegetarian: 'Smoky Chipotle Roasted Cauliflower & Black Bean Fiesta Bowl',
    side: 'Warm Corn Tortilla Chips, Fresh Pico de Gallo & Fresh Guacamole',
    dessert: 'Cinnamon Sugar Churro Bites with Dark Chocolate Dip',
    calories: 615,
    allergens: ['Gluten-Free Option', 'Nut-Free'],
    chefPick: true,
    ratings: [5, 5, 5, 5, 4]
  },
  {
    day: 'Thursday',
    dateStr: 'Oct 22',
    soup: 'Golden Yellow Lentil & Coconut Dahl',
    main: 'Authentic Butter Chicken with Fragrant Cumin Basmati Rice',
    vegetarian: 'Paneer Makhani with Roasted Green Peas & Garlic Naan',
    side: 'Cucumber Tomato Mint Raita & Crispy Vegetable Samosa',
    dessert: 'Cardamom Spiced Mango Lassi Pudding',
    calories: 670,
    allergens: ['Halal-Certified', 'Nut-Free'],
    chefPick: true,
    ratings: [5, 5, 5, 4]
  },
  {
    day: 'Friday',
    dateStr: 'Oct 23',
    soup: 'New England Coastal Sweet Corn Chowder',
    main: 'Crispy Panko Atlantic Cod with Sea Salt Crinkle Fries',
    vegetarian: 'Artisan Wood-Fired Margherita & Mushroom Pizza',
    side: 'Zesty Lemon Slaw & Sweet Buttered Corn on the Cob',
    dessert: 'Fresh Baked Double Fudge Cookie & Ice Cream Cup',
    calories: 695,
    allergens: ['Nut-Free', 'Dairy Alert'],
    chefPick: false,
    ratings: [5, 4, 5, 4, 5]
  }
];

export const INITIAL_READING_ENTRIES: ReadingEntry[] = [
  {
    id: 'rd-01',
    studentName: 'Julian Sterling',
    studentId: 'OAK-2490',
    grade: '11th Grade',
    bookTitle: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic Literature',
    totalPages: 323,
    minutesSpent: 480,
    dateCompleted: '2026-10-14',
    rating: 5,
    summary: 'Atticus Finch\'s moral compass and Scout\'s perspective illuminate societal justice, empathy, and courage in Maycomb.',
    comprehensionScore: 96,
    pointsEarned: 245,
    verifiedTeacher: 'Ms. Vance (English Dept)'
  },
  {
    id: 'rd-02',
    studentName: 'Maya Patel',
    studentId: 'OAK-1833',
    grade: '12th Grade',
    bookTitle: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    genre: 'Science Fiction',
    totalPages: 303,
    minutesSpent: 390,
    dateCompleted: '2026-10-16',
    rating: 5,
    summary: 'A haunting contemplation on what it means to love, seen through the observant and selfless eyes of an Artificial Friend.',
    comprehensionScore: 92,
    pointsEarned: 230,
    verifiedTeacher: 'Dr. Thorne'
  },
  {
    id: 'rd-03',
    studentName: 'Leo Rodriguez',
    studentId: 'OAK-3109',
    grade: '10th Grade',
    bookTitle: 'The Martian',
    author: 'Andy Weir',
    genre: 'Hard Sci-Fi / Adventure',
    totalPages: 369,
    minutesSpent: 520,
    dateCompleted: '2026-10-12',
    rating: 5,
    summary: 'Mark Watney engineers his own survival with botany, chemistry, and humor after being stranded on Mars.',
    comprehensionScore: 98,
    pointsEarned: 280,
    verifiedTeacher: 'Mr. Henderson'
  },
  {
    id: 'rd-04',
    studentName: 'Clara Zhao',
    studentId: 'OAK-1904',
    grade: '11th Grade',
    bookTitle: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Personal Development',
    totalPages: 270,
    minutesSpent: 320,
    dateCompleted: '2026-10-17',
    rating: 4,
    summary: 'Practical systems architecture for micro-habits, cue triggers, and compounding 1% daily improvements.',
    comprehensionScore: 90,
    pointsEarned: 200,
    verifiedTeacher: 'Ms. Vance'
  }
];

export const READING_BADGES: ReadingBadge[] = [
  {
    id: 'badge-starter',
    name: 'First Chapter',
    icon: 'BookOpen',
    description: 'Submit your first verified book score sheet review.',
    threshold: 1,
    category: 'books'
  },
  {
    id: 'badge-500pts',
    name: 'Master Scholar',
    icon: 'Award',
    description: 'Amass 500+ total cumulative reading activity points.',
    threshold: 500,
    category: 'points'
  },
  {
    id: 'badge-marathon',
    name: 'Century Reader',
    icon: 'Flame',
    description: 'Log over 1,000 pages read across your term portfolio.',
    threshold: 1000,
    category: 'pages'
  },
  {
    id: 'badge-genre-explorer',
    name: 'Genre Polymath',
    icon: 'Compass',
    description: 'Read and score books across 3 different literary genres.',
    threshold: 3,
    category: 'books'
  },
  {
    id: 'badge-top-quiz',
    name: 'A+ Critic',
    icon: 'CheckCircle2',
    description: 'Achieve a 95%+ comprehension score on any book evaluation.',
    threshold: 95,
    category: 'points'
  }
];

export const PORTAL_LINKS: PortalLinkItem[] = [
  {
    id: 'sms-portal',
    title: 'School Management System (SMS)',
    description: 'Official student record hub for course grades, daily attendance, class timetable, and transcript audits.',
    category: 'academic',
    url: 'https://sms.oakridge.edu',
    icon: 'UserCheck',
    badge: 'Live SIS Sync',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    isExternal: false,
    actionType: 'sms'
  },
  {
    id: 'library-opac',
    title: 'School Library Catalog (OPAC)',
    description: 'Search 42,000+ print volumes, reserve reserve-shelf study texts, and borrow JSTOR / Libby e-books.',
    category: 'resources',
    url: 'https://library.oakridge.edu',
    icon: 'Library',
    badge: 'Catalog & E-Books',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    isExternal: false,
    actionType: 'library'
  },
  {
    id: 'reading-scores',
    title: 'Book Score Sheet Portal',
    description: 'Direct access to the reading challenge sheet, teacher verification queue, and grade reading logs.',
    category: 'academic',
    url: '#reading-score',
    icon: 'FileText',
    badge: 'Points Tracker',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    isExternal: false,
    actionType: 'reading'
  },
  {
    id: 'it-helpdesk',
    title: 'Campus IT & 1-to-1 Device Support',
    description: 'Chromebook repair tickets, campus Wi-Fi passcodes, Google Classroom credentials, and printing support.',
    category: 'campus',
    url: 'https://helpdesk.oakridge.edu',
    icon: 'Headphones',
    badge: 'Open 8am-4pm',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    isExternal: true
  },
  {
    id: 'athletics-clubs',
    title: 'Oakridge Athletics & Club Rosters',
    description: 'Varsity game schedules, bus transportation, club registration deadlines, and intramural signups.',
    category: 'student-life',
    url: 'https://athletics.oakridge.edu',
    icon: 'Trophy',
    badge: 'Fall Season',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    isExternal: true
  },
  {
    id: 'guidance-counselor',
    title: 'College Counseling & Student Wellness',
    description: 'Book 1-on-1 advisor sessions, FAFSA scholarship guides, mental health check-ins, and peer mentoring.',
    category: 'campus',
    url: 'https://guidance.oakridge.edu',
    icon: 'HeartHandshake',
    badge: 'Advising Open',
    badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
    isExternal: true
  }
];

export const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Library Extended Hours During Midterm Prep Week',
    category: 'academic',
    date: 'Oct 18',
    content: 'The West Wing Library and all Study Rooms will remain open until 7:30 PM Monday through Thursday with complimentary quiet snacks.'
  },
  {
    id: 'ann-2',
    title: 'Fine Arts Pavilion Music Rooms: Winter Recital Rehearsals',
    category: 'event',
    date: 'Oct 17',
    content: 'Students preparing solo or ensemble pieces for the Annual Winter Gala are encouraged to reserve Music Rooms 1 & 2 in advance.'
  },
  {
    id: 'ann-3',
    title: 'Cafeteria Spreadsheet Menu Sync Live',
    category: 'urgent',
    date: 'Oct 16',
    content: 'The dietary services committee has published this week’s farm-to-table lunch lineup with full allergen labeling and vegetarian alternatives.'
  }
];

export const BELL_SCHEDULE: BellPeriod[] = [
  { name: 'Homeroom & Advisory', start: '08:15', end: '08:35' },
  { name: 'Period 1: STEM / Math', start: '08:40', end: '09:30', periodNumber: 1 },
  { name: 'Period 2: Humanities & Lit', start: '09:35', end: '10:25', periodNumber: 2 },
  { name: 'Morning Break / Snack', start: '10:25', end: '10:40', isBreak: true },
  { name: 'Period 3: Sciences & Labs', start: '10:45', end: '11:35', periodNumber: 3 },
  { name: 'Period 4: World Languages', start: '11:40', end: '12:30', periodNumber: 4 },
  { name: 'Lunch & Campus Recreation', start: '12:30', end: '13:20', isBreak: true },
  { name: 'Period 5: Arts & Music', start: '13:25', end: '14:15', periodNumber: 5 },
  { name: 'Period 6: Social Studies', start: '14:20', end: '15:10', periodNumber: 6 },
  { name: 'After School & Facility Booking', start: '15:15', end: '17:30', isBreak: true }
];
