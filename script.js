const disruptors = ['BPA', 'Phthalates', 'Dioxins', 'Atrazine', 'Perchlorate'];

function checkDisruptor() {
    const input = document.getElementById('chemical-name').value.trim();
    const result = document.getElementById('result');

    if (disruptors.includes(input)) {
        result.textContent = `${input} is a known endocrine disruptor.`;
        result.style.color = 'red';
    } else {
        result.textContent = `${input} is not in our list of known endocrine disruptors.`;
        result.style.color = 'green';
    }
}
