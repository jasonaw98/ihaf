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
    icon: "table",
    title: "Long tables",
    body: "Dinner with the seats shuffled. You learn someone’s name before you learn what they do.",
    tone: "bg-butter text-ink",
  },
  {
    icon: "games",
    title: "Game nights",
    body: "Cards, boards, and just enough competition to skip the weather talk.",
    tone: "bg-sage text-ink",
  },
  {
    icon: "walk",
    title: "City walks",
    body: "A loose route through KL and a hard stop for drinks. Moving makes the first hello easier.",
    tone: "bg-blush text-ink",
  },
  {
    icon: "coffee",
    title: "Kopitiam mornings",
    body: "Slow coffee, an open chair, and nowhere you have to be for a while.",
    tone: "bg-accent text-accent-foreground",
  },
  {
    icon: "music",
    title: "Night-out crews",
    body: "Karaoke, rooftops. Arrive alone. Leave in a group chat.",
    tone: "bg-secondary text-secondary-foreground",
  },
  {
    icon: "make",
    title: "Make-something days",
    body: "Workshops where your hands stay busy, so the conversation can take its time.",
    tone: "bg-primary/12 text-primary",
  },
] as const;

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
