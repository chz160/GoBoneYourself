# GoBoneYourself 🎃

Halloween themed version of Go F*ck Yourself game - a spooky twist on the classic card game Go Fish!

## About

Go Bone Yourself is a Halloween-themed card game built with Angular 20. Players try to match cards featuring spooky characters like bones, skulls, pumpkins, ghosts, bats, and witches. When your opponent doesn't have the card you're asking for, they tell you to "Go Bone Yourself!" and you draw from the deck.

## Features

- 🎮 Interactive card-based gameplay
- 🎃 Halloween-themed design with spooky atmosphere
- 👻 Six card types: Bone, Skull, Pumpkin, Ghost, Bat, and Witch
- 📊 Score tracking
- 📱 Responsive design for desktop and mobile
- ✨ Smooth animations and hover effects

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm start
```

Navigate to `http://localhost:4200/` to play the game. The application will automatically reload if you change any source files.

### Build

```bash
# Build for production
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Testing

```bash
# Run unit tests
npm test
```

## How to Play

1. Click "Start Game" to begin
2. You'll receive 5 random Halloween-themed cards
3. Click on a card in your hand to ask the opponent for a matching card
4. If they have it, you score a point!
5. If they don't, "Go Bone Yourself!" and they score a point
6. The player with the most points wins!

## Technology Stack

- **Framework:** Angular 20.3.0
- **Language:** TypeScript 5.9.2
- **State Management:** Angular Signals
- **Testing:** Jasmine + Karma
- **Build Tool:** Angular CLI 20.3.6

## License

See LICENSE file for details.
