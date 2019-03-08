module.exports = function microphoneStore (state, emitter) {
  var constraints = { audio: true }
  var source

  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      source = state.player.audioContext.createMediaStreamSource(stream)
      source.connect(state.player.merger)
    })
}
