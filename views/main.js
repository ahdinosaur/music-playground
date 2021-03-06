var html = require('choo/html')

var keyboardView = require('./keyboard')
var scaleView = require('./scale')
var instrumentView = require('./instrument')
var playerView = require('./player')
var microphoneView = require('./microphone')
var pitchfinderView = require('./pitchfinder')
var waveformView = require('./waveform')

module.exports = function mainView (state, emit) {
  return html`
    <div>
      ${keyboardView(state, emit)}
      ${scaleView(state, emit)}
      ${instrumentView(state, emit)}
      ${playerView(state, emit)}
      ${microphoneView(state, emit)}
      ${pitchfinderView(state, emit)}
      ${waveformView(state, emit)}
    </div>
  `
}
