import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, ChampionshipTier, Round } from '../types/game';
import { CIRCUITS } from '../data/circuits';
import {
  REGIONAL_DRIVERS,
  NATIONAL_DRIVERS,
  EURORX_DRIVERS,
  WORLDRX_DRIVERS,
  TITLE_DRIVERS,
} from '../data/drivers';
import { BASE_UPGRADES } from '../data/upgrades';
import { simulateRace } from '../engine/race';

const CHAMPIONSHIP_CONFIG: Record<
  ChampionshipTier,
  { name: string; requiredRep: number; circuits: string[]; drivers: typeof REGIONAL_DRIVERS }
> = {
  regional: {
    name: 'Championnat Régional',
    requiredRep: 0,
    circuits: ['helmond', 'mettet', 'lohéac', 'montalegre', 'höljes'],
    drivers: REGIONAL_DRIVERS,
  },
  national: {
    name: 'Championnat National',
    requiredRep: 100,
    circuits: ['höljes', 'trois_rivieres', 'lohéac', 'mettet', 'helmond', 'montalegre'],
    drivers: NATIONAL_DRIVERS,
  },
  euroRX: {
    name: 'Euro RX Challengers',
    requiredRep: 400,
    circuits: ['barcelona', 'höljes', 'silverstone', 'mettet', 'montalegre', 'lohéac', 'helmond', 'trois_rivieres'],
    drivers: EURORX_DRIVERS,
  },
  worldRX: {
    name: 'World RX',
    requiredRep: 1000,
    circuits: ['silverstone', 'höljes', 'trois_rivieres', 'barcelona', 'montalegre', 'lohéac', 'mettet', 'helmond', 'barcelona', 'höljes'],
    drivers: WORLDRX_DRIVERS,
  },
  title: {
    name: 'Bataille pour le Titre',
    requiredRep: 3000,
    circuits: [...CIRCUITS.map((c) => c.id), 'höljes', 'lohéac', 'silverstone', 'montalegre'],
    drivers: TITLE_DRIVERS,
  },
};

function buildRounds(tier: ChampionshipTier): Round[] {
  const config = CHAMPIONSHIP_CONFIG[tier];
  return config.circuits.map((cid) => ({
    circuit: CIRCUITS.find((c) => c.id === cid)!,
    completed: false,
    playerPosition: null,
    results: [],
  }));
}

function initialState(): Omit<GameState, 'phase' | 'lastTickTime'> {
  return {
    money: 1000,
    reputation: 0,
    prestigeTokens: 0,
    car: { engine: 110, aero: 85, transmission: 100, suspension: 90, tires: 80, driver: 100 },
    upgrades: BASE_UPGRADES.map((u) => ({ ...u })),
    currentChampionship: 'regional',
    currentRoundIndex: 0,
    seasonNumber: 1,
    championshipStandings: [],
    prestige: { regulationKnowledge: 0, teamMorale: 0, sponsorBonus: 0 },
    unlockedChampionships: ['regional'],
    passiveIncome: 50,
  };
}

interface GameActions {
  raceNextRound: () => void;
  buyUpgrade: (upgradeId: string) => void;
  endSeason: () => void;
  restartSeason: () => void;
  selectChampionship: (tier: ChampionshipTier) => void;
  tick: () => void;
}

type Store = GameState & {
  rounds: Round[];
} & GameActions;

