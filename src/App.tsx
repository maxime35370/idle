import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import CarStats from './components/CarStats';
import RaceView from './components/RaceView';
import Shop from './components/Shop';
import Championship from './components/Championship';
import SeasonEnd from './components/SeasonEnd';
import './App.css';

type Tab = 'race' | 'car' | 'shop' | 'championship';

export default function App() {
  const [tab, setTab] = useState<Tab>('race');
  const money = useGameStore((s) => s.money);
  const passiveIncome = useGameStore((s) => s.passiveIncome);
  const tick = useGameStore((s) => s.tick);

  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title">
          <span className="logo">🏎️</span>
          <span>Rallycross Idle</span>
        </div>
        <div className="header-money">
          <span className="money">{Math.floor(money).toLocaleString()} €</span>
          <span className="income">+{passiveIncome}/s</span>
        </div>
      </header>

      <nav className="tab-nav">
        <button className={tab === 'race' ? 'active' : ''} onClick={() => setTab('race')}>🏁 Course</button>
        <button className={tab === 'car' ? 'active' : ''} onClick={() => setTab('car')}>🚗 Voiture</button>
        <button className={tab === 'shop' ? 'active' : ''} onClick={() => setTab('shop')}>🛒 Atelier</button>
        <button className={tab === 'championship' ? 'active' : ''} onClick={() => setTab('championship')}>🏆 Classement</button>
      </nav>

      <main className="app-main">
        {tab === 'race' && <RaceView />}
        {tab === 'car' && <CarStats />}
        {tab === 'shop' && <Shop />}
        {tab === 'championship' && <Championship />}
      </main>

      <SeasonEnd />
    </div>
  );
}
