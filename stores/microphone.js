module.exports = function microphoneStore (state, emitter) {
  var constraints = { audio: true }
  var source
  state.microphone = false

  emitter.on('microphone:on', () => {
    state.microphone = true
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        source = state.player.audioContext.createMediaStreamSource(stream)
        source.connect(state.player.merger)
      })
  })

  emitter.on('microphone:off', () => {
    if (source) source.disconnect(state.player.merger)
    source = null
  })
}
