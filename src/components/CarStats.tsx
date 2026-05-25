import { useGameStore } from '../store/gameStore';

const STAT_LABELS: Record<string, string> = {
  engine: 'Moteur',
  aero: 'Aérodynamisme',
  transmission: 'Transmission',
  suspension: 'Suspension',
  tires: 'Pneus',
  driver: 'Pilote',
};

const STAT_COLORS: Record<string, string> = {
  engine: '#e74c3c',
  aero: '#3498db',
  transmission: '#9b59b6',
  suspension: '#f39c12',
  tires: '#1abc9c',
  driver: '#2ecc71',
};

export default function CarStats() {
  const car = useGameStore((s) => s.car);
  const prestige = useGameStore((s) => s.prestige);
  const maxStat = 600;

  return (
    <div className="card">
      <h2>🚗 Votre Voiture</h2>
      <div className="stats-grid">
        {(Object.entries(car) as [string, number][]).map(([stat, value]) => (
          <div key={stat} className="stat-row">
            <div className="stat-label">{STAT_LABELS[stat]}</div>
            <div className="stat-bar-container">
              <div
                className="stat-bar"
                style={{
                  width: `${Math.min(100, (value / maxStat) * 100)}%`,
                  backgroundColor: STAT_COLORS[stat],
                }}
              />
            </div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>
      {(prestige.regulationKnowledge > 0 || prestige.teamMorale > 0) && (
        <div className="prestige-info">
          <span>📋 Règlements +{prestige.regulationKnowledge}</span>
          <span>💪 Moral +{prestige.teamMorale}</span>
        </div>
      )}
    </div>
  );
}
