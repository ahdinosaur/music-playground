var html = require('choo/html')
var css = require('sheetify')
var devtools = require('choo-devtools')
var choo = require('choo')

css('./index.css')

var app = choo()

app.use(devtools())
app.use(require('./stores/keyboard'))
app.use(require('./stores/instrument'))
app.use(require('./stores/scale'))
app.use(require('./stores/player'))
app.use(require('./stores/waveform'))
app.use(require('./stores/microphone.js'))
app.route('/', require('./views/main'))

var tree = app.start()
document.body.appendChild(tree)

app.emitter.on('DOMContentLoaded', () => {
  app.emit('instrument', 'acoustic_grand_piano')
})
