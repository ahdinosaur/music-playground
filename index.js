var html = require('choo/html')
var devtools = require('choo-devtools')
var choo = require('choo')
var Soundfont = require('soundfont-player')
var Waveform = require('gl-waveform')
var Tonal = require('tonal')

var audioContext = new window.AudioContext()

var app = choo()

app.use(devtools())
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
      ${[1, 2, 3, 4, 5, 6].map(octave => {
        return Tonal.Scale.notes(state.scale.note, state.scale.type).map(note => {
          return html`
            <button
              onclick=${onPlay(`${note}${octave}`)}
            >
              ${note}${octave}
            </button>
          `
        })
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

  emitter.on('scale:note', note => {
    state.scale.note = note
    emitter.emit('render')
  })

  emitter.on('scale:type', type => {
    state.scale.type = type
    emitter.emit('render')
  })
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
