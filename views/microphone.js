var html = require('choo/html')

module.exports = function microphoneView (state, emit) {
  return html`
    <div>
      microphone:
      <input
        type="checkbox"
        checked=${state.microphone}
        onchange=${onMicrophoneChange}
      />
    </div>
  `

  function onMicrophoneChange (ev) {
    var status = ev.target.checked
    if (status) emit('microphone:on')
    else emit('microphone:off')
  }
}
