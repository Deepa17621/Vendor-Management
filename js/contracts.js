function showContainer(containerId) {
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById(containerId).style.display = 'flex';
}
const contractForm=document.querySelector("#contractForm");
contractForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const vendorId = document.getElementById('vendorId').value;
    const service = document.getElementById('service').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const contractData = { "vendorId":`${vendorId}`, "service":`${service}`, "startDate":`${startDate}`, "endDate":`${endDate}` };

    fetch('/post/contract', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Contract added successfully');
        contractForm.reset();
    })
    .catch(error => console.error('Error:', error));
});
const overlapForm = document.querySelector("#overlapForm");
overlapForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const vendorId = document.getElementById('vendorIdCheck').value;
    const startDate = document.getElementById('startDateCheck').value;
    const endDate = document.getElementById('endDateCheck').value;

    const overlapData = { vendorId, startDate, endDate };

    fetch('/contract/checkOverlap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(overlapData),
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('overlapResult');
        resultDiv.innerHTML = data.overlap ? 'Overlap detected!' : 'No overlap.';
    })
    .catch(error => console.error('Error:', error));
});

document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/viewContracts')
        .then(response => response.json())
        .then(data => {
            const contractList = document.getElementById('contractList');
            contractList.innerHTML = data.contracts.map(contract => `
                <div>
                    <p><strong>Vendor ID:</strong> ${contract.vendorId}</p>
                    <p><strong>Service:</strong> ${contract.service}</p>
                    <p><strong>Start Date:</strong> ${contract.startDate}</p>
                    <p><strong>End Date:</strong> ${contract.endDate}</p>
                    <hr>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error:', error));
});
