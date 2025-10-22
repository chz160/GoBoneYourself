import { DeckService, Card, CardType } from './deck.service';

describe('DeckService', () => {
  let service: DeckService;

  beforeEach(() => {
    service = new DeckService();
  });

  describe('createDeck', () => {
    it('should create a deck with 24 cards (6 types × 4 cards)', () => {
      const deck = service.createDeck();
      expect(deck.length).toBe(24);
    });

    it('should create exactly 4 cards of each type', () => {
      const deck = service.createDeck();
      const types: CardType[] = ['bone', 'skull', 'pumpkin', 'ghost', 'bat', 'witch'];

      types.forEach((type) => {
        const cardsOfType = deck.filter((card) => card.type === type);
        expect(cardsOfType.length).toBe(4);
      });
    });

    it('should create cards in deterministic order', () => {
      const deck1 = service.createDeck();
      service.reset();
      const deck2 = service.createDeck();

      expect(deck1.map((c) => c.type)).toEqual(deck2.map((c) => c.type));
    });

    it('should create cards with unique IDs', () => {
      const deck = service.createDeck();
      const ids = deck.map((card) => card.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(deck.length);
    });

    it('should create cards with faceUp set to false', () => {
      const deck = service.createDeck();
      expect(deck.every((card) => card.faceUp === false)).toBe(true);
    });

    it('should create cards with value matching type', () => {
      const deck = service.createDeck();
      expect(deck.every((card) => card.value === card.type)).toBe(true);
    });
  });

  describe('shuffle', () => {
    it('should shuffle the deck randomly without seed', () => {
      service.createDeck();
      const original = service.getDeck();
      service.shuffle();
      const shuffled = service.getDeck();

      // Deck should have same cards but likely different order
      expect(shuffled.length).toBe(original.length);
      expect(shuffled.map((c) => c.type).sort()).toEqual(original.map((c) => c.type).sort());
    });

    it('should produce deterministic shuffle with same seed', () => {
      const seed = 12345;

      service.createDeck();
      const shuffled1 = service.shuffle(seed);

      service.reset();
      service.createDeck();
      const shuffled2 = service.shuffle(seed);

      expect(shuffled1.map((c) => c.id)).toEqual(shuffled2.map((c) => c.id));
    });

    it('should produce different shuffles with different seeds', () => {
      service.createDeck();
      const shuffled1 = service.shuffle(111);

      service.reset();
      service.createDeck();
      const shuffled2 = service.shuffle(222);

      expect(shuffled1.map((c) => c.id)).not.toEqual(shuffled2.map((c) => c.id));
    });

    it('should maintain all cards after shuffle', () => {
      service.createDeck();
      const original = service.getDeck();
      service.shuffle(42);
      const shuffled = service.getDeck();

      expect(shuffled.length).toBe(original.length);

      // Check all original cards are still present
      original.forEach((originalCard) => {
        expect(shuffled.find((c) => c.id === originalCard.id)).toBeTruthy();
      });
    });

    it('should return shuffled deck', () => {
      service.createDeck();
      const returned = service.shuffle(999);
      const deck = service.getDeck();

      expect(returned).toEqual(deck);
    });
  });

  describe('deal', () => {
    it('should deal specified number of cards', () => {
      service.createDeck();
      const dealt = service.deal(5);

      expect(dealt.length).toBe(5);
    });

    it('should remove dealt cards from deck', () => {
      service.createDeck();
      const initialCount = service.getRemainingCards();
      service.deal(5);

      expect(service.getRemainingCards()).toBe(initialCount - 5);
    });

    it('should set dealt cards to faceUp', () => {
      service.createDeck();
      const dealt = service.deal(3);

      expect(dealt.every((card) => card.faceUp === true)).toBe(true);
    });

    it('should deal cards from top of deck', () => {
      service.createDeck();
      service.shuffle(123);
      const deckBefore = service.getDeck();
      const expectedCards = deckBefore.slice(0, 3);

      const dealt = service.deal(3);

      expect(dealt.map((c) => c.id)).toEqual(expectedCards.map((c) => c.id));
    });

    it('should handle dealing all cards', () => {
      service.createDeck();
      const dealt = service.deal(24);

      expect(dealt.length).toBe(24);
      expect(service.getRemainingCards()).toBe(0);
    });

    it('should handle dealing more cards than available', () => {
      service.createDeck();
      service.deal(20); // Leave only 4 cards
      const dealt = service.deal(10); // Try to deal 10

      expect(dealt.length).toBe(4); // Should only get remaining 4
      expect(service.getRemainingCards()).toBe(0);
    });
  });

  describe('getRemainingCards', () => {
    it('should return initial deck size', () => {
      service.createDeck();
      expect(service.getRemainingCards()).toBe(24);
    });

    it('should return 0 for empty deck', () => {
      expect(service.getRemainingCards()).toBe(0);
    });

    it('should update after dealing', () => {
      service.createDeck();
      service.deal(7);
      expect(service.getRemainingCards()).toBe(17);
    });
  });

  describe('getDeck', () => {
    it('should return copy of deck', () => {
      service.createDeck();
      const deck1 = service.getDeck();
      const deck2 = service.getDeck();

      expect(deck1).not.toBe(deck2); // Different array instances
      expect(deck1).toEqual(deck2); // But same content
    });

    it('should return empty array for new service', () => {
      const deck = service.getDeck();
      expect(deck).toEqual([]);
    });
  });

  describe('reset', () => {
    it('should clear the deck', () => {
      service.createDeck();
      service.shuffle();
      service.reset();

      expect(service.getRemainingCards()).toBe(0);
      expect(service.getDeck()).toEqual([]);
    });

    it('should reset card ID counter', () => {
      service.createDeck();
      const firstDeck = service.getDeck();
      service.reset();
      service.createDeck();
      const secondDeck = service.getDeck();

      expect(firstDeck[0].id).toBe(secondDeck[0].id);
    });
  });

  describe('Integration scenarios', () => {
    it('should support full game initialization sequence', () => {
      // Create and shuffle deck
      service.createDeck();
      service.shuffle(42);

      // Deal to two players
      const player1Hand = service.deal(5);
      const player2Hand = service.deal(5);

      expect(player1Hand.length).toBe(5);
      expect(player2Hand.length).toBe(5);
      expect(service.getRemainingCards()).toBe(14);

      // All dealt cards should be face up
      expect([...player1Hand, ...player2Hand].every((c) => c.faceUp)).toBe(true);

      // No duplicate cards between hands
      const allHandIds = [...player1Hand, ...player2Hand].map((c) => c.id);
      expect(new Set(allHandIds).size).toBe(10);
    });

    it('should support reproducible multiplayer game setup', () => {
      const gameSeed = 98765;

      // Player 1's game setup
      const deck1 = new DeckService();
      deck1.createDeck();
      deck1.shuffle(gameSeed);
      const p1Hand = deck1.deal(5);

      // Player 2's game setup (should match)
      const deck2 = new DeckService();
      deck2.createDeck();
      deck2.shuffle(gameSeed);
      const p2Hand = deck2.deal(5);

      expect(p1Hand.map((c) => c.id)).toEqual(p2Hand.map((c) => c.id));
    });
  });
});
