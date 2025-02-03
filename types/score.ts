import { Player } from './player';

export type Love = {
  kind: 'LOVE';
};

export type Fifteen = {
  kind: 'FIFTEEN';
};

export type Thirty = {
  kind: 'THIRTY';
};

export type FortyPoint = {
  kind: 'FORTY';
};

export type Point = Love | Fifteen | Thirty | FortyPoint;

export const love = (): Love => ({ kind: 'LOVE' });
export const fifteen = (): Fifteen => ({ kind: 'FIFTEEN' });
export const thirty = (): Thirty => ({ kind: 'THIRTY' });
export const fortyPoint = (): FortyPoint => ({ kind: 'FORTY' });

export const incrementPoint = (point: Point): Point => {
  switch (point.kind) {
    case 'LOVE':
      return fifteen();
    case 'FIFTEEN':
      return thirty();
    case 'THIRTY':
      return fortyPoint();
    case 'FORTY':
      throw new Error('Cannot increment FORTY');
    default:
      throw new Error('Invalid point value');
  }
};

export type PointsData = {
  PLAYER_ONE: Point;
  PLAYER_TWO: Point;
};

export type Points = {
  kind: 'POINTS';
  pointsData: PointsData;
};

export const points = (
  playerOnePoints: Point,
  playerTwoPoints: Point
): Points => ({
  kind: 'POINTS',
  pointsData: {
    PLAYER_ONE: playerOnePoints,
    PLAYER_TWO: playerTwoPoints,
  },
});

export type FortyData = {
  player: Player; 
  otherPoint: Point; 
};

export type Forty = {
  kind: 'FORTY';
  fortyData: FortyData;
};

export const forty = (player: Player, otherPoint: Point): Forty => ({
  kind: 'FORTY',
  fortyData: {
    player,
    otherPoint,
  },
});

export type Deuce = {
  kind: 'DEUCE';
};

export const deuce = (): Deuce => ({
  kind: 'DEUCE',
});

export type Advantage = {
  kind: 'ADVANTAGE';
  player: Player;
};

export const advantage = (player: Player): Advantage => ({
  kind: 'ADVANTAGE',
  player,
});

export type Game = {
  kind: 'GAME';
  player: Player; 
};

export const game = (winner: Player): Game => ({
  kind: 'GAME',
  player: winner,
});

export type Score = Points | Forty | Deuce | Advantage | Game;