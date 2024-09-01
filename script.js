async function checkDisruptor() {
    const chemicalName = document.getElementById('chemical-name').value.trim();
    const result = document.getElementById('result');
    result.textContent = 'Checking...';

    try {
        // Create an array of API requests
        const requests = [
            fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${chemicalName}/JSON`),
            fetch(`https://comptox.epa.gov/dashboard/api/chemicalinfo?search=${chemicalName}`)
        ];

        // Use Promise.all to handle the requests in parallel
        const responses = await Promise.all(requests.map(req => req.catch(e => e)));

        // Check if any response failed
        if (responses.some(response => response instanceof Error)) {
            throw new Error('One or more requests failed.');
        }

        // Parse responses as JSON
        const data = await Promise.all(responses.map(response => response.json()));

        // Extract and check data from PubChem and CompTox
        const pubChemData = data[0];
        const compToxData = data[1];

        // Example: Logic to determine if the chemical is an endocrine disruptor
        const isPubChemDisruptor = checkPubChemData(pubChemData);
        const isCompToxDisruptor = checkCompToxData(compToxData);

        if (isPubChemDisruptor || isCompToxDisruptor) {
            result.textContent = `${chemicalName} is a known endocrine disruptor.`;
            result.style.color = 'red';
        } else {
            result.textContent = `${chemicalName} is not listed as an endocrine disruptor in the databases.`;
            result.style.color = 'green';
        }

    } catch (error) {
        result.textContent = `Error: ${error.message}`;
        result.style.color = 'red';
    }
}

function checkPubChemData(data) {
    // Check PubChem data for disruptor properties
    const properties = data.PropertyTable?.Properties || [];
    return properties.some(prop => prop.Description?.toLowerCase().includes('endocrine disruptor'));
}

function checkCompToxData(data) {
    // Check EPA CompTox data for disruptor properties
    return data.results && data.results.some(result => result.properties.some(prop => prop.toLowerCase().includes('endocrine disruptor')));
}
