var Waveform = require('../components/waveform')

module.exports = function waveformView (state, emit) {
  console.log('waveform', typeof Waveform)

  return state.cache(Waveform, 'waveform').render(state.waveform)
}

