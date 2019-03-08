var html = require('choo/html')
var devtools = require('choo-devtools')
var choo = require('choo')
var Component = require('choo/component')
var Soundfont = require('soundfont-player')
var GlWaveform = require('gl-waveform')
var Tonal = require('tonal')

var app = choo()

app.use(devtools())
app.use(keyboardStore)
app.use(instrumentStore)
app.use(scaleStore)
app.use(playerStore)
app.use(waveformStore)
app.route('/', mainView)
app.mount('main')

app.emitter.on('DOMContentLoaded', () => {
  app.emit('instrument', 'acoustic_grand_piano')
})

function mainView (state, emit) {
  return html`
    <main>
      ${keyboardView(state, emit)}
      ${scaleView(state, emit)}
      ${instrumentView(state, emit)}
      ${playerView(state, emit)}
      ${waveformView(state, emit)}
    </main>
  `

  function onPlay () {
    emit('player:note', 'C4')
  }
}

function scaleView (state, emit) {
  return html`
    <div>
      scale:
      <select id="scaleNote" onchange=${onScaleNoteChange}>
        ${Tonal.Note.names().map(name => html`
          <option
            value="${name}"
            id="${name}"
            selected=${state.scale.note == name}
          >
            ${name}
          </option>
        `)}
      </select>
      <select id="scaleType" onchange=${onScaleTypeChange}>
        ${Tonal.Scale.names().map(name => html`
          <option
            value="${name}"
            id="${name}"
            selected=${state.scale.type == name}
          >
            ${name}
          </option>
        `)}
      </select>
    </div>
  `

  function onScaleNoteChange (ev) {
    emit('scale:note', ev.target.value)
  }

  function onScaleTypeChange (ev) {
    emit('scale:type', ev.target.value)
  }
}

function scaleStore (state, emitter) {
  state.scale = {
    note: 'C',
    type: 'major'
  }
  computeNotes()

  emitter.on('scale:note', note => {
    state.scale.note = note
    computeNotes()
    emitter.emit('render')
  })

  emitter.on('scale:type', type => {
    state.scale.type = type
    computeNotes()
    emitter.emit('render')
  })

  function computeNotes () {
    state.notes = [1, 2, 3, 4, 5, 6].reduce(
      (sofar, octave) => [
        ...sofar,
        ...Tonal.Scale.notes(state.scale.note, state.scale.type).map(note => {
          return note + octave
        })
      ],
      []
    )
  }
}

var instruments = require('soundfont-player/instruments.json')

function instrumentView (state, emit) {
  return html`
    <div>
      instrument:
      <select id="instrument" onchange=${onInstrumentChange}>
        ${instruments.map(instrumentId => html`
          <option
            value="${instrumentId}"
            id="${instrumentId}"
            selected=${instrumentId === state.instrumentId}
          >
            ${instrumentId}
          </option>
        `)}
      </select>
    </div>
  `
  
  function onInstrumentChange (ev) {
    emit('instrument', ev.target.value)
  }
}

function instrumentStore (state, emitter) {
  state.instruments = instruments

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

function playerView (state, emit) {
  return html`
    <div>
      notes:
      ${state.notes.map(note => {
        return html`
          <button
            onclick=${onPlay(note)}
          >
            ${note}
          </button>
        `
      })}
    </div>
  `

  function onPlay (note) {
    return ev => emit('player:note', note)
  }
}

function playerStore (state, emitter) {
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

var keyboards = [
  { name: 'colemak', keys: '1234567890-=qwfpgjluy;[]arstdhneio\'zxcvbkm,./' },
  { name: 'qwerty', keys: '1234567890-=qwertyuiop[]asdfghjkl;\'zxcvbnm,./' }
]

function keyboardView (state, emit) {
  return html`
    <div>
      keyboard:
      <select id="keyboard" onchange=${onKeyboardChange}>
        ${keyboards.map(keyboard => html`
          <option
            value="${keyboard.name}"
            id="${keyboard.name}"
            selected=${keyboard == state.keyboard}
          >
            ${keyboard.name}
          </option>
        `)}
      </select>
    </div>
  `

  function onKeyboardChange (ev) {
    var name = ev.target.value
    var keyboard = keyboards.find(keyboard => keyboard.name === name)
    emit('keyboard', keyboard)
  }
}

function keyboardStore (state, emitter) {
  state.keyboard = keyboards[0]
  emitter.on('keyboard', keyboard => {
    state.keyboard = keyboard
    emitter.emit('render')
  })

  document.body.addEventListener('keydown', ev => {
    var keyIndex = state.keyboard.keys.indexOf(ev.key)
    if (keyIndex == -1) return
    var note = state.notes[keyIndex]
    if (note == null) return
    emitter.emit('player:note', note)
  })
}

class Waveform extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
  }

  load (element) {
    this.waveform = new GlWaveform()
  }

  update (options) {
    return false
  }

  createElement (options) {
    this.local.options = options
    return html`<div></div>`
  }
}

function waveformView (state, emit) {
  return state.cache(Waveform, 'waveform').render(state.waveform)
}

function waveformStore (state, emitter) {
  var analyser = state.player.analyser
  var bufferLength = 2048
  var data = new Float32Array(bufferLength)

  state.waveform = {
    data,
    range: [0, bufferLength],
    amplitude: [-0.1, +0.1],
    color: [0,0,1,1],
    thickness: '3em'
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
      waveform.update(state.waveform)
    }

    waveform.render()

    waveformComponent.render(state.waveform)
  }
}
