import { Campaign, Community, Participant } from "./types";

export const CAMPAIGN: Campaign = {
  id: "heartwalk2026",
  name: "heartwalk2026",
  title: "Team India Heart Walk 2026",
  date: "2026-09-26",
  teamName: "Team India",
  tagline: "One Team. One Heart.",
  registrationOpen: true,
  donationUrl: "#",
};

export const COMMUNITIES: Community[] = [
  { id: "gujarati", name: "Gujarati Community", active: true, displayOrder: 1 },
  { id: "bengali", name: "Bengali Community", active: true, displayOrder: 2 },
  { id: "punjabi", name: "Punjabi Community", active: true, displayOrder: 3 },
  { id: "telugu", name: "Telugu Community", active: true, displayOrder: 4 },
  { id: "tamil", name: "Tamil Community", active: true, displayOrder: 5 },
  { id: "marathi", name: "Marathi Community", active: true, displayOrder: 6 },
  { id: "kerala", name: "Kerala Community", active: true, displayOrder: 7 },
  { id: "kannada", name: "Kannada Community", active: true, displayOrder: 8 },
  { id: "other", name: "Other", active: true, displayOrder: 99 },
];

const names: [string, string, string][] = [
  ["AJ", "Jindal", "gujarati"],
  ["Meena", "Patel", "gujarati"],
  ["Raj", "Shah", "gujarati"],
  ["Priya", "Mehta", "gujarati"],
  ["Amit", "Desai", "gujarati"],
  ["Ananya", "Roy", "bengali"],
  ["Arjun", "Basu", "bengali"],
  ["Suman", "Das", "bengali"],
  ["Riya", "Ghosh", "bengali"],
  ["Harpreet", "Singh", "punjabi"],
  ["Simran", "Kaur", "punjabi"],
  ["Gurpreet", "Sandhu", "punjabi"],
  ["Ravi", "Reddy", "telugu"],
  ["Sita", "Rao", "telugu"],
  ["Kiran", "Kumar", "telugu"],
  ["Lakshmi", "Iyer", "tamil"],
  ["Anand", "Krishnan", "tamil"],
  ["Vikram", "Pillai", "tamil"],
  ["Sanjay", "Joshi", "marathi"],
  ["Neha", "Kulkarni", "marathi"],
  ["Divya", "Nair", "kerala"],
  ["Manoj", "Menon", "kerala"],
  ["Pooja", "Gowda", "kannada"],
  ["Deepak", "Shetty", "kannada"],
  ["John", "Mathew", "other"],
  ["Sarah", "Thomas", "other"],
];

const dedications = [
  "Walking for a healthier community",
  "In memory of my father",
  "For a stronger heart, for everyone",
  "Supporting all affected by heart disease",
  "Walking together, one heart at a time",
  undefined,
  undefined,
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRandom(42);

export const PARTICIPANTS: Participant[] = names.map(([firstName, lastName, communityId], i) => {
  const r = rand();
  const participationType = r < 0.4 ? "walking" : r < 0.7 ? "both" : "pledging";
  const pledgeAmount =
    participationType === "walking" ? 0 : Math.round((25 + rand() * 475) / 5) * 5;
  return {
    id: `p${i + 1}`,
    firstName,
    lastName,
    displayName: firstName,
    displayNameMode: "first",
    email: `${firstName.toLowerCase()}@example.com`,
    phone: `+1 555 01${String(i).padStart(2, "0")}`,
    participationType,
    communityId,
    pledgeAmount,
    dedication: dedications[i % dedications.length],
    heartVisible: true,
    approved: true,
    paymentStatus: pledgeAmount > 0 ? "pledged" : "unknown",
    createdAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString(),
  };
});
