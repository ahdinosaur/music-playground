module.exports = function playerStore (state, emitter) {
  var audioContext = new window.AudioContext()

  var merger = audioContext.createChannelMerger(1)
  var analyser = audioContext.createAnalyser()

  var bufferLength = 2048
  var data = new Float32Array(bufferLength)
  window.requestAnimationFrame(analyse)
  function analyse () {
    window.requestAnimationFrame(analyse)
    analyser.getFloatTimeDomainData(data)
    emitter.emit('player:data', data)
  }

  state.player = {
    audioContext,
    merger,
    analyser,
    data
  }

  merger.connect(analyser)
  analyser.connect(audioContext.destination)

  emitter.on('player:note', function (note) {
    if (state.instrument == null) return
    state.player.lastNote = note
    state.instrument.play(note)
  })
}
