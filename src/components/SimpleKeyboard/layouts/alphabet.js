const keys = [
    'q w e r t y u i o p {backspace}',
    'a s d f g h j k l {enter}',
    'z x c v b n m {escape}'
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
        '{enter}': '提交',
        '{escape}': '收起'
    }
}