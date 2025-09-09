let appdata = [];

const submit = async function(event) {
  event.preventDefault();

  const model = document.querySelector("#model").value;
  const year = parseInt(document.querySelector("#year").value);
  const mpg = parseInt(document.querySelector("#mpg").value);

  const json = { model, year, mpg };
  const body = JSON.stringify(json);

  const response = await fetch("/submit", {
    method: "POST",
    body
  });

  const updatedData = await response.json();
  renderTable(updatedData);
};
const editCar = function(model) {
  const car = appdata.find(c => c.model === model);
  if (!car) return;

  document.querySelector("#model").value = car.model;
  document.querySelector("#year").value = car.year;
  document.querySelector("#mpg").value = car.mpg;

  const button = document.querySelector("button");
  button.textContent = "Update Car";
  button.onclick = updateCar;
};
const updateCar = async function(event) {
  event.preventDefault();

  const model = document.querySelector("#model").value;
  const year = parseInt(document.querySelector("#year").value);
  const mpg = parseInt(document.querySelector("#mpg").value);

  const json = { model, year, mpg };
  const body = JSON.stringify(json);

  const response = await fetch("/submit", {
    method: "PUT",
    body
  });

  const updatedData = await response.json();
  appdata = updatedData;
  renderTable(updatedData);

  const button = document.querySelector("button");
  button.textContent = "Add Car";
  button.onclick = submit;
};

const renderTable = function(data) {
  const container = document.querySelector("#results");
  container.innerHTML = `
    <table>
      <tr><th>Model</th><th>Year</th><th>MPG</th><th>Age</th></tr>
      ${data.map(car => `
        <tr>
          <td>${car.model}</td>
          <td>${car.year}</td>
          <td>${car.mpg}</td>
          <td>${car.age}</td>
          <td><button onclick="editCar('${car.model}')">Edit</button></td>
        </tr>`).join("")}
    </table>
  `;
};

window.onload = function() {
  document.querySelector("button").onclick = submit;

  // Load initial data
  fetch("/results")
      .then(response => response.json())
      .then(data => {
        appdata = data;
        renderTable(data);
      });
};
//https://stackoverflow.com/questions/29775797/fetch-post-json-data
// https://stackoverflow.com/questions/12765431/how-to-send-a-put-request-from-html-form-in-express-and-node for editing