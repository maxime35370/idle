import { useGameStore } from '../store/gameStore';

export default function RaceView() {
  const rounds = useGameStore((s) => s.rounds);
  const currentRoundIndex = useGameStore((s) => s.currentRoundIndex);
  const phase = useGameStore((s) => s.phase);
  const raceNextRound = useGameStore((s) => s.raceNextRound);

  const lastCompletedRound = rounds.filter((r) => r.completed).at(-1);
  const nextRound = phase !== 'seasonEnd' ? rounds[currentRoundIndex] : null;

  return (
    <div className="card">
      <h2>🏁 Course</h2>

      {nextRound && (
        <div className="next-race">
          <div className="circuit-info">
            <span className="circuit-flag">{nextRound.circuit.country}</span>
            <span className="circuit-name">{nextRound.circuit.name}</span>
            <span className={`surface-badge surface-${nextRound.circuit.surface}`}>
              {nextRound.circuit.surface === 'dirt' ? 'Terre' : nextRound.circuit.surface === 'asphalt' ? 'Asphalte' : 'Mixte'}
            </span>
          </div>
          <div className="circuit-modifiers">
            {Object.entries(nextRound.circuit.modifiers).map(([k, v]) => (
              <span key={k} className={`mod ${v > 1 ? 'mod-high' : v < 1 ? 'mod-low' : ''}`}>
                {k === 'engine' ? 'Moteur' : k === 'aero' ? 'Aéro' : k === 'suspension' ? 'Suspensions' : 'Pneus'} ×{v.toFixed(1)}
              </span>
            ))}
          </div>
          <button className="btn-race" onClick={raceNextRound} disabled={phase === 'seasonEnd'}>
            🏎️ Lancer la manche
          </button>
        </div>
      )}

      {phase === 'seasonEnd' && (
        <div className="season-end-notice">
          ✅ Saison terminée — consultez le classement
        </div>
      )}

      {lastCompletedRound && (
        <div className="last-results">
          <h3>Dernière manche — {lastCompletedRound.circuit.name}</h3>
          <table className="results-table">
            <thead>
              <tr>
                <th>Pos.</th>
                <th>Pilote</th>
                <th>Score</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {lastCompletedRound.results.slice(0, 8).map((r) => (
                <tr key={r.driverName} className={r.isPlayer ? 'player-row' : ''}>
                  <td>{r.position}</td>
                  <td>{r.driverName}</td>
                  <td>{r.score}</td>
                  <td>{r.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounds-progress">
        {rounds.map((r, i) => (
          <div
            key={`${r.circuit.id}-${i}`}
            className={`round-dot ${r.completed ? 'done' : ''} ${i === currentRoundIndex && phase !== 'seasonEnd' ? 'current' : ''}`}
            title={r.circuit.name}
          >
            {r.completed && r.playerPosition !== null ? `P${r.playerPosition}` : i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
