var html = require('choo/html')
var Tonal = require('tonal')

module.exports = function scaleView (state, emit) {
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
