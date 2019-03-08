var Waveform = require('../components/waveform')

module.exports = function waveformView (state, emit) {
  return state.cache(Waveform, 'waveform').render(state.waveform)
}
