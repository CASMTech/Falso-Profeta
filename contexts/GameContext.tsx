import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { BibleCharacter, getRandomCharacter } from '@/data/characters';

export interface Player {
  id: string;
  name: string;
  isAlive: boolean;
  isImpostor: boolean;
}

export type GamePhase = 'setup' | 'reveal' | 'game' | 'result';
export type Winner = 'civilians' | 'impostor' | null;

interface GameContextValue {
  players: Player[];
  character: BibleCharacter | null;
  impostorId: string | null;
  gamePhase: GamePhase;
  winner: Winner;
  revealIndex: number;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  startGame: () => void;
  nextReveal: () => void;
  eliminatePlayer: (id: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [character, setCharacter] = useState<BibleCharacter | null>(null);
  const [impostorId, setImpostorId] = useState<string | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [winner, setWinner] = useState<Winner>(null);
  const [revealIndex, setRevealIndex] = useState<number>(0);

  const addPlayer = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPlayers(prev => [
      ...prev,
      { id: generateId(), name: trimmed, isAlive: true, isImpostor: false },
    ]);
  }, []);

  const removePlayer = useCallback((id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  }, []);

  const startGame = useCallback(() => {
    if (players.length < 3) return;
    const selectedCharacter = getRandomCharacter();
    const impostorIndex = Math.floor(Math.random() * players.length);
    const impostorPlayerId = players[impostorIndex].id;

    const updatedPlayers = players.map(p => ({
      ...p,
      isAlive: true,
      isImpostor: p.id === impostorPlayerId,
    }));

    setPlayers(updatedPlayers);
    setCharacter(selectedCharacter);
    setImpostorId(impostorPlayerId);
    setRevealIndex(0);
    setWinner(null);
    setGamePhase('reveal');
  }, [players]);

  const nextReveal = useCallback(() => {
    setRevealIndex(prev => {
      const next = prev + 1;
      if (next >= players.length) {
        setGamePhase('game');
      }
      return next;
    });
  }, [players.length]);

  const checkWinCondition = useCallback((updatedPlayers: Player[]): Winner => {
    const alive = updatedPlayers.filter(p => p.isAlive);
    const impostorAlive = alive.some(p => p.isImpostor);
    const civiliansAlive = alive.filter(p => !p.isImpostor).length;

    if (!impostorAlive) return 'civilians';
    if (civiliansAlive <= 1) return 'impostor';
    return null;
  }, []);

  const eliminatePlayer = useCallback((id: string) => {
    setPlayers(prev => {
      const updated = prev.map(p =>
        p.id === id ? { ...p, isAlive: false } : p
      );
      const result = checkWinCondition(updated);
      if (result) {
        setWinner(result);
        setGamePhase('result');
      }
      return updated;
    });
  }, [checkWinCondition]);

  const resetGame = useCallback(() => {
    setPlayers([]);
    setCharacter(null);
    setImpostorId(null);
    setGamePhase('setup');
    setWinner(null);
    setRevealIndex(0);
  }, []);

  return (
    <GameContext.Provider
      value={{
        players,
        character,
        impostorId,
        gamePhase,
        winner,
        revealIndex,
        addPlayer,
        removePlayer,
        startGame,
        nextReveal,
        eliminatePlayer,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
