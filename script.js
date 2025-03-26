const handleSubmit = (event) => {
    event.preventDefault();

    const nome = document.querySelector('input[name=nome]').value;
    const idade = document.querySelector('input[name=idade]').value;
    const sexo = document.querySelector('input[name=sexo]').value;

    fetch('https://api.sheetmonkey.io/form/2dcxE6ZnbbphvsByB5QKsb', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({nome, idade, sexo})
    })
}

document.querySelector('form').addEventListener('submit', handleSubmit);