module.exports = function playerStore (state, emitter) {
  var audioContext = new window.AudioContext()

  var merger = audioContext.createChannelMerger(1)
  var analyser = audioContext.createAnalyser()

  state.player = {
    audioContext,
    merger,
    analyser
  }

  merger.connect(analyser)
  analyser.connect(audioContext.destination)

  emitter.on('player:note', function (note) {
    if (state.instrument == null) return
    state.player.lastNote = note
    state.instrument.play(note)
  })
}
