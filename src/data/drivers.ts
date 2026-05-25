import type { OpponentDriver } from '../types/game';

export const REGIONAL_DRIVERS: OpponentDriver[] = [
  { id: 'r1', name: 'Marc Dubois', strength: 70, style: 'aggressive', nationality: '🇫🇷' },
  { id: 'r2', name: 'Lars Eriksson', strength: 95, style: 'consistent', nationality: '🇸🇪' },
  { id: 'r3', name: 'Kevin Walsh', strength: 60, style: 'technical', nationality: '🇬🇧' },
  { id: 'r4', name: 'Timo Fischer', strength: 85, style: 'aggressive', nationality: '🇩🇪' },
  { id: 'r5', name: 'Sofia Martins', strength: 75, style: 'technical', nationality: '🇵🇹' },
  { id: 'r6', name: 'Jonas Halvorsen', strength: 90, style: 'consistent', nationality: '🇳🇴' },
  { id: 'r7', name: 'Anna Novak', strength: 80, style: 'aggressive', nationality: '🇨🇿' },
];

export const NATIONAL_DRIVERS: OpponentDriver[] = [
  { id: 'n1', name: 'André Leroy', strength: 300, style: 'consistent', nationality: '🇫🇷' },
  { id: 'n2', name: 'Björn Lindqvist', strength: 340, style: 'technical', nationality: '🇸🇪' },
  { id: 'n3', name: 'Conor Murphy', strength: 280, style: 'aggressive', nationality: '🇮🇪' },
  { id: 'n4', name: 'Elena Kovač', strength: 320, style: 'consistent', nationality: '🇭🇷' },
  { id: 'n5', name: 'Pieter Van Damme', strength: 360, style: 'technical', nationality: '🇧🇪' },
  { id: 'n6', name: 'Markus Steiner', strength: 310, style: 'aggressive', nationality: '🇦🇹' },
  { id: 'n7', name: 'Yuki Tanaka', strength: 295, style: 'technical', nationality: '🇯🇵' },
];

export const EURORX_DRIVERS: OpponentDriver[] = [
  { id: 'e1', name: 'Sébastien Moreau', strength: 620, style: 'technical', nationality: '🇫🇷' },
  { id: 'e2', name: 'Kristoffer Berg', strength: 680, style: 'consistent', nationality: '🇸🇪' },
  { id: 'e3', name: 'Max van der Berg', strength: 650, style: 'aggressive', nationality: '🇳🇱' },
  { id: 'e4', name: 'Tomasz Wiśniewski', strength: 600, style: 'consistent', nationality: '🇵🇱' },
  { id: 'e5', name: 'Carlos Vega', strength: 710, style: 'technical', nationality: '🇪🇸' },
  { id: 'e6', name: 'Annika Holm', strength: 640, style: 'aggressive', nationality: '🇳🇴' },
  { id: 'e7', name: 'Dave Cooper', strength: 590, style: 'consistent', nationality: '🇬🇧' },
];

export const WORLDRX_DRIVERS: OpponentDriver[] = [
  { id: 'w1', name: 'Nils Andersen', strength: 1200, style: 'consistent', nationality: '🇩🇰' },
  { id: 'w2', name: 'Mikko Saarinen', strength: 1150, style: 'technical', nationality: '🇫🇮' },
  { id: 'w3', name: 'Éric Bouchard', strength: 1130, style: 'technical', nationality: '🇨🇦' },
  { id: 'w4', name: 'Thierry Laurent', strength: 1120, style: 'technical', nationality: '🇫🇷' },
  { id: 'w5', name: 'Riku Mäkinen', strength: 1090, style: 'technical', nationality: '🇫🇮' },
  { id: 'w6', name: 'Scott Harrison', strength: 1080, style: 'consistent', nationality: '🇺🇸' },
  { id: 'w7', name: 'James Fletcher', strength: 1060, style: 'aggressive', nationality: '🇦🇺' },
];

export const TITLE_DRIVERS: OpponentDriver[] = [
  { id: 't1', name: 'Magnus Thorvaldsen', strength: 1500, style: 'aggressive', nationality: '🇳🇴' },
  { id: 't2', name: 'Damien Leroux', strength: 1480, style: 'technical', nationality: '🇫🇷' },
  { id: 't3', name: 'Viktor Kronqvist', strength: 1450, style: 'consistent', nationality: '🇸🇪' },
  { id: 't4', name: 'Esa Korhonen', strength: 1420, style: 'technical', nationality: '🇫🇮' },
  { id: 't5', name: 'Henrik Nilsson', strength: 1400, style: 'technical', nationality: '🇸🇪' },
  { id: 't6', name: 'Antoine Beaumont', strength: 1380, style: 'consistent', nationality: '🇫🇷' },
  { id: 't7', name: 'Alexander Reinhardt', strength: 1350, style: 'aggressive', nationality: '🇩🇪' },
];
