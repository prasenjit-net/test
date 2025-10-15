# React Tic Tac Toe with AI

An interactive Tic Tac Toe game built with React and TypeScript, featuring AI opponents with multiple difficulty levels.

## Features

- 🎮 Play against another human
- 🤖 Play against AI with two difficulty levels:
  - Easy: Makes random moves 70% of the time
  - Hard: Uses minimax algorithm for optimal play
- ⏱️ Natural timing for computer moves
- 🔄 Move history and time travel
- 🎯 Win detection and draw state handling
- 📱 Responsive design

## Project Structure

```
src/
├── components/
│   ├── Board.tsx      # Game board component
│   ├── Square.tsx     # Individual square component
│   └── PlayerSelect.tsx # Player type selector
├── App.tsx            # Main game logic
└── App.css            # Game styling
```

## Technology Stack

- React 18
- TypeScript
- CSS3
- Create React App

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Play

1. Select player types for both X and O:

   - Human: Manual moves
   - Computer (Easy): AI that makes occasional mistakes
   - Computer (Hard): Unbeatable AI

2. Click any square to make a move when it's a human player's turn

3. For computer players:

   - Easy mode: Makes random moves 70% of the time
   - Hard mode: Always makes the optimal move

4. Use the move history buttons to go back to any previous game state

## AI Implementation

- Hard mode uses the minimax algorithm to calculate the optimal move
- Easy mode randomly chooses between:
  - Random valid moves (70% probability)
  - Optimal moves (30% probability)
- Computer moves have a natural delay (200-600ms) for better UX

## Development Commands

- `npm start`: Run development server
- `npm test`: Run test suite
- `npm run build`: Create production build
- `npm run eject`: Eject from Create React App

## Contributing

Feel free to submit issues and enhancement requests!

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
