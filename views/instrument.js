var html = require('choo/html')

module.exports = function instrumentView (state, emit) {
  return html`
    <div>
      instrument:
      <select id="instrument" onchange=${onInstrumentChange}>
        ${state.instruments.map(instrumentId => html`
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
