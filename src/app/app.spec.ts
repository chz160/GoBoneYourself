import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the correct title', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.title()).toContain('Go Bone Yourself');
  });

  it('should render the game header', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.game-header h1')?.textContent).toContain('Go Bone Yourself');
  });

  it('should show start screen initially', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.start-button')).toBeTruthy();
    expect(app.gameStarted()).toBe(false);
  });

  it('should start the game when start button is clicked', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.gameStarted()).toBe(false);
    
    app.startGame();
    
    expect(app.gameStarted()).toBe(true);
    expect(app.playerHand().length).toBe(5);
    expect(app.opponentHandSize()).toBe(5);
  });

  it('should return correct emoji for card types', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    expect(app.getCardEmoji('bone')).toBe('🦴');
    expect(app.getCardEmoji('skull')).toBe('💀');
    expect(app.getCardEmoji('pumpkin')).toBe('🎃');
    expect(app.getCardEmoji('ghost')).toBe('👻');
    expect(app.getCardEmoji('bat')).toBe('🦇');
    expect(app.getCardEmoji('witch')).toBe('🧙');
  });

  it('should use deterministic deck service', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    app.startGame();
    
    // Verify cards are dealt properly
    const playerHand = app.playerHand();
    expect(playerHand.length).toBe(5);
    expect(playerHand.every(card => card.faceUp)).toBe(true);
    
    // Verify all cards have valid types
    const validTypes = ['bone', 'skull', 'pumpkin', 'ghost', 'bat', 'witch'];
    expect(playerHand.every(card => validTypes.includes(card.type))).toBe(true);
  });

  it('should initialize deck count after dealing cards', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    app.startGame();
    
    // After dealing 5 cards to each player (10 total), 14 cards should remain
    expect(app.deckCount()).toBe(14);
  });

  it('should update deck count when drawing cards', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    app.startGame();
    const initialDeckCount = app.deckCount();
    
    // Ask for a card that opponent doesn't have to trigger a draw
    const playerHand = app.playerHand();
    const opponentHand = app.opponentHand();
    
    // Find a card type the player has but opponent doesn't
    const playerType = playerHand.find(card => 
      !opponentHand.some(oCard => oCard.type === card.type)
    )?.type;
    
    if (playerType) {
      app.askForCard(playerType);
      // Deck count should decrease by 1 after drawing
      expect(app.deckCount()).toBe(initialDeckCount - 1);
    }
  });
});
