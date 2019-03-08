var html = require('choo/html')
var devtools = require('choo-devtools')
var choo = require('choo')
var Soundfont = require('soundfont-player')
var Waveform = require('gl-waveform')
var Tonal = require('tonal')

var audioContext = new window.AudioContext()

var app = choo()

app.use(devtools())
app.use(playerStore)
app.route('/', mainView)
app.mount('main')

app.emitter.on('DOMContentLoaded', () => {
  app.emit('loadInstrument', 'acoustic_grand_piano')
})

function mainView (state, emit) {
  return html`
    <main>
      <button onclick=${onPlay}>Play</button>
    </main>
  `

  function onPlay () {
    emit('play', 'C4')
  }
}

function playerStore (state, emitter) {
  emitter.on('loadInstrument', function (instrumentId) {
    state.instrument = null
    Soundfont.instrument(audioContext, instrumentId).then(function (instrument) {
      state.instrument = instrument
    })
  })

  emitter.on('play', function (note) {
    if (state.instrument == null) return
    state.instrument.play(note)
  })
}
