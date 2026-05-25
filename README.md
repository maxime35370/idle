# 🏎️ Rallycross Idle

Un jeu idle orienté rallycross : affronte des pilotes de plus en plus forts, améliore ta voiture, et grimpe les échelons du Championnat Régional jusqu'au Titre Mondial.

## 🎮 Concept

- **5 championnats progressifs** : Régional → National → Euro RX → World RX → Bataille pour le Titre
- **8 circuits réels** : Höljes, Lohéac, Mettet, Silverstone RX, Montalegre, Trois-Rivières, Barcelona, Helmond
- **Système de stats voiture** : Moteur, Aéro, Transmission, Suspension, Pneus, Pilote
- **Upgrades stratégiques** : 12 améliorations multi-niveaux dans l'atelier
- **Système de prestige** : restart de saison pour gagner des bonus permanents (Règlements, Moral, Sponsors)
- **Idle passif** : revenus continus même sans jouer

## 🏁 Boucle de jeu

```
Course → Gains → Upgrades voiture → Course suivante
   ↑                                           ↓
   └─── Restart prestige ← Fin de saison ←────┘
```

Chaque circuit a des modificateurs différents (un moteur puissant brille à Trois-Rivières, une bonne suspension à Höljes), et les pilotes adverses ont des styles (agressif, technique, régulier) qui interagissent avec la surface.

## 🛠️ Stack

- **React 19** + TypeScript
- **Zustand** pour le state (avec persistance localStorage)
- **Vite** pour le build
- **GitHub Pages** pour le déploiement

## 🚀 Développement

```bash
npm install
npm run dev      # serveur local
npm run build    # build production
```

## 🌐 Déploiement

Le workflow `.github/workflows/deploy.yml` déploie automatiquement sur GitHub Pages à chaque push sur `main`.

URL une fois déployé : `https://maxime35370.github.io/idle/`

> Active GitHub Pages dans **Settings → Pages → Source : GitHub Actions** pour activer le déploiement.

## 📂 Architecture

```
src/
├── types/game.ts        # Types TypeScript
├── data/
│   ├── circuits.ts      # Données des circuits
│   ├── drivers.ts       # Pilotes adverses (35+ pilotes)
│   └── upgrades.ts      # Catalogue des upgrades
├── engine/race.ts       # Moteur de simulation de course
├── store/gameStore.ts   # State global (Zustand)
├── components/
│   ├── CarStats.tsx     # Affichage stats voiture
│   ├── RaceView.tsx     # Vue course / résultats
│   ├── Shop.tsx         # Atelier d'upgrades
│   ├── Championship.tsx # Sélection championnat + classement
│   └── SeasonEnd.tsx    # Modal fin de saison / prestige
└── App.tsx              # Layout + navigation
```
