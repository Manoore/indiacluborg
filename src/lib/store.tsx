"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { CAMPAIGN, COMMUNITIES, PARTICIPANTS } from "./mock-data";
import { Campaign, Community, CommunityStats, Participant } from "./types";

const STORAGE_KEY = "heartwalk_participants_v1";

interface DataContextValue {
  campaign: Campaign;
  communities: Community[];
  participants: Participant[];
  addParticipant: (p: Omit<Participant, "id" | "createdAt" | "approved">) => Participant;
  communityStats: CommunityStats[];
  totals: { hearts: number; walkers: number; pledged: number };
  getCommunity: (id: string) => Community | undefined;
  lastAdded: Participant | null;
}

const DataContext = createContext<DataContextValue | null>(null);

function loadExtra(): Participant[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Participant[]) : [];
  } catch {
    return [];
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [extra, setExtra] = useState<Participant[]>([]);
  const [lastAdded, setLastAdded] = useState<Participant | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setExtra(loadExtra());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(extra));
  }, [extra, hydrated]);

  const participants = useMemo(() => [...PARTICIPANTS, ...extra], [extra]);

  const addParticipant: DataContextValue["addParticipant"] = (p) => {
    const newP: Participant = {
      ...p,
      id: `local-${Date.now()}`,
      approved: true,
      createdAt: new Date().toISOString(),
    };
    setExtra((prev) => [...prev, newP]);
    setLastAdded(newP);
    return newP;
  };

  const communityStats: CommunityStats[] = useMemo(() => {
    return COMMUNITIES.filter((c) => c.id !== "other" || participants.some((p) => p.communityId === "other"))
      .map((c) => {
        const members = participants.filter((p) => p.communityId === c.id && p.heartVisible);
        return {
          communityId: c.id,
          communityName: c.name,
          hearts: members.length,
          walkers: members.filter((p) => p.participationType === "walking" || p.participationType === "both")
            .length,
          pledged: members.reduce((sum, p) => sum + (p.pledgeAmount || 0), 0),
        };
      })
      .sort((a, b) => b.hearts - a.hearts);
  }, [participants]);

  const totals = useMemo(
    () => ({
      hearts: participants.filter((p) => p.heartVisible).length,
      walkers: participants.filter(
        (p) => (p.participationType === "walking" || p.participationType === "both") && p.heartVisible
      ).length,
      pledged: participants.reduce((sum, p) => sum + (p.pledgeAmount || 0), 0),
    }),
    [participants]
  );

  const getCommunity = (id: string) => COMMUNITIES.find((c) => c.id === id);

  return (
    <DataContext.Provider
      value={{
        campaign: CAMPAIGN,
        communities: COMMUNITIES,
        participants,
        addParticipant,
        communityStats,
        totals,
        getCommunity,
        lastAdded,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
