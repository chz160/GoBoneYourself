import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Card {
  id: number;
  value: string;
  type: 'bone' | 'skull' | 'pumpkin' | 'ghost' | 'bat' | 'witch';
  faceUp: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly title = signal('Go Bone Yourself');
  readonly playerHand = signal<Card[]>([]);
  readonly opponentHandSize = signal(0);
  readonly playerScore = signal(0);
  readonly opponentScore = signal(0);
  readonly gameMessage = signal('Welcome to Go Bone Yourself! Click "Start Game" to begin.');
  readonly gameStarted = signal(false);

  startGame() {
    this.gameStarted.set(true);
    this.initializeGame();
  }

  private initializeGame() {
    // Initialize player hand with 5 random cards
    const cards: Card[] = [];
    const types: Card['type'][] = ['bone', 'skull', 'pumpkin', 'ghost', 'bat', 'witch'];
    
    for (let i = 0; i < 5; i++) {
      const randomType = types[Math.floor(Math.random() * types.length)];
      cards.push({
        id: i,
        value: randomType,
        type: randomType,
        faceUp: true
      });
    }
    
    this.playerHand.set(cards);
    this.opponentHandSize.set(5);
    this.playerScore.set(0);
    this.opponentScore.set(0);
    this.gameMessage.set('Ask your opponent for a card type!');
  }

  askForCard(type: Card['type']) {
    if (!this.gameStarted()) return;
    
    const hasMatch = Math.random() > 0.5; // Simplified game logic
    
    if (hasMatch) {
      this.gameMessage.set(`Go bone yourself! Opponent has a ${type}!`);
      this.playerScore.update(score => score + 1);
    } else {
      this.gameMessage.set(`No match! Go bone yourself and draw a card!`);
      this.opponentScore.update(score => score + 1);
    }
  }

  getCardEmoji(type: Card['type']): string {
    const emojiMap: Record<Card['type'], string> = {
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
