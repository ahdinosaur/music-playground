var html = require('choo/html')

module.exports = function playerView (state, emit) {
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
