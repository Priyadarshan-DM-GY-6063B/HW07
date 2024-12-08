let quote = "The future belongs to those who believe in the beauty of their dreams.";
let words = [];
let displayedText = ""; // Text displayed during the typewriter effect
let currentWordIndex = 0; // Tracks which word is being typed
let typewriterSpeed = 350; // Delay between typing each word (in ms)
let lastTypedTime = 0; // Tracks time for typewriter effect
let wordObjects = [];
let specialWords = ["future", "believe", "beauty", "dreams"]; // Words to emphasize
let animationStarted = false; // Trigger for animations

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(32);
  words = quote.split(" "); // Split the quote into words
}

function draw() {
  background(30, 40, 60);

  if (!animationStarted) {
    // Typewriter Effect
    displayTypewriter();
  } else {
    // Animate words once the full quote is displayed
    for (let word of wordObjects) {
      word.update();
      word.display();
    }
  }
}

// Display the typewriter effect
function displayTypewriter() {
  fill(200, 220, 255);
  noStroke();
  text(displayedText, width / 2, height / 2);

  // Add the next word if enough time has passed
  if (millis() - lastTypedTime > typewriterSpeed && currentWordIndex < words.length) {
    displayedText += words[currentWordIndex] + " ";
    currentWordIndex++;
    lastTypedTime = millis();

    // If all words are typed, initialize word objects for animation
    if (currentWordIndex === words.length) {
      initializeWordObjects();
      animationStarted = true;
    }
  }
}

// Initialize word objects for animation
function initializeWordObjects() {
  let centerX = width / 2;
  let centerY = height / 2;
  let wordWidth = textWidth(" ");

  // Calculate the start position of the full quote
  let totalWidth = textWidth(displayedText.trim());
  let startX = centerX - totalWidth / 2;

  // Create word objects for each word
  let x = startX;
  let y = centerY;
  for (let word of words) {
    let isSpecial = specialWords.includes(word.replace(/[^a-zA-Z]/g, ""));
    wordObjects.push(new Word(word, x, y, isSpecial));
    x += textWidth(word) + wordWidth;
  }
}

// Word class for animation
class Word {
  constructor(text, x, y, special) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.speedY = random(1, 3); // Speed for floating effect
    this.driftX = random(-0.5, 0.5); // Horizontal drift
    this.size = special ? 28 : 18; // Base size
    this.color = special ? color(255, 200, 100) : color(200, 220, 255);
    this.isSpecial = special;
  }

  // Update position for floating animation
  update() {
    this.y += this.speedY;
    this.x += this.driftX;

    // Reset position if it drifts off-screen
    if (this.y > height + 50) {
      this.y = -50;
      this.x = random(width);
    }

    // Interaction: Slow down or glow near the mouse
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < 100) {
      this.speedY = 0.5; // Slow down
      if (this.isSpecial) {
        this.color = color(255, 240, 150); // Brighter glow
      }
    } else {
      this.speedY = this.isSpecial ? 2 : random(1, 3); // Resume normal speed
      this.color = this.isSpecial ? color(255, 200, 100) : color(200, 220, 255);
    }
  }

  // Display the word
  display() {
    push();
    translate(this.x, this.y);

    // Glow effect for special words
    if (this.isSpecial) {
      noFill();
      stroke(this.color);
      strokeWeight(1.5);
      ellipse(0, 0, this.size * 2); // Glow circle
    }

    fill(this.color);
    noStroke();
    textSize(this.size);
    text(this.text, 0, 0);

    pop();
  }
}
