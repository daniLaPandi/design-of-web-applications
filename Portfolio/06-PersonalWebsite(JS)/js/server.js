// wait until the HTML page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // select the form
  const form = document.querySelector("form");
  // Select the schedule table element inside of the weeklyschedule element
  const table = document.querySelector("#weeklyschedule table");

  // listen for form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // i dont want the page to refresh

    // storing all the values from the form
    const date = document.getElementById("date").value;
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    const activity = document.getElementById("activity").value;
    const place = document.getElementById("place").value;
    const type = document.getElementById("type").value;
    const notes = document.getElementById("notes").value;
    const flag = document.getElementById("flag").value;

    // get the status (Free or Busy)
    const statusInputs = document.querySelectorAll('input[name="status"]:checked');
    let statusText = "📘 Free";
    if (statusInputs.length > 0) {
      if (statusInputs[0].value === "busy") statusText = "📕 Busy";
    }

    // make sure all required fields are filled in
    if (!date || !start || !end || !activity || !place) {
      alert("Please fill out all required fields.");
      return;
    }

    // create a new table row
    const newRow = document.createElement("tr");

    // fill each table cell
    newRow.innerHTML = `
      <td>${date}</td>
      <td>${start}</td>
      <td>${end}</td>
      <td>${activity}</td>
      <td>${place}</td>
      <td>${type}</td>
      <td>${notes}</td>
      <td style="color: ${flag}; font-weight: bold;">${statusText}</td>
    `;

    // add  new row to table
    table.appendChild(newRow);

    // Clear form after submission
    form.reset();
  });
});