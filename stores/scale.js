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
    state.notes = [1, 2, 3, 4, 5, 6].reduce(
      (sofar, octave) => [
        ...sofar,
        ...Tonal.Scale.notes(state.scale.note, state.scale.type).map(note => {
          return note + octave
        })
      ],
      []
    )
  }
}
