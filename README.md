# 🎮 Ultimate Guessing Game – Pro Edition

An interactive number guessing game built with **HTML, CSS, and JavaScript**.  
It combines dynamic audio, particle effects, streak bonuses, hints, and a timer system — all wrapped in a stylish themed UI.

---

## ✨ Features

### 🎵 Audio Engine
- Background synth loop starts on your first guess.
- Pitch changes with level progression:
  - Lower levels → deeper pitch (55 Hz).
  - Higher levels → higher pitch (73 Hz).
- Loop speed increases when score is **critical (≤ 20)**.
- Smooth gain envelope for fading sound.

### 💥 Particle Explosions
- Canvas‑based particle effects when you win.
- Randomized size, velocity, gravity, and fade‑out for each particle.
- Responsive canvas that resizes with the window.

### 🕹️ Gameplay
- Guess the hidden number within the displayed range.
- **Score system**:
  - Correct guess → score increases based on remaining time and streak multiplier.
  - Wrong guess → score decreases by 10.
- **Streak multiplier** rewards consecutive wins.
- **Hints** available (cost 50 points, break streak).
- **Critical state overlay** when score ≤ 20.
- **Timer bar** counts down each round.
- **Game Over** when score ≤ 0 or time expires.
- **Best Level** saved in `localStorage`.

### 🎨 Themes
Switch between multiple visual styles:
- Neon (default)
- Forest
- Retro

---

## 📂 Project Structure

---

## 🚀 Getting Started

1. Clone or download this repository.
2. Open `index.html` in your browser.
3. Start guessing and enjoy the effects!

---

## 🖥️ Controls
- Enter your guess in the input field.
- Press **Enter** or click **GUESS NOW**.
- Use hints wisely to narrow down the target range.

---

## 🏆 Demo Highlights
- Particle explosions on win.
- Timer bar shrinking as time runs out.
- Critical red overlay when score is low.
- Persistent high score tracking.

---

## 🔮 Future Improvements
- Add sound effects for win/loss.
- More particle styles (circles, gradients).
- Difficulty scaling with faster timers.
- Mobile‑friendly UI improvements.

---

## 📜 License
This project is open-source and free to use for learning and experimentation.
