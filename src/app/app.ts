import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DeckService, Card, CardType } from './deck.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly title = signal('Go Bone Yourself');
  readonly playerHand = signal<Card[]>([]);
  readonly opponentHand = signal<Card[]>([]);
  readonly opponentHandSize = signal(0);
  readonly deckCount = signal(0);
  readonly playerScore = signal(0);
  readonly opponentScore = signal(0);
  readonly gameMessage = signal('Welcome to Go Bone Yourself! Click "Start Game" to begin.');
  readonly gameStarted = signal(false);
  
  private deckService = new DeckService();

  startGame() {
    this.gameStarted.set(true);
    this.initializeGame();
  }

  private initializeGame() {
    // Initialize deck (create, shuffle) and deal cards to players
    this.deckService.initializeDeck();
    
    // Deal 5 cards to each player
    const playerCards = this.deckService.deal(5);
    const opponentCards = this.deckService.deal(5);
    
    this.playerHand.set(playerCards);
    this.opponentHand.set(opponentCards);
    this.opponentHandSize.set(opponentCards.length);
    this.deckCount.set(this.deckService.getRemainingCards());
    this.playerScore.set(0);
    this.opponentScore.set(0);
    this.gameMessage.set('Ask your opponent for a card type!');
  }

  askForCard(type: CardType) {
    if (!this.gameStarted()) return;
    
    // Check if opponent has the requested card type
    const opponentCards = this.opponentHand();
    const matchingCard = opponentCards.find(card => card.type === type);
    
    if (matchingCard) {
      // Opponent has the card - player scores
      this.gameMessage.set(`Match! Opponent has a ${type}!`);
      this.playerScore.update(score => score + 1);
      
      // Remove card from opponent's hand and add to player's hand
      const updatedOpponentHand = opponentCards.filter(card => card.id !== matchingCard.id);
      this.opponentHand.set(updatedOpponentHand);
      this.opponentHandSize.set(updatedOpponentHand.length);
      this.playerHand.update(hand => [...hand, matchingCard]);
    } else {
      // No match - draw a card
      const drawnCards = this.deckService.deal(1);
      if (drawnCards.length > 0) {
        this.gameMessage.set(`No match! Go bone yourself and draw a card!`);
        this.playerHand.update(hand => [...hand, drawnCards[0]]);
      } else {
        this.gameMessage.set(`No match and no cards left to draw!`);
      }
      this.deckCount.set(this.deckService.getRemainingCards());
      this.opponentScore.update(score => score + 1);
    }
  }

  getCardEmoji(type: CardType): string {
    const emojiMap: Record<CardType, string> = {
      'bone': '🦴',
      'skull': '💀',
      'pumpkin': '🎃',
      'ghost': '👻',
      'bat': '🦇',
      'witch': '🧙'
    };
    return emojiMap[type];
  }
}
