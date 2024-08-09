import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const requireComponent = require.context(
  // The relative path of the components folder
  './modules',
  // Whether or not to look in subfolders
  false,
  // The regular expression used to match base component filenames
  /\w+\.js$/
)

const modules = {}

requireComponent.keys().forEach(fileName => {
  // Get component config
  const componentConfig = requireComponent(fileName)

  // Gets the file name regardless of folder depth
  const componentName = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')

  // Look for the component options on `.default`, which will
  // exist if the component was exported with `export default`,
  // otherwise fall back to module's root.
  modules[componentName] = componentConfig.default || componentConfig
})

export default new Vuex.Store({
  modules
})
