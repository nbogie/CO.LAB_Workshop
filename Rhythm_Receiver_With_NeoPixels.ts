let activeChord: number[] = [];
let CMaj: number[] = [];
let FMaj: number[] = [];
let G7Maj: number[] = [];
let prevMsg = "";
let noteLengthPos = 0;
let currentNoteLength: number = 0;
let strip: neopixel.Strip = null;
let testBeatMsgs: string[] = [];
let testMessages: string[] = [];

basic.forever(function() {
  playNoteFromNoteNumberAndChord(2, activeChord);
  basic.pause(currentNoteLength);
});

input.onButtonPressed(Button.A, function() {
  processMessage("R1");
});

input.onButtonPressed(Button.B, function() {
  let testMsg = pickFromArray(testBeatMsgs);
  processMessage(testMsg);
});

input.onButtonPressed(Button.AB, function() {
  let testMsg = pickFromArray(testMessages);
  processMessage(testMsg);
});

function pickFromArray<T>(arr: T[]): T {
  return arr[Math.randomRange(0, arr.length - 1)];
}

// When Recieve Radio Message
radio.onReceivedString(function(receivedString) {
  // Tells you when it is recieving messages
  led.toggle(0, 0);
  processMessage(receivedString);
});

// Processes the Message and Plays a note
function processMessage(msg: string) {
  if (msg.charAt(0) == "H") {
    updateChord(msg);
  } else {
    if (prevMsg !== msg) {
      if (msg == "R.") {
        music.ringTone(0);
        neopixel.colors(NeoPixelColors.Black);
      } else if (msg.charAt(0) == "R") {
        if (msg.charAt(1) == "P") {
          //no pro-mode designed for rhythm receiver
        } else {
            currentNoteLength = noteLengths[parseInt(msg.charAt(1)) - 1];
            playNoteFromNoteNumberAndChord(2, activeChord);
        }
      }
    }
    prevMsg = msg;
  }
}

// updates current chord based on what chord has just
// been sent by the Harmony Glove
function updateChord(msg: string) {
  if (msg.length < 2) {
    return;
  }
  let chordChar = msg.charAt(1);
  basic.clearScreen();
  switch (chordChar) {
    case "C":
      activeChord = CMaj;
      led.plot(4, 0);
      break;
    case "G":
      activeChord = G7Maj;
      led.plot(4, 1);
      break;
    case "F":
      activeChord = FMaj;
      led.plot(4, 2);
      break;
    default:
      //do nothing - unrecognised chord char
      break;
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

function neoPixelsShowColour(index: number) {
  strip.showColor(neopixel.colors(myColours[index]));
}

const myColours: number[] = [
  neopixel.colors(NeoPixelColors.Red),
  neopixel.colors(NeoPixelColors.Green),
  neopixel.rgb(155, 155, 255),
  neopixel.colors(NeoPixelColors.Yellow),
  neopixel.colors(NeoPixelColors.Purple)
];
// Frequency and Test array setups
const noteFreqs: number[] = [220, 247, 131, 147, 165, 175, 196];
const noteLengths: number[] = [100, 200, 300, 400];
currentNoteLength = noteLengths[0];

testMessages = ["HC", "HG", "HF"];
testBeatMsgs = ["R1", "R2", "R3", "R4"];
strip = neopixel.create(DigitalPin.P1, 5, NeoPixelMode.RGB);
strip.setBrightness(255);
strip.showColor(neopixel.colors(NeoPixelColors.Red));

// setting up chord arrays
CMaj = [2, 4, 6];
G7Maj = [6, 1, 3, 5];
FMaj = [5, 7, 2];
activeChord = CMaj;

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
