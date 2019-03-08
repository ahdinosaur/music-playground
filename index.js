var html = require('choo/html')
var devtools = require('choo-devtools')
var choo = require('choo')
var Soundfont = require('soundfont-player')
var Waveform = require('gl-waveform')
var Tonal = require('tonal')

var audioContext = new window.AudioContext()

var app = choo()

app.use(devtools())
app.use(keyboardStore)
app.use(scaleStore)
app.use(playerStore)
app.route('/', mainView)
app.mount('main')

app.emitter.on('DOMContentLoaded', () => {
  app.emit('player:instrument', 'acoustic_grand_piano')
})

function mainView (state, emit) {
  return html`
    <main>
      ${keyboardView(state, emit)}
      ${scaleView(state, emit)}
      ${playerView(state, emit)}
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

function playerStore (state, emitter) {
  emitter.on('player:instrument', function (instrumentId) {
    state.instrument = null
    Soundfont.instrument(audioContext, instrumentId).then(function (instrument) {
      state.instrument = instrument
    })
  })

  emitter.on('player:note', function (note) {
    if (state.instrument == null) return
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
