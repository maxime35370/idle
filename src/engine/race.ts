import type { CarStats, Circuit, OpponentDriver, RaceResult } from '../types/game';

const POINTS_TABLE = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1, 0, 0, 0, 0, 0, 0];
const EARNINGS_BASE = [2000, 1400, 1100, 900, 700, 500, 350, 200];

function calcPlayerScore(car: CarStats, circuit: Circuit, prestigeBonus: number): number {
  const raw =
    car.engine * circuit.modifiers.engine +
    car.aero * circuit.modifiers.aero +
    car.suspension * circuit.modifiers.suspension +
    car.tires * circuit.modifiers.tires +
    car.driver +
    car.transmission * 0.8;

  const normalized = raw / 6;
  const variance = normalized * (0.85 + Math.random() * 0.3);
  return Math.round(variance + prestigeBonus);
}

function calcOpponentScore(driver: OpponentDriver, circuit: Circuit): number {
  let base = driver.strength;

  switch (driver.style) {
    case 'aggressive':
      base *= circuit.surface === 'dirt' ? 1.05 : 0.95;
      break;
    case 'technical':
      base *= circuit.surface === 'asphalt' ? 1.08 : 0.92;
      break;
    case 'consistent':
      break;
  }

  return Math.round(base * (0.88 + Math.random() * 0.24));
}

export function simulateRace(
  car: CarStats,
  circuit: Circuit,
  opponents: OpponentDriver[],
  prestigeBonus: number
): RaceResult[] {
  const playerScore = calcPlayerScore(car, circuit, prestigeBonus);

  const results: RaceResult[] = [
    {
      driverName: 'Vous',
      isPlayer: true,
      score: playerScore,
      position: 0,
      points: 0,
      earnings: 0,
    },
    ...opponents.map((opp) => ({
      driverName: `${opp.nationality} ${opp.name}`,
      isPlayer: false,
      score: calcOpponentScore(opp, circuit),
      position: 0,
      points: 0,
      earnings: 0,
    })),
  ];

  results.sort((a, b) => b.score - a.score);
  results.forEach((r, i) => {
    r.position = i + 1;
    r.points = POINTS_TABLE[i] ?? 0;
    r.earnings = r.isPlayer ? (EARNINGS_BASE[i] ?? 100) : 0;
  });

  return results;
}
