let testMessages: string[] = []
let testBeatMsgs: string[] = []
let activeChord: number[] = []
let lastMsg = ''
input.onButtonPressed(Button.A, function () {
    msg = "R1"
    processMessage()
})
input.onButtonPressed(Button.AB, function () {
    msg = testBeatMsgs[Math.randomRange(0, 3)]
    processMessage()
})
input.onButtonPressed(Button.B, function () {
    msg = testMessages[Math.randomRange(0, 2)]
    processMessage()
})
// When Recieve Radio Message
radio.onReceivedString(function (receivedString) {
    // Tells you when it is recieving messages
    led.toggle(0, 0)
    msg = receivedString
    processMessage()
})
// Processes the Message and Plays a note
function processMessage() {
    if (msg.charAt(0) == "H") {
        updateChord()
    } else {
        if (lastMsg !== msg) {
            noteLengthPos = parseInt(msg.charAt(1))
            if (msg == "R.") {
                music.rest(5)
                neopixel.colors(NeoPixelColors.Black)
            } else if (msg.charAt(0) == "R") {
                if (msg.charAt(1) == "P") {
                    proModeNote = msg.charAt(2)
                    neoPixelsShowColour(index)
                    music.ringTone(getFrequencyForNoteName(proModeNote))
                } else if (activeChord == CMaj) {
                    playNoteFromNoteNumberAndChord(2, CMaj)
                } else if (activeChord == G7Maj) {
                    playNoteFromNoteNumberAndChord(2, G7Maj)
                } else if (activeChord == FMaj) {
                    playNoteFromNoteNumberAndChord(2, FMaj)
                } else {
                    music.rest(5)
                    neoPixelsShowColour(4)
                }
            }
        }
        lastMsg = msg
    }
}
// Checks what chord is being set by the Harmony Glove
function updateChord() {
    if (msg.charAt(1) == "C") {
        activeChord = CMaj
        basic.clearScreen()
        led.plot(4, 0)
    } else if (msg.charAt(1) == "G") {
        activeChord = G7Maj
        basic.clearScreen()
        led.plot(4, 1)
    } else if (msg.charAt(1) == "F") {
        activeChord = FMaj
        basic.clearScreen()
        led.plot(4, 2)
    }
}


function neoPixelsShowColour(index: number) {
    strip.showColor(neopixel.colors(myColours[index]))
}

basic.forever(function () {
    playNoteFromNoteNumberAndChord(2, activeChord)
    basic.pause(NoteLength[noteLengthPos - 1])
})

// Playing note from Message sent and chord set
function playNoteFromNoteNumberAndChord(NoteNum: number, chordIxs: number[]) {
    let freqIx = chordIxs[NoteNum]
    music.ringTone(noteFreqs[freqIx])
    strip.showColor(neopixel.colors(NeoPixelColors.Red))
    basic.pause(NoteLength[noteLengthPos - 1])
    music.rest(50)
    strip.showColor(neopixel.colors(NeoPixelColors.Black))
}
// Pro Mode - Plays note from the Note Name
function getFrequencyForNoteName(noteName: string) {
    index = noteName.charCodeAt(0) - 65
    return noteFreqs[index]
    return index
}
let noteFreqs: number[] = []
let index = 0
let CMaj: number[] = []
let G7Maj: number[] = []
let proModeNote = ""
let myColours: number[] = []
let strip: neopixel.Strip = null
let noteLengthPos = 0
let msg = ""
let FMaj: number[] = []
let NoteLength: number[] = []
testMessages = ["HC", "HG", "HF"]
testBeatMsgs = ["R1", "R2", "R3", "R4"]
strip = neopixel.create(DigitalPin.P1, 5, NeoPixelMode.RGB)
myColours = [neopixel.colors(NeoPixelColors.Red), neopixel.colors(NeoPixelColors.Green), neopixel.rgb(155, 155, 255), neopixel.colors(NeoPixelColors.Yellow), neopixel.colors(NeoPixelColors.Purple)]
strip.setBrightness(255)
strip.showColor(neopixel.colors(NeoPixelColors.Red))

// setting up chord arrays
CMaj = [2, 4, 6]
G7Maj = [6, 1, 3, 5]
FMaj = [5, 7, 2]
NoteLength = [100, 200, 300, 400]
activeChord = CMaj


// Frequency and Test array setups
noteFreqs = [220, 247, 131, 147, 165, 175, 196]

// Radio Setup
if (input.buttonIsPressed(Button.A)) {
    radio.setGroup(42)
    basic.showNumber(42)
} else if (input.buttonIsPressed(Button.B)) {
    radio.setGroup(43)
    basic.showNumber(43)
} else {
    radio.setGroup(41)
    basic.showNumber(41)
}
// Check to see if there is power
basic.showLeds(`
    # # . . .
    # . . . .
    # . # # .
    . . # . .
    . . # . .
    `)