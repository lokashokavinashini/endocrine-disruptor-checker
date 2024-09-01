async function checkDisruptor() {
    const chemicalName = document.getElementById('chemical-name').value.trim();
    const result = document.getElementById('result');
    result.textContent = 'Checking...';

    try {
        // Fetch data from PubChem API
        const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${chemicalName}/JSON`);

        if (!response.ok) {
            throw new Error('Chemical not found in PubChem database.');
        }

        const data = await response.json();

        // Example: Check if the chemical is tagged as an endocrine disruptor in the API response
        // You would need to inspect the API's response structure for accurate conditions
        const properties = data.PropertyTable?.Properties || [];
        const isDisruptor = properties.some(prop => prop.Description?.toLowerCase().includes('endocrine disruptor'));

        if (isDisruptor) {
            result.textContent = `${chemicalName} is a known endocrine disruptor.`;
            result.style.color = 'red';
        } else {
            result.textContent = `${chemicalName} is not listed as an endocrine disruptor in the database.`;
            result.style.color = 'green';
        }

    } catch (error) {
        result.textContent = `Error: ${error.message}`;
        result.style.color = 'red';
    }
}

function checkPubChemData(data) {
    // Extract properties related to endocrine disruption from PubChem data
    const properties = data.PropertyTable?.Properties || [];

    // Check for keywords indicating endocrine disruption
    return properties.some(prop => {
        const description = prop.Description?.toLowerCase() || '';
        return description.includes('endocrine disruptor') || description.includes('hormone disruptor');
    });
}
