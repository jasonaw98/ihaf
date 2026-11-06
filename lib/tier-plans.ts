import type { CategoryKey } from "@/lib/content";

export type Benefit = { emoji: string; title: string; detail?: string };

export type Tier = {
  code: string;
  /** Display title (Chinese, as named by the hosts). */
  title: string;
  /** English gloss shown under the title. */
  english: string;
  /** Confirmed events in this category needed to reach the tier. */
  events: number;
  /** New friends brought along needed to reach the tier. */
  friends: number;
  benefits: Benefit[];
  /** Shown with a lock until the member reaches it. */
  locked?: boolean;
};

const freeDrink = (title: string): Benefit => ({
  emoji: "🍹",
  title,
  detail: "可用于任何 IHAF Drink 活动，无有效期限，随时可使用",
});

const discount = (percent: number, all = false): Benefit => ({
  emoji: "🍸",
  title: `${percent}% OFF`,
  detail: `${all ? "所有 " : ""}IHAF Official Events 享 ${percent}% 折扣`,
});

const rebate = (percent: number): Benefit => ({
  emoji: "👯",
  title: `${percent}% Instant Rebate`,
  detail: `带新朋友来 IHAF，各自可获得 ${percent}% OFF`,
});

const passport: Benefit = {
  emoji: "🎫",
  title: "IHAF Passport",
  detail: "获得专属 IHAF Passport，记录你的 IHAF 旅程",
};

const ihafPlus: Benefit = {
  emoji: "✨",
  title: "IHAF+ (Optional)",
  detail: "开放申请加入 IHAF+，解锁更多会员福利",
};

const merch = (rank: string): Benefit => ({
  emoji: "💎",
  title: "IHAF 专属周边",
  detail: `获得 IHAF 专属会员周边，代表你已经成为${rank}`,
});

const freeEvent = (kind: string): Benefit => ({
  emoji: "🎫",
  title: `FREE Official ${kind} Event`,
  detail: `享有 1 次免费 Official ${kind} Event`,
});

const monthlyEvent = (kind: string): Benefit => ({
  emoji: "🎫",
  title: `FREE Official ${kind} Event / Month`,
  detail: `每月享免费 Official ${kind} Event`,
});

const bellRing: Benefit = {
  emoji: "🔔",
  title: "FREE Bell Ring",
  detail: "享有 1 次免费摇铃机会",
};

const diamondGift: Benefit = {
  emoji: "🎁",
  title: "Diamond Member Gift",
  detail: "获得 1 份 Diamond Member 神秘礼物",
};

const stranger = (code: string): Tier => ({
  code,
  title: "陌生人",
  english: "Stranger",
  events: 0,
  friends: 0,
  benefits: [],
});

export const tierPlans: Record<CategoryKey, Tier[]> = {
  drinks: [
    stranger("D1"),
    {
      code: "D2",
      title: "微醺新人",
      english: "Tipsy Newbie",
      events: 1,
      friends: 0,
      benefits: [freeDrink("1 FREE Cocktail")],
    },
    {
      code: "D3",
      title: "酒鬼常客",
      english: "Bar Regular",
      events: 5,
      friends: 1,
      benefits: [discount(10), rebate(5), passport, ihafPlus],
    },
    {
      code: "D4",
      title: "高级酒鬼",
      english: "Seasoned Drinker",
      events: 12,
      friends: 3,
      locked: true,
      benefits: [
        discount(15),
        rebate(10),
        merch("高级酒鬼"),
        freeEvent("Drink"),
        bellRing,
      ],
    },
    {
      code: "D5",
      title: "IHAF 酒神",
      english: "God of Drinks",
      events: 24,
      friends: 5,
      locked: true,
      benefits: [
        discount(25),
        rebate(15),
        { emoji: "🔔", title: "50% OFF Bell Ring", detail: "每次摇铃半价" },
        monthlyEvent("Drink"),
        diamondGift,
      ],
    },
  ],
  sport: [
    stranger("S1"),
    {
      code: "S2",
      title: "运动搭子",
      english: "Sports Buddy",
      events: 1,
      friends: 0,
      benefits: [freeDrink("1 FREE Cocktail / Mocktail")],
    },
    {
      code: "S3",
      title: "运动常客",
      english: "Sports Regular",
      events: 10,
      friends: 1,
      benefits: [discount(5), rebate(5), passport, ihafPlus],
    },
    {
      code: "S4",
      title: "高级运动员",
      english: "Pro Athlete",
      events: 20,
      friends: 3,
      locked: true,
      benefits: [
        discount(10),
        rebate(10),
        merch("高级运动员"),
        freeEvent("Sport"),
        bellRing,
      ],
    },
    {
      code: "S5",
      title: "IHAF 王牌",
      english: "IHAF Ace",
      events: 30,
      friends: 5,
      locked: true,
      benefits: [discount(15), rebate(15), monthlyEvent("Drink"), diamondGift],
    },
  ],
  play: [
    stranger("P1"),
    {
      code: "P2",
      title: "好奇玩家",
      english: "Curious Player",
      events: 1,
      friends: 0,
      benefits: [freeDrink("1 FREE Cocktail / Mocktail")],
    },
    {
      code: "P3",
      title: "玩乐常客",
      english: "Play Regular",
      events: 8,
      friends: 1,
      benefits: [discount(5), rebate(5), passport, ihafPlus],
    },
    {
      code: "P4",
      title: "高级玩家",
      english: "Pro Player",
      events: 15,
      friends: 3,
      locked: true,
      benefits: [
        discount(10),
        rebate(10),
        merch("高级玩家"),
        freeEvent("Play"),
        bellRing,
      ],
    },
    {
      code: "P5",
      title: "IHAF 玩咖",
      english: "IHAF Playmaker",
      events: 28,
      friends: 5,
      locked: true,
      benefits: [discount(15), rebate(15), monthlyEvent("Drink"), diamondGift],
    },
  ],
};

