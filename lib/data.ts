export interface SmallGroup {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  dayOfWeek: string
  time: string
  leader: string
  leaderPhone: string
  leaderEmail: string
  category: string
  gender: "mixed" | "men" | "women"
  ageRange: string
  roles: { name: string; member: string }[]
  seasonLessons: string[]
  currentLesson: string
  members: { id: string; name: string; phone: string; email: string }[]
  attendance: { date: string; presentIds: string[] }[]
  sermons: { date: string; title: string; scripture: string; notes: string }[]
  isChurch?: boolean
}

export const mockGroups: SmallGroup[] = [
  {
    id: "church",
    name: "Grace Community Church",
    address: "123 Main Street, Downtown",
    latitude: 40.7128,
    longitude: -74.006,
    dayOfWeek: "Sunday",
    time: "10:00 AM",
    leader: "Pastor John Smith",
    leaderPhone: "(555) 123-4567",
    leaderEmail: "pastor@gracechurch.org",
    category: "Main Church",
    gender: "mixed",
    ageRange: "All Ages",
    roles: [],
    seasonLessons: [],
    currentLesson: "",
    members: [],
    attendance: [],
    sermons: [],
    isChurch: true,
  },
  {
    id: "1",
    name: "Young Adults Fellowship",
    address: "456 Oak Avenue, Apt 2B",
    latitude: 40.7148,
    longitude: -74.002,
    dayOfWeek: "Tuesday",
    time: "7:00 PM",
    leader: "Michael Johnson",
    leaderPhone: "(555) 234-5678",
    leaderEmail: "michael.j@email.com",
    category: "Young Adults",
    gender: "mixed",
    ageRange: "18-30",
    roles: [
      { name: "Worship Leader", member: "Sarah Chen" },
      { name: "Host", member: "David Kim" },
      { name: "Food Coordinator", member: "Emily Brown" },
    ],
    seasonLessons: [
      "Week 1: Faith Foundations",
      "Week 2: Prayer Life",
      "Week 3: Community Living",
      "Week 4: Serving Others",
      "Week 5: Spiritual Growth",
      "Week 6: Mission & Purpose",
    ],
    currentLesson: "Week 3: Community Living",
    members: [
      { id: "m1", name: "Sarah Chen", phone: "(555) 111-1111", email: "sarah@email.com" },
      { id: "m2", name: "David Kim", phone: "(555) 222-2222", email: "david@email.com" },
      { id: "m3", name: "Emily Brown", phone: "(555) 333-3333", email: "emily@email.com" },
      { id: "m4", name: "James Wilson", phone: "(555) 444-4444", email: "james@email.com" },
      { id: "m5", name: "Lisa Anderson", phone: "(555) 555-5555", email: "lisa@email.com" },
    ],
    attendance: [
      { date: "2024-01-02", presentIds: ["m1", "m2", "m3", "m4"] },
      { date: "2024-01-09", presentIds: ["m1", "m2", "m4", "m5"] },
      { date: "2024-01-16", presentIds: ["m1", "m2", "m3", "m4", "m5"] },
    ],
    sermons: [
      {
        date: "2024-01-02",
        title: "Faith Foundations",
        scripture: "Hebrews 11:1-6",
        notes:
          "Discussed the nature of faith and how it applies to daily life. Key takeaway: faith is active, not passive.",
      },
      {
        date: "2024-01-09",
        title: "Prayer Life",
        scripture: "Matthew 6:5-15",
        notes: "Explored the Lord's Prayer as a model. Practiced different prayer forms together.",
      },
    ],
  },
  {
    id: "2",
    name: "Men's Bible Study",
    address: "789 Pine Street",
    latitude: 40.7108,
    longitude: -74.008,
    dayOfWeek: "Thursday",
    time: "6:30 AM",
    leader: "Robert Williams",
    leaderPhone: "(555) 345-6789",
    leaderEmail: "robert.w@email.com",
    category: "Men's Ministry",
    gender: "men",
    ageRange: "30-50",
    roles: [
      { name: "Discussion Leader", member: "Tom Harris" },
      { name: "Coffee Host", member: "Mark Davis" },
    ],
    seasonLessons: [
      "Week 1: Leadership in the Home",
      "Week 2: Work & Faith",
      "Week 3: Brotherhood",
      "Week 4: Spiritual Disciplines",
    ],
    currentLesson: "Week 2: Work & Faith",
    members: [
      { id: "m6", name: "Tom Harris", phone: "(555) 666-6666", email: "tom@email.com" },
      { id: "m7", name: "Mark Davis", phone: "(555) 777-7777", email: "mark@email.com" },
      { id: "m8", name: "Chris Lee", phone: "(555) 888-8888", email: "chris@email.com" },
    ],
    attendance: [
      { date: "2024-01-04", presentIds: ["m6", "m7", "m8"] },
      { date: "2024-01-11", presentIds: ["m6", "m8"] },
    ],
    sermons: [
      {
        date: "2024-01-04",
        title: "Leadership in the Home",
        scripture: "Ephesians 5:25-33",
        notes: "Explored servant leadership model. Men shared personal experiences.",
      },
    ],
  },
  {
    id: "3",
    name: "Women's Prayer Group",
    address: "321 Maple Drive",
    latitude: 40.7168,
    longitude: -74.01,
    dayOfWeek: "Wednesday",
    time: "10:00 AM",
    leader: "Patricia Moore",
    leaderPhone: "(555) 456-7890",
    leaderEmail: "patricia.m@email.com",
    category: "Women's Ministry",
    gender: "women",
    ageRange: "40-60",
    roles: [
      { name: "Prayer Coordinator", member: "Nancy White" },
      { name: "Hospitality", member: "Carol Green" },
    ],
    seasonLessons: [
      "Week 1: Prayers of the Bible",
      "Week 2: Intercessory Prayer",
      "Week 3: Healing Prayer",
      "Week 4: Prayer Journaling",
    ],
    currentLesson: "Week 2: Intercessory Prayer",
    members: [
      { id: "m9", name: "Nancy White", phone: "(555) 999-9999", email: "nancy@email.com" },
      { id: "m10", name: "Carol Green", phone: "(555) 000-0000", email: "carol@email.com" },
      { id: "m11", name: "Diana Ross", phone: "(555) 121-2121", email: "diana@email.com" },
      { id: "m12", name: "Betty Clark", phone: "(555) 131-3131", email: "betty@email.com" },
    ],
    attendance: [
      { date: "2024-01-03", presentIds: ["m9", "m10", "m11", "m12"] },
      { date: "2024-01-10", presentIds: ["m9", "m10", "m12"] },
    ],
    sermons: [],
  },
  {
    id: "4",
    name: "Senior Saints",
    address: "567 Elm Court",
    latitude: 40.7098,
    longitude: -74.004,
    dayOfWeek: "Friday",
    time: "2:00 PM",
    leader: "George Thompson",
    leaderPhone: "(555) 567-8901",
    leaderEmail: "george.t@email.com",
    category: "Senior Ministry",
    gender: "mixed",
    ageRange: "65+",
    roles: [
      { name: "Music Director", member: "Helen Martin" },
      { name: "Care Coordinator", member: "Frank Adams" },
    ],
    seasonLessons: ["Week 1: Legacy of Faith", "Week 2: Wisdom in Trials", "Week 3: Passing the Torch"],
    currentLesson: "Week 1: Legacy of Faith",
    members: [
      { id: "m13", name: "Helen Martin", phone: "(555) 141-4141", email: "helen@email.com" },
      { id: "m14", name: "Frank Adams", phone: "(555) 151-5151", email: "frank@email.com" },
      { id: "m15", name: "Ruth Baker", phone: "(555) 161-6161", email: "ruth@email.com" },
    ],
    attendance: [],
    sermons: [],
  },
  {
    id: "5",
    name: "Youth Group",
    address: "890 Cedar Lane",
    latitude: 40.7138,
    longitude: -74.012,
    dayOfWeek: "Saturday",
    time: "5:00 PM",
    leader: "Kevin Martinez",
    leaderPhone: "(555) 678-9012",
    leaderEmail: "kevin.m@email.com",
    category: "Youth Ministry",
    gender: "mixed",
    ageRange: "13-17",
    roles: [
      { name: "Games Leader", member: "Alex Turner" },
      { name: "Snack Coordinator", member: "Jessica Hall" },
    ],
    seasonLessons: [
      "Week 1: Identity in Christ",
      "Week 2: Peer Pressure",
      "Week 3: Social Media & Faith",
      "Week 4: Future & Calling",
    ],
    currentLesson: "Week 2: Peer Pressure",
    members: [
      { id: "m16", name: "Alex Turner", phone: "(555) 171-7171", email: "alex@email.com" },
      { id: "m17", name: "Jessica Hall", phone: "(555) 181-8181", email: "jessica@email.com" },
      { id: "m18", name: "Ryan Scott", phone: "(555) 191-9191", email: "ryan@email.com" },
      { id: "m19", name: "Mia Young", phone: "(555) 202-0202", email: "mia@email.com" },
    ],
    attendance: [{ date: "2024-01-06", presentIds: ["m16", "m17", "m18", "m19"] }],
    sermons: [],
  },
]

export const categories = [
  "All Categories",
  "Young Adults",
  "Men's Ministry",
  "Women's Ministry",
  "Senior Ministry",
  "Youth Ministry",
  "Family Ministry",
]

export const genderOptions = [
  { value: "all", label: "All Genders" },
  { value: "mixed", label: "Mixed" },
  { value: "men", label: "Men Only" },
  { value: "women", label: "Women Only" },
]

export const ageRanges = ["All Ages", "13-17", "18-30", "30-50", "40-60", "65+"]
