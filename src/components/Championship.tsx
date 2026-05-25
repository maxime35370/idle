import { useGameStore } from '../store/gameStore';
import type { ChampionshipTier } from '../types/game';

const TIER_LABELS: Record<ChampionshipTier, string> = {
  regional: '🏘️ Régional',
  national: '🏟️ National',
  euroRX: '🇪🇺 Euro RX',
  worldRX: '🌍 World RX',
  title: '🏆 Titre Mondial',
};

const REQ_REP: Record<ChampionshipTier, number> = {
  regional: 0,
  national: 100,
  euroRX: 400,
  worldRX: 1000,
  title: 3000,
};

export default function Championship() {
  const currentChampionship = useGameStore((s) => s.currentChampionship);
  const unlockedChampionships = useGameStore((s) => s.unlockedChampionships);
  const standings = useGameStore((s) => s.championshipStandings);
  const reputation = useGameStore((s) => s.reputation);
  const selectChampionship = useGameStore((s) => s.selectChampionship);
  const seasonNumber = useGameStore((s) => s.seasonNumber);

  const tiers: ChampionshipTier[] = ['regional', 'national', 'euroRX', 'worldRX', 'title'];

  return (
    <div className="card">
      <h2>🏆 Championnat</h2>
      <div className="champ-selector">
        {tiers.map((tier) => {
          const unlocked = unlockedChampionships.includes(tier);
          const req = REQ_REP[tier];
          return (
            <button
              key={tier}
              className={`champ-btn ${currentChampionship === tier ? 'active' : ''} ${!unlocked ? 'locked' : ''}`}
              onClick={() => unlocked && selectChampionship(tier)}
              title={unlocked ? '' : `Réputation requise : ${req}`}
            >
              {!unlocked ? '🔒 ' : ''}{TIER_LABELS[tier]}
              {!unlocked && <span className="lock-req"> ({req} rep)</span>}
            </button>
          );
        })}
      </div>
      <div className="season-info">Saison {seasonNumber} • Réputation : {reputation}</div>

      {standings.length > 0 && (
        <div className="standings">
          <h3>Classement général</h3>
          <table className="results-table">
            <thead>
              <tr><th>Pos.</th><th>Pilote</th><th>Points</th></tr>
            </thead>
            <tbody>
              {standings.map((s, i) => (
                <tr key={s.driverName} className={s.isPlayer ? 'player-row' : ''}>
                  <td>{i + 1}</td>
                  <td>{s.driverName}</td>
                  <td>{s.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {standings.length === 0 && (
        <p className="no-standings">Lance ta première manche pour voir le classement.</p>
      )}
    </div>
  );
}
