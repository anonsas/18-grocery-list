// ****** SELECT ITEMS **********
const alertEl = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const newGroceryInput = document.getElementById('grocery');
const formSubmitBtn = document.querySelector('.submit-btn');
const groceryContainer = document.querySelector('.grocery-container');
const groceryList = document.querySelector('.grocery-list');
const clearListBtn = document.querySelector('.clear-btn');

// edit option
let editElement;
let editFlag = false;
let editID = '';

// ****** FUNCTIONS **********
function setBackToDefault() {
  newGroceryInput.value = '';
  editFlag = false;
  editID = '';
  formSubmitBtn.textContent = 'submit';
}

function displayAlert(text, actionColor) {
  alertEl.textContent = text;
  alertEl.classList.add(`alert-${actionColor}`);

  setTimeout(() => {
    alertEl.textContent = '';
    alertEl.classList.remove(`alert-${actionColor}`);
  }, 1000);
}
//=================
function addItemToList(e) {
  e.preventDefault();
  const { value } = newGroceryInput;
  const id = Math.floor(Math.random() * 10000);

  if (value && !editFlag) {
    createListItem(id, value);

    displayAlert('Item added to the list', 'success');
    groceryContainer.classList.add('show-container');

    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert('value changed', 'success');
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert('Please enter value', 'danger');
  }
}

function completeItemHandler(e) {
  const itemTitle = e.target.closest('.grocery-item').firstElementChild;

  if (!editFlag) {
    itemTitle.classList.toggle('completed-item');
  }
}

function editItemHandler(e) {
  editFlag = true;
  formSubmitBtn.textContent = 'edit';

  const article = e.target.closest('.grocery-item');
  editElement = article.firstElementChild;
  newGroceryInput.value = editElement.innerHTML;

  const { id } = article.dataset;
  editID = id;
}

function deleteItemHandler(e) {
  const article = e.target.closest('.grocery-item');
  const { id } = article.dataset;

  if (!editFlag) {
    groceryList.removeChild(article);
    removeFromLocalStorage(id);
    displayAlert('item removed', 'danger');
    setBackToDefault();
  }

  if (groceryList.children.length === 0) {
    groceryContainer.classList.remove('show-container');
  }
}

function clearList() {
  groceryList.innerHTML = '';
  groceryContainer.classList.remove('show-container');
  displayAlert('empty list', 'danger');
  setBackToDefault();
  localStorage.removeItem('list');
}

// ****** LOCAL STORAGE **********
function getLocalStorage() {
  return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

function addToLocalStorage(id, value) {
  const grocery = { id, value };
  const items = getLocalStorage();
  items.push(grocery);

  localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => item.id !== +id);
  localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map((item) => (item.id === +id ? { ...item, value } : item));
  localStorage.setItem('list', JSON.stringify(items));
}

// ****** SETUP ITEMS **********
function setupItems() {
  const items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    groceryContainer.classList.add('show-container');
  }
}

function createListItem(id, value) {
  const article = document.createElement('article');
  const attribute = document.createAttribute('data-id');
  attribute.value = id;
  article.setAttributeNode(attribute);
  article.classList.add('grocery-item');
  article.innerHTML = `<p class="title">${value}</p>
  <div class="btn-container">
    <button type="button" class="complete-btn">
      <i class="fas fa-check"></i>
    </button>
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
  </div>`;

  groceryList.append(article);

  const completeItemBtn = article.querySelector('.complete-btn');
  const editItemBtn = article.querySelector('.edit-btn');
  const deleteItemBtn = article.querySelector('.delete-btn');

  completeItemBtn.addEventListener('click', completeItemHandler);
  editItemBtn.addEventListener('click', editItemHandler);
  deleteItemBtn.addEventListener('click', deleteItemHandler);
}

// ****** EVENT LISTENERS **********
form.addEventListener('submit', addItemToList);
clearListBtn.addEventListener('click', clearList);
window.addEventListener('DOMContentLoaded', setupItems);
