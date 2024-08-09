const keys = [
    "1 2 3 4 5 6 7 8 9 0 {backspace}",
    "Q W E R T Y U I O P",
    "A S D F G H J K L",
    "Z X C V B N M {enter}",
]
export default {
    layout: {
        default: keys,
    },
    buttonTheme: [
        {
            class: 'button-theme',
            buttons: keys.join(' ')
        }
    ],
    display: {
        '{backspace}': '退格',
        '{enter}': '提交'
    }
}