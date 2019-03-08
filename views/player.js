var html = require('choo/html')

module.exports = function playerView (state, emit) {
  return html`
    <div>
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
      <div>
        last note: ${state.player.lastNote}
      </div>
    </div>
  `

  function onPlay (note) {
    return ev => emit('player:note', note)
  }
}
