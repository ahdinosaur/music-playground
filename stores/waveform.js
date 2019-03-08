var Waveform = require('../components/waveform')
var Tonal = require('tonal')

module.exports = function waveformStore (state, emitter) {
  var analyser = state.player.analyser
  var bufferLength = 2048
  var data = new Float32Array(bufferLength)

  state.waveform = {
    data,
    range: [0, bufferLength],
    amplitude: [-0.1, +0.1],
    color: [0,0,1,1],
    thickness: '2px'
  }

  requestAnimationFrame(analyse)
  function analyse () {
    requestAnimationFrame(analyse)

    analyser.getFloatTimeDomainData(data)

    var waveformComponent = state.cache(Waveform, 'waveform')
    var waveform = waveformComponent.waveform

    // try to render a number of samples that is a multiple
    // of the number of the samples from the frequency of the last note.
    if (state.player.lastNote) {
      var noteFreq = Tonal.Note.freq(state.player.lastNote)
      var noteLength = state.player.audioContext.sampleRate / noteFreq
      var noteRepeats = bufferLength / noteLength
      var numSamples = Math.round(Math.floor(noteRepeats) * noteLength)
      state.waveform.range = [bufferLength - numSamples, bufferLength]
    }

    waveform.update(state.waveform)
    waveform.render()

    waveformComponent.render(state.waveform)
  }
}
