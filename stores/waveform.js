var Waveform = require('../components/waveform')
var Tonal = require('tonal')

module.exports = function waveformStore (state, emitter) {
  var data = state.player.data

  state.waveform = {
    data,
    range: [0, data.length],
    amplitude: [-0.1, +0.1],
    color: [0, 0, 1, 1],
    thickness: '2px'
  }

  emitter.on('player:data', data => {
    var waveformComponent = state.cache(Waveform, 'waveform')
    var waveform = waveformComponent.waveform

    // try to render a number of samples that is a multiple
    // of the number of the samples from the frequency of the last note.
    if (state.player.lastNote) {
      var noteFreq = Tonal.Note.freq(state.player.lastNote)
      var noteLength = state.player.audioContext.sampleRate / noteFreq
      var noteRepeats = data.length / noteLength
      var numSamples = Math.round(Math.floor(noteRepeats) * noteLength)
      state.waveform.range = [data.length - numSamples, data.length]
    }

    waveform.update(state.waveform)
    waveform.render()

    waveformComponent.render(state.waveform)
  })
}
