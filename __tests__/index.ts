import { describe, expect, test } from '@jest/globals';
import * as fc from 'fast-check';
import { otherPlayer, playerToString, pointToString, score, scoreToString, scoreWhenForty, scoreWhenPoint} from '..';
import * as G from './generators';
import { fifteen, FortyData, fortyPoint, incrementPoint, love, Point, PointsData, Score, thirty } from '../types/score';

describe('Tests for tooling functions', () => {
  test('Given playerOne when playerToString', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
  });

  test('Given playerOne when otherPlayer', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
  });
});

describe('Tests for transition functions', () => {
  test('Given deuce, score is advantage to winner', () => {
    fc.assert(
      fc.property(G.getPlayer(), (winner) => {
        const newScore = score({ kind: 'DEUCE' }, winner);
        expect(newScore).toStrictEqual({ kind: 'ADVANTAGE', player: winner });
      })
    );
  });

  test('Given advantage when advantagedPlayer wins, score is Game advantagedPlayer', () => {
    fc.assert(
      fc.property(G.getPlayer(), (winner) => {
        const newScore = score({ kind: 'ADVANTAGE', player: winner }, winner);
        expect(newScore).toStrictEqual({ kind: 'GAME', player: winner });
      })
    );
  });

  test('Given advantage when otherPlayer wins, score is Deuce', () => {
    fc.assert(
      fc.property(G.getPlayer(), (winner) => {
        const advantagedPlayer = otherPlayer(winner);
        const newScore = score({ kind: 'ADVANTAGE', player: advantagedPlayer }, winner);
        expect(newScore).toStrictEqual({ kind: 'DEUCE' });
      })
    );
  });

  test('Given a player at 40 when the same player wins, score is Game for this player', () => {
    fc.assert(
      fc.property(G.getPlayer(), (winner) => {
        const newScore = score(
          { kind: 'FORTY', fortyData: { player: winner, otherPoint: love() } },
          winner
        );
        expect(newScore).toStrictEqual({ kind: 'GAME', player: winner });
      })
    );
  });

  test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
    fc.assert(
      fc.property(G.getPlayer(), (winner) => {
        const playerAtForty = otherPlayer(winner);
        const newScore = score(
          { kind: 'FORTY', fortyData: { player: playerAtForty, otherPoint: thirty() } },
          winner
        );
        expect(newScore).toStrictEqual({ kind: 'DEUCE' });
      })
    );
  });

  test('Given player at 40 and other at 15 when other wins, score is 40 - 30', () => {
    fc.assert(
      fc.property(G.getPlayer(), (winner) => {
        const playerAtForty = otherPlayer(winner);
        const newScore = score(
          { kind: 'FORTY', fortyData: { player: playerAtForty, otherPoint: fifteen() } },
          winner
        );
        expect(newScore).toStrictEqual({
          kind: 'FORTY',
          fortyData: { player: playerAtForty, otherPoint: thirty() },
        });
      })
    );
  });

  test('Given players at 0 or 15 points, score kind is still POINTS', () => {
    fc.assert(
      fc.property(G.getPoints(), G.getPlayer(), ({ pointsData }, winner) => {
        fc.pre(
          pointsData.PLAYER_ONE.kind === 'LOVE' ||
            pointsData.PLAYER_ONE.kind === 'FIFTEEN'
        );
        fc.pre(
          pointsData.PLAYER_TWO.kind === 'LOVE' ||
            pointsData.PLAYER_TWO.kind === 'FIFTEEN'
        );
        const newScore = score({ kind: 'POINTS', pointsData }, winner);
        expect(newScore.kind).toBe('POINTS');
      })
    );
  });

  test('Given one player at 30 and win, score kind is forty', () => {
    fc.assert(
      fc.property(G.getPoints(), G.getPlayer(), ({ pointsData }, winner) => {
        fc.pre(
          pointsData[winner].kind === 'THIRTY' &&
            (pointsData[otherPlayer(winner)].kind === 'LOVE' ||
              pointsData[otherPlayer(winner)].kind === 'FIFTEEN' ||
              pointsData[otherPlayer(winner)].kind === 'THIRTY')
        );
        const newScore = score({ kind: 'POINTS', pointsData }, winner);
        expect(newScore.kind).toBe('FORTY');
      })
    );
  });

  test('Given FORTY when incrementPoint, throw an error', () => {
    expect(() => incrementPoint(fortyPoint())).toThrow('Cannot increment FORTY');
  });

  test('Given invalid score when scoreToString, throw an error', () => {
    const invalidScore = { kind: 'INVALID' } as unknown as Score;
    expect(() => scoreToString(invalidScore)).toThrow('Invalid score type');
  });

  test('Given invalid score when score, throw an error', () => {
    const invalidScore = { kind: 'INVALID' } as unknown as Score;
    expect(() => score(invalidScore, 'PLAYER_ONE')).toThrow('Invalid score type');
  });

  test('Given invalid points when scoreWhenPoint, throw an error', () => {
    const invalidPoints = { PLAYER_ONE: { kind: 'INVALID' }, PLAYER_TWO: love() } as unknown as PointsData;
    expect(() => scoreWhenPoint(invalidPoints, 'PLAYER_ONE')).toThrow('Invalid point value');
  });

  test('Given invalid point when pointToString, throw an error', () => {
    const invalidPoint = { kind: 'INVALID' } as unknown as Point;
    expect(() => pointToString(invalidPoint)).toThrow('Invalid point value');
  });

  test('Given Game when scoreWhenGame, return Game', () => {
    const winner = 'PLAYER_ONE';
    const newScore = score({ kind: 'GAME', player: winner }, winner);
    expect(newScore).toStrictEqual({ kind: 'GAME', player: winner });
  });
});