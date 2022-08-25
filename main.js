import './style.css'

import mammoth from 'mammoth/mammoth.browser.js'
import beautify from 'js-beautify'
import Swal from 'sweetalert2'
import Prism from 'prismjs'

const input = document.querySelector('#file')
const output = document.querySelector('#output')
const copyButton = document.querySelector('#copy')

let result = ''

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

const alertSuccess = async (title = 'Success!') => {
    return alert.fire({ title, icon: 'success' })
}

const alertError = async (title = 'Error!') => {
    return alert.fire({ title, icon: 'error' })
}

copyButton.addEventListener('click', (event) => {
    navigator.clipboard
        .writeText(result)
        .then(result => alertSuccess('Copied!'))
})

input.addEventListener('change', async (event) => {
    result = ''
    output.innerText = 'Processing...'

    const [ file ] = event.target.files

    try {
        result = await convertFile(file)
    } catch (e) {
        output.innerText = ''
        alertError('Error!')

        throw e
    }

    output.innerHTML = Prism.highlight(result, Prism.languages.html, 'html')

    alertSuccess('Done!')
})

const convertFile = async (file) => {
    const arrayBuffer = await file.arrayBuffer()

    const rawHtml = await mammoth.convertToHtml({ arrayBuffer })

    const html = beautifyHtml(rawHtml.value)

    return html
}

const beautifyHtml = (html) => {
    return beautify.html(
        // Remove NO-BREAK SPACE. See https://unicode-explorer.com/c/00A0
        html.replace(/\u00A0/g, ' ')
    )
}
