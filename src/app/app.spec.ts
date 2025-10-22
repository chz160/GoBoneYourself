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
});
