# Interactive Classroom Puzzles

Interactive collection of educational games and puzzles designed for classroom use on interactive whiteboards. This application focuses on local multiplayer functionality, allowing students to take turns playing educational games directly on the classroom whiteboard.

## Features

### 🎮 Multiplayer Games

- **Math Battle**: Students compete to solve math problems
- **Word Rush**: Unscramble words faster than classmates
- **Memory Contest**: Find matching pairs in a competition
- **Trivia Showdown**: Test knowledge across various subjects

### 📊 Classroom Leaderboard

- Track student progress and scores
- View top performers across all games
- Create friendly competition in the classroom
- Display recent high scores

### 📝 Quiz Creation

- Create custom quizzes for your classroom
- Support for multiple-choice and text answer questions
- Add as many questions as needed
- Share quizzes with the class

### 👥 Classroom Mode

- Add multiple students to take turns
- Easily switch between students
- Track individual performance
- No accounts required - everything works locally

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/interactive-classroom-puzzles.git
cd interactive-classroom-puzzles
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Guide

### Adding Players

1. Click the "Players" button in the top-right corner of any page
2. Enter student names in the input field and click "Add Player"
3. You can remove students or change the current player from this menu

### Playing Multiplayer Games

1. Navigate to the "Multiplayer" section from the home page
2. Select a game to play
3. The current player will be highlighted
4. After each turn, click "Next Player's Turn" to switch to the next student
5. Scores are automatically recorded to the leaderboard

### Creating Quizzes

1. Go to the "Quizzes" section and click "Create Quiz"
2. Add a title and optional description
3. Create questions (multiple-choice or text answers)
4. Save the quiz to make it available for the class
5. Return to the quizzes section to play the created quiz

### Viewing Leaderboard

1. Navigate to the "Leaderboard" section
2. View player rankings based on total scores
3. See individual game high scores
4. Use this to encourage friendly competition

## Technical Details

- Built with Next.js 14 and React
- Uses TailwindCSS for styling
- Framer Motion for animations
- In-memory data storage (refreshing will reset data)

## Notes

This application is designed for classroom use and does not require internet connectivity once loaded. All data is stored in memory, which means:

- Quizzes and scores will be reset if the page is refreshed
- No user accounts or authentication required
- Perfect for quick classroom activities without setup

## License

This project is licensed under the MIT License - see the LICENSE file for details.
#   I n t e r a c t i v e D e s k C u r s o r  
 