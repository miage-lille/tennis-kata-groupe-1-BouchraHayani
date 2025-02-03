import { isSamePlayer, Player } from './types/player';
import {
  advantage,
  deuce,
  forty,
  FortyData,
  game,
  incrementPoint,
  Point,
  points,
  PointsData,
  Score,
} from './types/score';


export const playerToString = (player: Player): string => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'Player 1';
    case 'PLAYER_TWO':
      return 'Player 2';
  }
};

export const otherPlayer = (player: Player): Player => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'PLAYER_TWO';
    case 'PLAYER_TWO':
      return 'PLAYER_ONE';
  }
};

export const pointToString = (point: Point): string => {
  switch (point.kind) {
    case 'LOVE':
      return 'Love';
    case 'FIFTEEN':
      return 'Fifteen';
    case 'THIRTY':
      return 'Thirty';
    case 'FORTY':
      return 'Forty';
    default:
      throw new Error('Invalid point value');
  }
};

export const scoreToString = (score: Score): string => {
  switch (score.kind) {
    case 'POINTS':
      return `${pointToString(score.pointsData.PLAYER_ONE)} - ${pointToString(score.pointsData.PLAYER_TWO)}`;
    case 'FORTY':
      return `Forty - ${pointToString(score.fortyData.otherPoint)}`;
    case 'DEUCE':
      return 'Deuce';
    case 'ADVANTAGE':
      return `Advantage ${playerToString(score.player)}`;
    case 'GAME':
      return `Game ${playerToString(score.player)}`;
    default:
      throw new Error('Invalid score type');
  }
};

export const scoreWhenDeuce = (winner: Player): Score => {
  return advantage(winner);
};

export const scoreWhenAdvantage = (
  advantagedPlayer: Player,
  winner: Player
): Score => {
  if (isSamePlayer(advantagedPlayer, winner)) {
    return game(winner);
  } else {
    return deuce();
  }
};

export const scoreWhenForty = (
  currentForty: FortyData,
  winner: Player
): Score => {
  if (isSamePlayer(currentForty.player, winner)) {
    return game(winner);
  } else {
    const newPoint = incrementPoint(currentForty.otherPoint);
    if (newPoint.kind === 'FORTY') {
      return deuce();
    } else {
      return forty(currentForty.player, newPoint);
    }
  }
};

export const scoreWhenGame = (winner: Player): Score => {
  return game(winner);
};

export const scoreWhenPoint = (current: PointsData, winner: Player): Score => {
  const newPoints = { ...current };
  newPoints[winner] = incrementPoint(newPoints[winner]);

  if (newPoints[winner].kind === 'FORTY') {
    return forty(winner, newPoints[otherPlayer(winner)]);
  } else {
    return points(newPoints.PLAYER_ONE, newPoints.PLAYER_TWO);
  }
};

export const score = (currentScore: Score, winner: Player): Score => {
  switch (currentScore.kind) {
    case 'POINTS':
      return scoreWhenPoint(currentScore.pointsData, winner);
    case 'FORTY':
      return scoreWhenForty(currentScore.fortyData, winner);
    case 'DEUCE':
      return scoreWhenDeuce(winner);
    case 'ADVANTAGE':
      return scoreWhenAdvantage(currentScore.player, winner);
    case 'GAME':
      return currentScore; 
    default:
      throw new Error('Invalid score type');
  }
};