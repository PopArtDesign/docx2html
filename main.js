import './style.css'

import mammoth from 'mammoth/mammoth.browser.js'
import beautify from 'js-beautify'
import Swal from 'sweetalert2'

const input = document.querySelector('#file')
const output = document.querySelector('#output')
const copyButton = document.querySelector('#copy')

const alert = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
        popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
})

const success = (title = 'Success!') => {
    return alert.fire({
        title,
        icon: 'success',
    })
}

input.addEventListener('change', (event) => {
    readFileInputEventAsArrayBuffer(event, (arrayBuffer) => {
        output.value = 'Processing...'

        mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
            .then((result) => {
                const html = beautify.html(
                    // Remove NO-BREAK SPACE. See https://unicode-explorer.com/c/00A0
                    result.value.replace(/\u00A0/g, ' ')
                )

                output.value = beautify.html(html)

                success('Done!')
            })
    })
}, false)

copyButton.addEventListener('click', (event) => {
    navigator.clipboard.writeText(output.value).then(result => success('Copied!'))
})

const readFileInputEventAsArrayBuffer = (event, callback) => {
    const file = event.target.files[0]

    const reader = new FileReader()

    reader.onload = function(loadEvent) {
        const arrayBuffer = loadEvent.target.result
        callback(arrayBuffer)
    };

    reader.readAsArrayBuffer(file)
}
