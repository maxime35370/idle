import { useGameStore } from '../store/gameStore';

const STAT_ICONS: Record<string, string> = {
  engine: '🔧',
  aero: '🌬️',
  transmission: '⚙️',
  suspension: '🔩',
  tires: '🔄',
  driver: '🧑‍✈️',
};

const STAT_LABELS: Record<string, string> = {
  engine: 'Moteur',
  aero: 'Aéro',
  transmission: 'Transmission',
  suspension: 'Suspension',
  tires: 'Pneus',
  driver: 'Pilote',
};

export default function Shop() {
  const money = useGameStore((s) => s.money);
  const upgrades = useGameStore((s) => s.upgrades);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);

  return (
    <div className="card">
      <h2>🛒 Atelier</h2>
      <div className="shop-grid">
        {upgrades.map((u) => {
          const cost = u.cost * (u.level + 1);
          const maxed = u.level >= u.maxLevel;
          const canAfford = money >= cost;
          return (
            <div key={u.id} className={`upgrade-card ${maxed ? 'maxed' : ''}`}>
              <div className="upgrade-header">
                <span className="upgrade-icon">{STAT_ICONS[u.stat]}</span>
                <div>
                  <div className="upgrade-name">{u.name}</div>
                  <div className="upgrade-desc">{u.description}</div>
                </div>
              </div>
              <div className="upgrade-footer">
                <div className="upgrade-meta">
                  <span className="stat-tag">{STAT_LABELS[u.stat]} +{u.bonus}</span>
                  <span className="level-dots">
                    {Array.from({ length: u.maxLevel }).map((_, i) => (
                      <span key={i} className={`dot ${i < u.level ? 'filled' : ''}`} />
                    ))}
                  </span>
                </div>
                <button
                  className={`btn-buy ${!canAfford || maxed ? 'disabled' : ''}`}
                  onClick={() => buyUpgrade(u.id)}
                  disabled={!canAfford || maxed}
                >
                  {maxed ? 'MAX' : `${cost.toLocaleString()} €`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
