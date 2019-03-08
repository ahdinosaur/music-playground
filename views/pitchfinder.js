var html = require('choo/html')

module.exports = function pitchfinderView (state, emit) {
  return html`
    <div>
      pitch finder:
      <div>
        frequency: ${state.pitch.frequency}
      </div>
      <div>
        matches:
          <ul>
            ${state.pitch.matches.map(match => html`
              <li>
                name: ${match.name}
                frequency: ${match.frequency}
              </li>
            `)}
          </ul>
      </div>
    </div>
  `
}
