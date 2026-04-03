'use strict';

function onInit() {
    renderBookshop();
}

function renderBookshop() {
    const elBooksContainer = document.querySelector('.books-container');

    const strHtml = gBooks.map( book => {
        return `
            <tr>
                <td>${book.title}</td>
                <td>${book.price}</td>
                <td>
                    <button class="read" onclick="onGetBookDetails('${book.id}')">Read</button>
                    <button class="update" onclick="onUpdateBook('${book.id}')">Update</button>
                    <button class="delete" onclick="onRemoveBook('${book.id}')">Delete</button>
                </td>
            </tr>
            `
    });
    
    elBooksContainer.innerHTML = strHtml.join('');
}

function onGetBookDetails(bookId) {
    const book = getBook(bookId);
    
    const dialogContent = `<pre>${JSON.stringify(book, null, 4)}</pre><button class="close" onclick="closeDialog()">Close</button>`;
    renderDialog(dialogContent);
}

function onUpdateBook(bookId) {
    const book = getBook(bookId);
    
    const dialogContent = `
                <form onsubmit="onConfirmUpdatePrice(event, '${bookId}')">
                    <div>
                        <div>Please specify a new price value for book <span class="book-name">${book.title}</span></div>
                        <div>Current Price is <span class="book-price">${book.price}</span></div>
                    </div>
                    <div class="set-book-details">
                        <input type="number" name="newPrice" placeholder="New Price value" required min=0 step=1>
                        <button class="update" type="submit">Confirm</button>
                    </div>
                </form>
                `;
    renderDialog(dialogContent);
}

function onConfirmUpdatePrice(ev, bookId) {
    ev.preventDefault();
    
    const elDialog = document.querySelector('.book-details');
    const newPrice = +ev.target.newPrice.value;
    
    if (!newPrice || !Number.isInteger(newPrice) || newPrice < 0) return;
    updatePrice(bookId, newPrice);
    
    elDialog.close();
    renderBookshop();
}

function odAddBook() {
    const dialogContent = `
                <form onsubmit="onConfirmAddBook(event)">
                    <div>Please specify the new book's name and price.</div>
                    <div class="set-book-details">
                        <input type="text" name="bookName" placeholder="Book's name" required>
                        <input type="number" name="bookPrice" placeholder="Book's price" required min=0 step=1>
                        <button class="update" type="submit">Confirm</button>
                    </div>
                </form>
                `;
    renderDialog(dialogContent);
}

function onConfirmAddBook(ev) {
    ev.preventDefault();

    const elDialog = document.querySelector('.book-details');
    const bookName = ev.target.bookName.value;
    const bookPrice = +ev.target.bookPrice.value;

    if (!(bookName && bookPrice) || !Number.isInteger(bookPrice) || bookPrice < 0) return;
    addBook(bookName, bookPrice);

    elDialog.close();
    renderBookshop();
}

function onRemoveBook(bookId){
    removeBook(bookId);
    renderBookshop();
}

function renderDialog(strHtml) {
    const elDialog = document.querySelector('.book-details');
    
    elDialog.innerHTML = strHtml
    elDialog.showModal();
}

function closeDialog() {
    const elDialog = document.querySelector('.book-details');
    elDialog.close();
}