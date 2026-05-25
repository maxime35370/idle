import type { CarStats, Circuit, OpponentDriver, DriverStyle } from '../types/game';

const WEEKEND_POINTS = [25, 18, 15, 12, 8, 6, 2, 0];
const WEEKEND_EARNINGS = [2500, 1800, 1400, 1100, 700, 500, 250, 100];

interface Competitor {
  name: string;
  isPlayer: boolean;
  car?: CarStats;
  strength?: number;
  style?: DriverStyle;
}

function calcScore(c: Competitor, circuit: Circuit, prestigeBonus: number): number {
  if (c.isPlayer && c.car) {
    const raw =
      c.car.engine * circuit.modifiers.engine +
      c.car.aero * circuit.modifiers.aero +
      c.car.suspension * circuit.modifiers.suspension +
      c.car.tires * circuit.modifiers.tires +
      c.car.driver +
      c.car.transmission * 0.8;
    const normalized = raw / 6;
    return Math.round(normalized * (0.85 + Math.random() * 0.3) + prestigeBonus);
  }
  if (c.strength != null && c.style) {
    let base = c.strength;
    if (c.style === 'aggressive') base *= circuit.surface === 'dirt' ? 1.05 : 0.95;
    else if (c.style === 'technical') base *= circuit.surface === 'asphalt' ? 1.08 : 0.92;
    return Math.round(base * (0.88 + Math.random() * 0.24));
  }
  return 0;
}

export interface PhaseRun {
  name: string;
  isPlayer: boolean;
  score: number;
  position: number;
}

function runPhase(
  competitors: Competitor[],
  circuit: Circuit,
  prestigeBonus: number
): PhaseRun[] {
  const results: PhaseRun[] = competitors.map((c) => ({
    name: c.name,
    isPlayer: c.isPlayer,
    score: calcScore(c, circuit, prestigeBonus),
    position: 0,
  }));
  results.sort((a, b) => b.score - a.score);
  results.forEach((r, i) => {
    r.position = i + 1;
  });
  return results;
}

export interface DriverOutcome {
  name: string;
  isPlayer: boolean;
  qualifsCumul: number;
  qualifsRank: number;
  semiPosition: number | null;
  finalPosition: number | null;
  overallPosition: number;
  pointsScored: number;
  earnings: number;
}

export interface CumulEntry {
  name: string;
  isPlayer: boolean;
  cumul: number;
  rank: number;
  advance: boolean;
}

export interface WeekendResult {
  circuit: Circuit;
  q1: PhaseRun[];
  q2: PhaseRun[];
  cumul: CumulEntry[];
  semi: PhaseRun[];
  final: PhaseRun[];
  outcomes: DriverOutcome[];
  playerOutcome: DriverOutcome;
}

export function simulateWeekend(
  car: CarStats,
  circuit: Circuit,
  opponents: OpponentDriver[],
  prestigeBonus: number
): WeekendResult {
  const competitors: Competitor[] = [
    { name: 'Vous', isPlayer: true, car },
    ...opponents.map((o) => ({
      name: `${o.nationality} ${o.name}`,
      isPlayer: false,
      strength: o.strength,
      style: o.style,
    })),
  ];

  const q1 = runPhase(competitors, circuit, prestigeBonus);
  const q2 = runPhase(competitors, circuit, prestigeBonus);

  const cumulMap = new Map<string, { name: string; isPlayer: boolean; cumul: number }>();
  q1.forEach((r) => cumulMap.set(r.name, { name: r.name, isPlayer: r.isPlayer, cumul: r.position }));
  q2.forEach((r) => {
    const existing = cumulMap.get(r.name)!;
    existing.cumul += r.position;
  });

  const cumul: CumulEntry[] = Array.from(cumulMap.values())
    .sort((a, b) => a.cumul - b.cumul)
    .map((c, i) => ({ ...c, rank: i + 1, advance: i < 6 }));

  const semiCompetitors = competitors.filter((c) =>
    cumul.slice(0, 6).some((q) => q.name === c.name)
  );
  const semi = runPhase(semiCompetitors, circuit, prestigeBonus);

  const finalNames = semi.slice(0, 4).map((r) => r.name);
  const finalCompetitors = competitors.filter((c) => finalNames.includes(c.name));
  const final = runPhase(finalCompetitors, circuit, prestigeBonus);

  const outcomes: DriverOutcome[] = competitors.map((c) => {
    const cumulEntry = cumul.find((q) => q.name === c.name)!;
    const semiResult = semi.find((r) => r.name === c.name);
    const finalResult = final.find((r) => r.name === c.name);

    let overallPosition: number;
    if (finalResult) {
      overallPosition = finalResult.position;
    } else if (semiResult) {
      overallPosition = 4 + (semiResult.position - 4);
    } else {
      overallPosition = cumulEntry.rank;
    }

    return {
      name: c.name,
      isPlayer: c.isPlayer,
      qualifsCumul: cumulEntry.cumul,
      qualifsRank: cumulEntry.rank,
      semiPosition: semiResult?.position ?? null,
      finalPosition: finalResult?.position ?? null,
      overallPosition,
      pointsScored: WEEKEND_POINTS[overallPosition - 1] ?? 0,
      earnings: WEEKEND_EARNINGS[overallPosition - 1] ?? 0,
    };
  });

  const playerOutcome = outcomes.find((o) => o.isPlayer)!;

  return { circuit, q1, q2, cumul, semi, final, outcomes, playerOutcome };
}