export const useGameStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState(),
      phase: 'idle' as const,
      lastTickTime: Date.now(),
      rounds: buildRounds('regional'),

      raceNextRound() {
        const state = get();
        if (state.phase === 'racing') return;
        const { rounds, currentRoundIndex, car, prestige } = state;
        if (currentRoundIndex >= rounds.length) return;

        const round = rounds[currentRoundIndex];
        const config = CHAMPIONSHIP_CONFIG[state.currentChampionship];
        const prestigeBonus =
          prestige.regulationKnowledge * 3 + prestige.teamMorale * 2;

        const results = simulateRace(car, round.circuit, config.drivers, prestigeBonus);
        const playerResult = results.find((r) => r.isPlayer)!;

        const updatedRounds = rounds.map((r, i) =>
          i === currentRoundIndex
            ? { ...r, completed: true, playerPosition: playerResult.position, results }
            : r
        );

        const prevStandings = state.championshipStandings.length
          ? state.championshipStandings
          : [
              { driverName: 'Vous', points: 0, isPlayer: true },
              ...config.drivers.map((d) => ({ driverName: d.name, points: 0, isPlayer: false })),
            ];

        const updatedStandings = prevStandings.map((s) => {
          if (s.isPlayer) return { ...s, points: s.points + playerResult.points };
          const opponentResult = results.find((r) => r.driverName.includes(s.driverName));
          return { ...s, points: s.points + (opponentResult?.points ?? 0) };
        });
        updatedStandings.sort((a, b) => b.points - a.points);

        const isLastRound = currentRoundIndex + 1 >= rounds.length;
        const repGain = Math.max(0, (config.drivers.length - playerResult.position + 1) * 5);

        set({
          phase: isLastRound ? 'seasonEnd' : 'idle',
          money: state.money + playerResult.earnings,
          reputation: state.reputation + repGain,
          rounds: updatedRounds,
          currentRoundIndex: isLastRound ? currentRoundIndex : currentRoundIndex + 1,
          championshipStandings: updatedStandings,
        });
      },

      buyUpgrade(upgradeId) {
        const state = get();
        const upgrade = state.upgrades.find((u) => u.id === upgradeId);
        if (!upgrade || upgrade.level >= upgrade.maxLevel) return;
        if (state.money < upgrade.cost * (upgrade.level + 1)) return;

        const cost = upgrade.cost * (upgrade.level + 1);
        const updatedUpgrades = state.upgrades.map((u) =>
          u.id === upgradeId ? { ...u, level: u.level + 1 } : u
        );
        const updatedCar = { ...state.car };
        updatedCar[upgrade.stat] += upgrade.bonus;

        set({ money: state.money - cost, upgrades: updatedUpgrades, car: updatedCar });
      },

      endSeason() {
        const state = get();
        const standings = state.championshipStandings;
        const playerStanding = standings.find((s) => s.isPlayer);
        const playerPos = standings.findIndex((s) => s.isPlayer) + 1;

        const tokensEarned = Math.max(1, Math.floor((standings.length - playerPos + 1) * 1.5));
        const repGain = playerPos <= 3 ? 150 : playerPos <= 5 ? 80 : 30;

        const nextTiers: ChampionshipTier[] = ['regional', 'national', 'euroRX', 'worldRX', 'title'];
        const currentIdx = nextTiers.indexOf(state.currentChampionship);
        const newUnlocked = [...state.unlockedChampionships];

        if (playerPos <= 3 && currentIdx < nextTiers.length - 1) {
          const nextTier = nextTiers[currentIdx + 1];
          const nextConfig = CHAMPIONSHIP_CONFIG[nextTier];
          if (
            !newUnlocked.includes(nextTier) &&
            state.reputation + repGain >= nextConfig.requiredRep
          ) {
            newUnlocked.push(nextTier);
          }
        }

        set({
          prestigeTokens: state.prestigeTokens + tokensEarned,
          reputation: state.reputation + repGain,
          unlockedChampionships: newUnlocked,
          phase: 'idle',
          seasonNumber: state.seasonNumber + 1,
          currentRoundIndex: 0,
          championshipStandings: [],
          rounds: buildRounds(state.currentChampionship),
          passiveIncome: state.passiveIncome + 10,
          ...(playerStanding ? {} : {}),
        });
      },

      restartSeason() {
        const state = get();
        const tokensToSpend = state.prestigeTokens;

        const newPrestige = {
          regulationKnowledge: state.prestige.regulationKnowledge + Math.floor(tokensToSpend / 3),
          teamMorale: state.prestige.teamMorale + Math.floor(tokensToSpend / 4),
          sponsorBonus: state.prestige.sponsorBonus + Math.floor(tokensToSpend / 5),
        };

        set({
          ...initialState(),
          seasonNumber: state.seasonNumber + 1,
          reputation: Math.floor(state.reputation * 0.5),
          money: 1000 + newPrestige.sponsorBonus * 200,
          prestige: newPrestige,
          prestigeTokens: 0,
          unlockedChampionships: state.unlockedChampionships,
          phase: 'idle',
          lastTickTime: Date.now(),
          rounds: buildRounds(state.currentChampionship),
          currentChampionship: state.currentChampionship,
          passiveIncome: 50 + newPrestige.sponsorBonus * 5,
        });
      },

      selectChampionship(tier) {
        const state = get();
        if (!state.unlockedChampionships.includes(tier)) return;
        set({
          currentChampionship: tier,
          currentRoundIndex: 0,
          championshipStandings: [],
          rounds: buildRounds(tier),
          phase: 'idle',
        });
      },

      tick() {
        const state = get();
        const now = Date.now();
        const elapsed = (now - state.lastTickTime) / 1000;
        if (elapsed < 1) return;
        const earned = Math.floor(state.passiveIncome * elapsed);
        set({ money: state.money + earned, lastTickTime: now });
      },
    }),
    {
      name: 'rallycross-idle-save',
      version: 2,
    }
  )
);
