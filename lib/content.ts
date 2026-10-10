export const INSTAGRAM_URL = "https://www.instagram.com/ihaveafriend_ihaf/";
export const INSTAGRAM_HANDLE = "@ihaveafriend_ihaf";

export const navLinks = [
  { href: "/events", label: "Events" },
  { href: "/#gatherings", label: "Gatherings" },
  { href: "/#questions", label: "Questions" },
  { href: "/about", label: "About Us" },
] as const;

export const ticker = [
  "Long tables",
  "Game nights",
  "City walks",
  "Karaoke crews",
  "Workshops",
  "Rooftop hangs",
  "New faces",
  "Same warmth",
] as const;

export const stats = [
  { value: 300, suffix: "+", label: "offline gatherings hosted" },
  { value: 3000, suffix: "+", label: "people who showed up" },
  { value: 13, suffix: "k", label: "following along" },
  { value: 100, suffix: "k", label: "likes, shares, and tags" },
] as const;

export const gatherings = [
  {
    key: "sport",
    label: "Sport",
    icon: "volleyball",
    title: "IHAF SPORT",
    body: "Pickleball, Badminton, Running, Hiking, Bouldering & More.",
    tone: "bg-butter text-ink",
    image: "/sport.png",
  },
  {
    key: "drinks",
    label: "Drinks",
    icon: "martini",
    title: "IHAF DRINKS",
    body: "Social Drinks, Themed Parties, Wine Tasting & More.",
    tone: "bg-blush text-ink",
    image: "/drinks.png",
  },
  {
    key: "play",
    label: "Play",
    icon: "games",
    title: "IHAF PLAY",
    body: "Board Games, Escape Rooms, Movie Nights, Book Clubs, Camping, Outdoor Activities, Foodie Activities & More.",
    tone: "bg-sage text-ink",
    image: "/play.png",
  },
] as const;

export type CategoryKey = (typeof gatherings)[number]["key"];

/**
 * Tier ladders per category. `from` is how many past events in that
 * category a member needs to reach the tier. The first tier must start at 0.
 */
export const tierPlans: Record<
  CategoryKey,
  readonly { name: string; from: number }[]
> = {
  sport: [
    { name: "Rookie", from: 0 },
    { name: "Teammate", from: 3 },
    { name: "Captain", from: 8 },
    { name: "MVP", from: 15 },
  ],
  drinks: [
    { name: "First Round", from: 0 },
    { name: "Regular", from: 3 },
    { name: "Bar Buddy", from: 8 },
    { name: "Toastmaster", from: 15 },
  ],
  play: [
    { name: "Newbie", from: 0 },
    { name: "Player", from: 3 },
    { name: "Game Master", from: 8 },
    { name: "Grandmaster", from: 15 },
  ],
};

export const reasons = [
  {
    title: "There’s a host",
    body: "Someone is responsible for the room, so you’re not left networking in a corner with a warm drink.",
  },
  {
    title: "Small on purpose",
    body: "Gatherings stay close enough that names stick and no one disappears into a crowd.",
  },
  {
    title: "Made for regulars",
    body: "One good night is a start. The community is the people who come back.",
  },
] as const;

export const faqs = [
  {
    q: "Do I have to bring a friend?",
    a: "No. Coming alone is the point. The seat next to you is for someone you haven’t met yet.",
  },
  {
    q: "Who shows up?",
    a: "Young adults around Kuala Lumpur. People new to the city, between friend groups, or simply ready for a bigger table.",
  },
  {
    q: "What actually happens?",
    a: "A hosted plan: a table, a game, a walk, or a night out. Enough structure that the first hello isn’t entirely on you.",
  },
  {
    q: "Is this for dating?",
    a: "The invitation is friendship. People are people, but the night is built for making friends, not matching.",
  },
  {
    q: "What if I’m shy?",
    a: "You don’t have to perform. A host, a seat, and a small group do a lot of the work. Showing up is the brave part.",
  },
  {
    q: "How do I join a gathering?",
    a: "Pick an event on the events page and save your seat with a free account. New dates are announced on @ihaveafriend_ihaf too.",
  },
] as const;
