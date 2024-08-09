<template>
    <div :class="keyboardClass"></div>
</template>

<script>
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';

const requireComponent = require.context(
  // The relative path of the components folder
  './layouts',
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

export default {
    name: "SimpleKeyboard",
    props: {
        keyboardClass: {
            default: "simple-keyboard",
            type: String
        },
        value: {
            type: String
        },
        layout: {
            type: String,
            default: 'alphabet'
        }
    },
    data: () => ({
        keyboard: null,
        layouts: modules,
    }),
    watch: {
        value(val) {
            this.keyboard.setInput(val);
        }
    },
    mounted() {
        const layout = Object.keys(this.layouts).includes(this.layout) ? this.layout : 'alphabet'
        this.keyboard = new Keyboard(this.keyboardClass, {
            onChange: this.onChange,
            onKeyPress: this.onKeyPress,
            ...this.layouts[layout]
        })
    },
    methods: {
        onChange(val) {
            this.$emit("input", val);
        },
        onKeyPress(button) {
            this.$emit("on-key-press", button);
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="scss" scoped>
</style>
