var html = require('choo/html')

module.exports = function keyboardView (state, emit) {
  return html`
    <div>
      keyboard:
      <select id="keyboard" onchange=${onKeyboardChange}>
        ${state.keyboards.map(keyboard => html`
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

