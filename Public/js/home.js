$('form').on('submit', (e) => {
    e.preventDefault()
    $.ajax({
        method:"POST",
        data: {
            username : $('.username').val(),
            position : $('.position').val(),
            pwd : $('.pwd').val()
        },
        success: (data) => {
            window.location = data.LOGIN
        }
    })
})