export type Activity = { en: string; zh?: string };

export const categoryPages: Record<
  CategoryKey,
  {
    tagline: string;
    intro: string;
    activitiesLabel: string;
    activities: Activity[];
    comingSoon: Activity[];
  }
> = {
  drinks: {
    tagline: "One round in, everyone’s a friend.",
    intro:
      "Social drinks, themed parties, and wine tastings around KL. A host keeps the table moving, so nobody is left nursing a glass alone in a corner.",
    activitiesLabel: "What a night looks like",
    activities: [
      { en: "Social Drinks" },
      { en: "Themed Parties" },
      { en: "Wine Tasting" },
    ],
    comingSoon: [],
  },
  sport: {
    tagline: "Sweat first. Small talk comes easy after.",
    intro:
      "Rallies, climbs, and long runs with people who are just as new to it as you. Moving together breaks the ice faster than any introduction.",
    activitiesLabel: "What we’ve played",
    activities: [
      { en: "Badminton", zh: "羽球" },
      { en: "Pickleball", zh: "匹克球" },
      { en: "Bouldering", zh: "攀岩" },
      { en: "Hiking", zh: "爬山" },
      { en: "Paintball" },
      { en: "Pilates" },
      { en: "Marathon", zh: "马拉松" },
    ],
    comingSoon: [],
  },
  play: {
    tagline: "Play is the shortcut to friendship.",
    intro:
      "Board games, escape rooms, camping trips, and dinners that turn strangers into teammates. Low pressure, lots of laughing, always something to do with your hands.",
    activitiesLabel: "What we’ve hosted",
    activities: [
      { en: "Dinner Exchange", zh: "交换晚餐" },
      { en: "Escape Rooms", zh: "密室逃脱" },
      { en: "Board Games", zh: "桌游" },
      { en: "Blind-box Hotpot", zh: "盲盒火锅" },
      { en: "Go-Kart" },
      { en: "Camping", zh: "露营" },
      { en: "Nintendo Nights" },
    ],
    comingSoon: [
      { en: "Book Club", zh: "读书会" },
      { en: "Movie Night" },
      { en: "Mixology", zh: "调酒" },
    ],
  },
};

export type PlusPlan = { months: number; price: number; perMonth: number };

/** Prices in RM. */
export const ihafPlusPlans: PlusPlan[] = [
  { months: 3, price: 264, perMonth: 88 },
  { months: 6, price: 388, perMonth: 64.67 },
  { months: 12, price: 688, perMonth: 57.33 },
];

export const ihafPlusBenefits: Benefit[] = [
  { emoji: "🎁", title: "Double perks", detail: "所有的优惠 x2" },
  { emoji: "🔔", title: "50% OFF Bell Ring", detail: "摇铃半价" },
  {
    emoji: "⏩",
    title: "Priority booking",
    detail: "Reserve 活动 / 大活动优先排队",
  },
  { emoji: "🌠", title: "One wish", detail: "许愿一次" },
];
