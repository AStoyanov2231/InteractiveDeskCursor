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

## Installation Guide

### Prerequisites

The application requires:
- Node.js (version 18 or higher)
- npm (comes with Node.js) or yarn package manager
- Git (for cloning the repository)

### Windows Installation

1. **Install Node.js and npm**
   - Download the Node.js installer from [nodejs.org](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version
   - Run the installer and follow the installation wizard
   - Ensure the "Add to PATH" option is checked during installation
   - Verify installation by opening Command Prompt or PowerShell and running:
     ```
     node --version
     npm --version
     ```

2. **Install Git (if not already installed)**
   - Download Git from [git-scm.com](https://git-scm.com/download/win)
   - Run the installer with default settings
   - Verify installation by running:
     ```
     git --version
     ```

3. **Clone the repository**
   - Open Command Prompt or PowerShell
   - Navigate to the directory where you want to store the project
   - Run:
     ```
     git clone https://github.com/yourusername/interactive-classroom-puzzles.git
     cd interactive-classroom-puzzles
     ```

4. **Install dependencies**
   - Run:
     ```
     npm install
     ```

5. **Start the development server**
   - Run:
     ```
     npm run dev
     ```

6. **Access the application**
   - Open your browser and go to [http://localhost:3000](http://localhost:3000)

### macOS Installation

1. **Install Node.js and npm**
   - Method 1: Download the macOS installer from [nodejs.org](https://nodejs.org/)
     - Choose the LTS (Long Term Support) version
     - Run the installer and follow the installation wizard
   
   - Method 2: Using Homebrew (recommended):
     - Install Homebrew if not already installed:
       ```
       /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
       ```
     - Install Node.js:
       ```
       brew install node
       ```
   
   - Verify installation:
     ```
     node --version
     npm --version
     ```

2. **Install Git (if not already installed)**
   - macOS might have Git pre-installed. Verify with:
     ```
     git --version
     ```
   - If not installed, use Homebrew:
     ```
     brew install git
     ```
   - Or download from [git-scm.com](https://git-scm.com/download/mac)

3. **Clone the repository**
   - Open Terminal
   - Navigate to the directory where you want to store the project
   - Run:
     ```
     git clone https://github.com/yourusername/interactive-classroom-puzzles.git
     cd interactive-classroom-puzzles
     ```

4. **Install dependencies**
   - Run:
     ```
     npm install
     ```

5. **Start the development server**
   - Run:
     ```
     npm run dev
     ```

6. **Access the application**
   - Open your browser and go to [http://localhost:3000](http://localhost:3000)

## Troubleshooting

- **Port already in use**: If port 3000 is already in use, the application will typically try another port automatically. Check your terminal for the URL.
- **Node.js version issues**: Ensure you have Node.js 18 or higher installed. You can use nvm (Node Version Manager) to manage multiple Node.js versions.
- **Dependencies installation failure**: Make sure you have a stable internet connection. Try deleting the `node_modules` folder and the `package-lock.json` file, then run `npm install` again.

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
