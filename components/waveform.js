var html = require('choo/html')
var Component = require('choo/component')
var GlWaveform = require('gl-waveform')

module.exports = class Waveform extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {}
  }

  load (element) {
    this.waveform = new GlWaveform()
  }

  update (options) {
    return false
  }

  createElement (options) {
    this.local.options = options
    return html`<div></div>`
  }
}
