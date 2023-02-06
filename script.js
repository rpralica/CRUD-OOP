'use strict';

//localStorage.clear();

const fName = document.getElementById('inpFirstName');
const lName = document.getElementById('inpLastName');
const streetAddress = document.getElementById('inpAddress');
const frmOsoba = document.getElementById('frmOsoba');
const tableBody = document.querySelector('#tBody');
const btnSubmit = document.getElementById('btnSubmit');
class Osoba {
  constructor(id, firstName, lastName, address) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
  }
  showData() {
    Osoba.showHtml(this.id, this.firstName, this.lastName, this.address);
    return this;
  }

  static validateForm() {
    if (fName.value == '') {
      Swal.fire('Popunite ime');
      return false;
    } else if (lName.value == '') {
      Swal.fire('Popunite prezime');
      return false;
    } else if (streetAddress.value == '') {
      Swal.fire('Popunite adresu');
      return false;
    } else {
      this.showData();
    }
  }
  //Setting Localstorage
  storeOsoba() {
    const allData = JSON.parse(localStorage.getItem('osobe')) ?? [];
    allData.push({
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
    });
    localStorage.setItem('osobe', JSON.stringify(allData));
    clearInputs();
  }
  static showStorageOsoba() {
    if (localStorage.getItem('osobe')) {
      JSON.parse(localStorage.getItem('osobe')).forEach(os => {
        Osoba.showHtml(os.id, os.firstName, os.lastName, os.address);
      });
    }
  }

  //! UPDATE ELEMENT
  updateOsoba(id) {
    const newItem = {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
    };
    const updatedData = JSON.parse(localStorage.getItem('osobe')).map(item => {
      if (item.id == id) {
        return newItem;
      }
      return item;
    });
    localStorage.setItem('osobe', JSON.stringify(updatedData));
  }

  static showHtml(id, firstName, lastName, address) {
    const trEl = document.createElement('tr');
    trEl.innerHTML = `
<tr>
  <td align="center" valign="middle">${firstName}</td>
  <td align="center" valign="middle">${lastName}</td>
  <td align="center" valign="middle">${address}</td>
  <td align="center" valign="middle">
      <button class="btn btn-warning edit"  data-id="${id}">Edit</button>
      <button class="btn btn-danger delete" data-id="${id}">Delete</button>
  </td>
</tr>
`;
    tableBody.appendChild(trEl);
  }
}
Osoba.showStorageOsoba();

//!SUBMIT FORM

frmOsoba.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!contIdEdit.value) {
    const id = Math.floor(Math.random() * 10000000);
    const sd = new Osoba(id, fName.value, lName.value, streetAddress.value);
    sd.showData().storeOsoba();
    clearInputs();
  } else {
    const id = contIdEdit.value;
    const newEmp = new Osoba(id, fName.value, lName.value, streetAddress.value);
    newEmp.updateOsoba(id);
    btnSubmit.innerHTML = 'Submit entered data';
    tableBody.innerHTML = '';
    Osoba.showStorageOsoba();
    clearInputs();
  }
});
tableBody.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('delete')) {
    //Remove from local storage
    const id = +e.target.getAttribute('data-id');
    console.log(+e.target.getAttribute('data-id'));
    const emps = JSON.parse(localStorage.getItem('osobe'));
    const newData = emps.filter(item => item.id !== id);
    localStorage.setItem('osobe', JSON.stringify(newData));

    //Remove from DOM
    e.target.parentElement.parentElement.remove();
  }
});
tableBody.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('edit')) {
    //Remove from local storage
    const id = +e.target.getAttribute('data-id');

    const item = JSON.parse(localStorage.getItem('osobe')).find(
      item => item.id == id
    );
    //const newData = emps.filter(item => item.id !== id);
    //localStorage.setItem('osobe', JSON.stringify(newData));
    fName.value = item.firstName;
    lName.value = item.lastName;
    streetAddress.value = item.address;
    contIdEdit.value = id;
    btnSubmit.innerHTML = 'Update selected record';

    //Remove from DOM
    //e.target.parentElement.parentElement.remove();
  }
});
function clearInputs() {
  fName.value = lName.value = streetAddress.value = '';
}
