export type CardType = 'bone' | 'skull' | 'pumpkin' | 'ghost' | 'bat' | 'witch';

export interface Card {
  id: number;
  value: string;
  type: CardType;
  faceUp: boolean;
}

/**
 * Seeded random number generator using Mulberry32 algorithm
 * Provides deterministic random numbers for reproducible shuffles
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * Generate next random number between 0 and 1
   */
  next(): number {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

/**
 * Deck service for managing card deck operations
 */
export class DeckService {
  private readonly cardTypes: CardType[] = ['bone', 'skull', 'pumpkin', 'ghost', 'bat', 'witch'];
  private readonly cardsPerType = 4; // Standard deck has 4 of each type
  private deck: Card[] = [];
  private nextCardId = 0;

  /**
   * Create a new deterministic deck with all card types
   * @returns Array of cards in deterministic order
   */
  createDeck(): Card[] {
    this.deck = [];
    this.nextCardId = 0;

    // Create cards in deterministic order: 4 of each type
    for (const type of this.cardTypes) {
      for (let i = 0; i < this.cardsPerType; i++) {
        this.deck.push({
          id: this.nextCardId++,
          value: type,
          type: type,
          faceUp: false,
        });
      }
    }

    return [...this.deck];
  }

  /**
   * Shuffle the deck using Fisher-Yates algorithm
   * @param seed Optional seed for deterministic shuffling (for tests/multiplayer)
   * @returns Shuffled deck
   */
  shuffle(seed?: number): Card[] {
    const shuffled = [...this.deck];
    const random = seed !== undefined ? new SeededRandom(seed) : null;

    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor((random ? random.next() : Math.random()) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    this.deck = shuffled;
    return [...this.deck];
  }

  /**
   * Deal specified number of cards from the deck
   * @param count Number of cards to deal
   * @returns Array of dealt cards
   */
  deal(count: number): Card[] {
    const dealt = this.deck.splice(0, count);
    return dealt.map((card) => ({ ...card, faceUp: true }));
  }

  /**
   * Get remaining cards in deck
   */
  getRemainingCards(): number {
    return this.deck.length;
  }

  /**
   * Get current deck state
   */
  getDeck(): Card[] {
    return [...this.deck];
  }

  /**
   * Reset deck to initial state
   */
  reset(): void {
    this.deck = [];
    this.nextCardId = 0;
  }

  /**
   * Initialize a new deck ready for play
   * Creates deck, shuffles it, and returns the shuffled deck
   * @param seed Optional seed for deterministic shuffling
   * @returns Shuffled deck ready for dealing
   */
  initializeDeck(seed?: number): Card[] {
    this.reset();
    this.createDeck();
    return this.shuffle(seed);
  }
}
