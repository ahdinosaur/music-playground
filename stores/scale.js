var Tonal = require('tonal')

module.exports = function scaleStore (state, emitter) {
  state.scale = {
    note: 'C',
    type: 'major'
  }
  computeNotes()

  emitter.on('scale:note', note => {
    state.scale.note = note
    computeNotes()
    emitter.emit('render')
  })

  emitter.on('scale:type', type => {
    state.scale.type = type
    computeNotes()
    emitter.emit('render')
  })

  function computeNotes () {
    var allNotes = Tonal.Note.names()
    var scaleNotes = Tonal.Scale.notes(state.scale.note, state.scale.type)
    var notes = []

    var octave = 1
    var scaleNoteIndex = 0
    var previousNote = scaleNotes[0]

    while (octave <= 6) {
      var note = scaleNotes[scaleNoteIndex]

      if (allNotes.indexOf(previousNote) > allNotes.indexOf(note)) {
        octave++
      }

      notes.push(note + octave)

      previousNote = note
      scaleNoteIndex = (scaleNoteIndex + 1) % scaleNotes.length
    }

    state.notes = notes
  }
}
