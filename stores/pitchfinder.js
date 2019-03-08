var Tonal = require('tonal')
var Pitchfinder = require('pitchfinder')
var detectPitch = Pitchfinder.AMDF()

module.exports = function pitchfinderStore (state, emitter) {
  state.pitch = {
    frequency: null,
    matches: [],
    possible: computePossiblePitches()
  }

  // skip some detection so as not to slow down the app
  var skip = 0
  emitter.on('player:data', data => {
    if (skip++ !== 0) {
      if (skip === 3) skip = 0
      return
    }

    var pitch = detectPitch(data)
    if (pitch == null) return

    state.pitch.frequency = pitch
    state.pitch.matches = computeMatches(state.pitch.possible, pitch)

    emitter.emit('render')
  })
}

function computePossiblePitches () {
  var pitches = []
  ;[1, 2, 3, 4, 5, 6].forEach(octave => {
    Tonal.Note.names().forEach(note => {
      var name = `${note}${octave}`
      pitches.push({
        name,
        frequency: Tonal.Note.freq(name)
      })
    })
  })
  return pitches
}

function computeMatches (possibles, pitch) {
  var NUM_MATCHES = 5
  var index = possibles.findIndex(possible => {
    return pitch < possible.frequency
  })
  if (index < NUM_MATCHES - Math.floor(NUM_MATCHES / 2)) {
    return possibles.slice(0, NUM_MATCHES)
  } else if (index > possibles.length - Math.ceil(NUM_MATCHES / 2)) {
    return possibles.slice(possibles.length - NUM_MATCHES, possibles.length)
  } else {
    return possibles.slice(index - 3, index + 2)
  }
}
