let activeChord: number[] = [];
let CMaj: number[] = [];
let FMaj: number[] = [];
let G7Maj: number[] = [];
let lastMsg = "";
let msg = "";
let myColours: number[] = [];
let noteFreqs: number[] = [];
let noteLengthPos = 0;
let noteLengths: number[] = [];
let currentNoteLength: number = 0;
let proModeNote = "";
let strip: neopixel.Strip = null;
let testBeatMsgs: string[] = [];
let testMessages: string[] = [];

basic.forever(function() {
  playNoteFromNoteNumberAndChord(2, activeChord);
  basic.pause(currentNoteLength);
});

input.onButtonPressed(Button.A, function() {
  msg = "R1";
  processMessage();
});

input.onButtonPressed(Button.AB, function() {
  msg = testBeatMsgs[Math.randomRange(0, 3)];
  processMessage();
});

input.onButtonPressed(Button.B, function() {
  msg = testMessages[Math.randomRange(0, 2)];
  processMessage();
});

// When Recieve Radio Message
radio.onReceivedString(function(receivedString) {
  // Tells you when it is recieving messages
  led.toggle(0, 0);
  msg = receivedString;
  processMessage();
});

// Processes the Message and Plays a note
function processMessage() {
  if (msg.charAt(0) == "H") {
    updateChord();
  } else {
    if (lastMsg !== msg) {
      currentNoteLength = noteLengths[parseInt(msg.charAt(1)) - 1];
      if (msg == "R.") {
        music.rest(5);
        neopixel.colors(NeoPixelColors.Black);
      } else if (msg.charAt(0) == "R") {
        if (msg.charAt(1) == "P") {
          proModeNote = msg.charAt(2);
          let freq = getFrequencyForNoteName(proModeNote);
          let index = getIndexForNoteName(proModeNote);
          neoPixelsShowColour(index);
          music.ringTone(freq);
        } else {
          playNoteFromNoteNumberAndChord(2, activeChord);
        }
      }
    }
    lastMsg = msg;
  }
}

// Checks what chord is being set by the Harmony Glove
function updateChord() {
  if (msg.charAt(1) == "C") {
    activeChord = CMaj;
    basic.clearScreen();
    led.plot(4, 0);
  } else if (msg.charAt(1) == "G") {
    activeChord = G7Maj;
    basic.clearScreen();
    led.plot(4, 1);
  } else if (msg.charAt(1) == "F") {
    activeChord = FMaj;
    basic.clearScreen();
    led.plot(4, 2);
  }
}

// Playing note from Message sent and chord set
function playNoteFromNoteNumberAndChord(noteNum: number, chordIxs: number[]) {
  let freqIx = chordIxs[noteNum];
  strip.showColor(neopixel.colors(NeoPixelColors.Red));
  music.ringTone(noteFreqs[freqIx]);
  basic.pause(currentNoteLength);
  music.ringTone(0);
  strip.showColor(neopixel.colors(NeoPixelColors.Black));
}

function getIndexForNoteName(noteName: string) {
  //TODO: protect against bad inputs
  return noteName.charCodeAt(0) - 65;
}

// Pro Mode - Plays note from the Note Name
function getFrequencyForNoteName(noteName: string) {
  return noteFreqs[getIndexForNoteName(noteName)];
}

function neoPixelsShowColour(index: number) {
  strip.showColor(neopixel.colors(myColours[index]));
}

testMessages = ["HC", "HG", "HF"];
testBeatMsgs = ["R1", "R2", "R3", "R4"];
strip = neopixel.create(DigitalPin.P1, 5, NeoPixelMode.RGB);
myColours = [
  neopixel.colors(NeoPixelColors.Red),
  neopixel.colors(NeoPixelColors.Green),
  neopixel.rgb(155, 155, 255),
  neopixel.colors(NeoPixelColors.Yellow),
  neopixel.colors(NeoPixelColors.Purple)
];
strip.setBrightness(255);
strip.showColor(neopixel.colors(NeoPixelColors.Red));

// setting up chord arrays
CMaj = [2, 4, 6];
G7Maj = [6, 1, 3, 5];
FMaj = [5, 7, 2];
activeChord = CMaj;

//setting up note lengths
noteLengths = [100, 200, 300, 400];
currentNoteLength = noteLengths[0];

// Frequency and Test array setups
noteFreqs = [220, 247, 131, 147, 165, 175, 196];

function setUpRadioGroup() {
  // Radio Setup
  if (input.buttonIsPressed(Button.A)) {
    radio.setGroup(42);
    basic.showNumber(42);
  } else if (input.buttonIsPressed(Button.B)) {
    radio.setGroup(43);
    basic.showNumber(43);
  } else {
    radio.setGroup(41);
    basic.showNumber(41);
  }
}

// Show there is power
basic.showLeds(`
    # # . . .
    # . . . .
    # . # # .
    . . # . .
    . . # . .
    `);
