module.exports = function keyboardStore (state, emitter) {
  state.keyboards = [
    { name: 'colemak', keys: '1234567890-=qwfpgjluy;[]arstdhneio\'zxcvbkm,./' },
    { name: 'qwerty', keys: '1234567890-=qwertyuiop[]asdfghjkl;\'zxcvbnm,./' }
  ]

  state.keyboard = state.keyboards[0]
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

