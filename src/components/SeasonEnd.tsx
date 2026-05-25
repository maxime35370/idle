import { useGameStore } from '../store/gameStore';

export default function SeasonEnd() {
  const phase = useGameStore((s) => s.phase);
  const standings = useGameStore((s) => s.championshipStandings);
  const prestigeTokens = useGameStore((s) => s.prestigeTokens);
  const prestige = useGameStore((s) => s.prestige);
  const endSeason = useGameStore((s) => s.endSeason);
  const restartSeason = useGameStore((s) => s.restartSeason);

  if (phase !== 'seasonEnd') return null;

  const playerPos = standings.findIndex((s) => s.isPlayer) + 1;
  const playerPoints = standings.find((s) => s.isPlayer)?.points ?? 0;
  const tokensToEarn = Math.max(1, Math.floor((standings.length - playerPos + 1) * 1.5));

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>🏁 Fin de saison !</h2>
        <div className="result-summary">
          <div className="result-position">
            {playerPos === 1 ? '🥇' : playerPos === 2 ? '🥈' : playerPos === 3 ? '🥉' : `P${playerPos}`}
          </div>
          <div className="result-points">{playerPoints} points</div>
        </div>

        <div className="season-options">
          <div className="option-card">
            <h3>⏭️ Prochaine saison</h3>
            <p>Continue avec la même voiture. Gagne <strong>+{tokensToEarn} jetons prestige</strong>.</p>
            <p className="small">Les championnats supérieurs se débloquent automatiquement si tu es dans le top 3.</p>
            <button className="btn-race" onClick={endSeason}>Continuer</button>
          </div>

          <div className="option-card">
            <h3>🔄 Restart complet</h3>
            <p>Repart de zéro avec des <strong>bonus permanents</strong> :</p>
            <ul>
              <li>📋 Connaissance réglements : {prestige.regulationKnowledge} → {prestige.regulationKnowledge + Math.floor(prestigeTokens / 3)}</li>
              <li>💪 Moral équipe : {prestige.teamMorale} → {prestige.teamMorale + Math.floor(prestigeTokens / 4)}</li>
              <li>💰 Bonus sponsor : {prestige.sponsorBonus} → {prestige.sponsorBonus + Math.floor(prestigeTokens / 5)}</li>
            </ul>
            <p className="small">Jetons disponibles : {prestigeTokens}</p>
            <button className="btn-buy" onClick={restartSeason}>Restart ({prestigeTokens} jetons)</button>
          </div>
        </div>
      </div>
    </div>
  );
}
