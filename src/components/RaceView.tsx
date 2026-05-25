import { useGameStore } from '../store/gameStore';
import type { PhaseRun, CumulEntry } from '../engine/weekend';

function PhaseTable({ title, results, highlight }: { title: string; results: PhaseRun[]; highlight?: number }) {
  return (
    <div className="phase-block">
      <h4 className="phase-title">{title}</h4>
      <table className="results-table">
        <thead>
          <tr><th>#</th><th>Pilote</th><th>Score</th></tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.name} className={`${r.isPlayer ? 'player-row' : ''} ${highlight && r.position <= highlight ? 'qualified-row' : ''}`}>
              <td>{r.position}</td>
              <td>{r.name}</td>
              <td>{r.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CumulTable({ entries }: { entries: CumulEntry[] }) {
  return (
    <div className="phase-block">
      <h4 className="phase-title">📊 Cumul Qualifs (top 6 → 1/2)</h4>
      <table className="results-table">
        <thead>
          <tr><th>Rg</th><th>Pilote</th><th>Cumul</th><th>Statut</th></tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.name} className={`${e.isPlayer ? 'player-row' : ''} ${e.advance ? 'qualified-row' : ''}`}>
              <td>{e.rank}</td>
              <td>{e.name}</td>
              <td>{e.cumul}</td>
              <td>{e.advance ? '✅ 1/2' : '❌ Out'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RaceView() {
  const rounds = useGameStore((s) => s.rounds);
  const currentRoundIndex = useGameStore((s) => s.currentRoundIndex);
  const phase = useGameStore((s) => s.phase);
  const runWeekend = useGameStore((s) => s.runWeekend);
  const lastWeekend = useGameStore((s) => s.lastWeekend);
  const clearLastWeekend = useGameStore((s) => s.clearLastWeekend);

  const nextRound = phase !== 'seasonEnd' ? rounds[currentRoundIndex] : null;
  const playerOutcome = lastWeekend?.playerOutcome;

  const statusBadge = (() => {
    if (!playerOutcome) return null;
    if (playerOutcome.finalPosition !== null) {
      const medal = playerOutcome.finalPosition === 1 ? '🥇' : playerOutcome.finalPosition === 2 ? '🥈' : playerOutcome.finalPosition === 3 ? '🥉' : '🏁';
      return `${medal} Finale P${playerOutcome.finalPosition}`;
    }
    if (playerOutcome.semiPosition !== null) {
      return `❌ Éliminé en 1/2 (P${playerOutcome.semiPosition})`;
    }
    return `❌ Éliminé en Qualifs (P${playerOutcome.qualifsRank})`;
  })();

  return (
    <div className="card">
      <h2>🏁 Week-end de Course</h2>

      {nextRound && !lastWeekend && (
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
          <p className="format-info">Format : 2 Qualifs → Cumul → 1/2 finale (top 6) → Finale (top 4)</p>
          <button className="btn-race" onClick={runWeekend}>
            🏎️ Lancer le week-end
          </button>
        </div>
      )}

      {lastWeekend && playerOutcome && (
        <div className="weekend-recap">
          <div className="recap-header">
            <div className="recap-circuit">
              {lastWeekend.circuit.country} {lastWeekend.circuit.name}
            </div>
            <div className="recap-status">{statusBadge}</div>
            <div className="recap-rewards">
              +{playerOutcome.pointsScored} pts • +{playerOutcome.earnings.toLocaleString()} €
            </div>
          </div>

          <details open className="phase-details">
            <summary>🏎️ Qualif 1</summary>
            <PhaseTable title="" results={lastWeekend.q1} />
          </details>
          <details className="phase-details">
            <summary>🏎️ Qualif 2</summary>
            <PhaseTable title="" results={lastWeekend.q2} />
          </details>
          <details open className="phase-details">
            <summary>📊 Cumul Qualifs</summary>
            <CumulTable entries={lastWeekend.cumul} />
          </details>
          <details open className="phase-details">
            <summary>🥈 1/2 Finale</summary>
            <PhaseTable title="" results={lastWeekend.semi} highlight={4} />
          </details>
          {lastWeekend.final.length > 0 && (
            <details open className="phase-details">
              <summary>🏆 Finale</summary>
              <PhaseTable title="" results={lastWeekend.final} />
            </details>
          )}

          {phase !== 'seasonEnd' && (
            <button className="btn-race" onClick={clearLastWeekend}>
              ⏭️ Manche suivante
            </button>
          )}
          {phase === 'seasonEnd' && (
            <div className="season-end-notice">✅ Saison terminée — consultez le classement</div>
          )}
        </div>
      )}

      <div className="rounds-progress">
        {rounds.map((r, i) => (
          <div
            key={`${r.circuit.id}-${i}`}
            className={`round-dot ${r.completed ? 'done' : ''} ${i === currentRoundIndex && phase !== 'seasonEnd' && !lastWeekend ? 'current' : ''}`}
            title={r.circuit.name}
          >
            {r.completed && r.playerOverallPosition !== null ? `P${r.playerOverallPosition}` : i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
