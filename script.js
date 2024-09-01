async function checkDisruptor() {
    const chemicalName = document.getElementById('chemical-name').value.trim();
    const result = document.getElementById('result');
    result.textContent = 'Checking...';

    try {
        // Fetch data from PubChem API
        const pubChemResponse = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${chemicalName}/JSON`);

        if (!pubChemResponse.ok) {
            throw new Error('Chemical not found in PubChem database.');
        }

        const pubChemData = await pubChemResponse.json();

        // Fetch data from EPA CompTox Chemicals Dashboard API
        const compToxResponse = await fetch(`https://comptox.epa.gov/dashboard/api/chemicalinfo?search=${chemicalName}`);

        if (!compToxResponse.ok) {
            throw new Error('Chemical not found in EPA CompTox database.');
        }

        const compToxData = await compToxResponse.json();

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
    // Example logic; adapt based on CompTox API response format
    return data.results && data.results.some(result => result.properties.some(prop => prop.toLowerCase().includes('endocrine disruptor')));
}
