"use strict";

// Grab the select element
const classificationList = document.querySelector("#classificationList");

// Listen for changes
classificationList.addEventListener("change", function () {
    const classification_id = classificationList.value;
    console.log(`classification_id is: ${classification_id}`);

    // Build the URL to request inventory for this classification
    const classIdURL = "/inv/getInventory/" + classification_id;

    // Fetch data from the server
    fetch(classIdURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {
            console.log(data);
            buildInventoryList(data); // Call helper function to build table
        })
        .catch(function (error) {
            console.log("There was a problem: ", error.message);
        });
});

/**
 * Build the inventory table dynamically and inject into #inventoryDisplay
 * @param {Array} data - Array of inventory objects returned from the server
 */
function buildInventoryList(data) {
    const inventoryDisplay = document.getElementById("inventoryDisplay");

    if (!data || data.length === 0) {
        inventoryDisplay.innerHTML =
            "<tr><td colspan='3'>No inventory found.</td></tr>";
        return;
    }

    let tableHTML = `
    <thead>
      <tr>
        <th>Make</th>
        <th>Model</th>
        <th>Year</th>
      </tr>
    </thead>
    <tbody>
  `;

    data.forEach((item) => {
        tableHTML += `
      <tr>
        <td>${item.inv_make}</td>
        <td>${item.inv_model}</td>
        <td>${item.inv_year}</td>
      </tr>
    `;
    });

    tableHTML += "</tbody>";

    inventoryDisplay.innerHTML = tableHTML;
}

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay");
    // Set up the table labels
    let dataTable = "<thead>";
    dataTable += "<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
    dataTable += "</thead>";
    // Set up the table body
    dataTable += "<tbody>";
    // Iterate over all vehicles in the array and put each in a row
    data.forEach(function (element) {
        console.log(element.inv_id + ", " + element.inv_model);
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
    });
    dataTable += "</tbody>";
    // Display the contents in the Inventory Management view
    inventoryDisplay.innerHTML = dataTable;
}
