var Soundfont = require('soundfont-player')

module.exports = function instrumentStore (state, emitter) {
  state.instruments = require('soundfont-player/instruments.json')

  emitter.on('instrument', function (instrumentId) {
    state.instrumentId = instrumentId
    state.instrument = null

    emitter.emit('render')

    Soundfont.instrument(state.player.audioContext, instrumentId, {
      destination: state.player.merger
    })
      .then(function (instrument) {
        state.instrument = instrument
      })
  })
}
