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
                    <button class="read">Read</button>
                    <button class="update" onclick="onUpdateBook(${book.id})">Update</button>
                    <button class="delete" onclick="onRemoveBook(${book.id})">Delete</button>
                </td>
            </tr>
            `
    });
    
    elBooksContainer.innerHTML = strHtml.join('');
}

function onUpdateBook(bookId) {
    const book = getBook(bookId);
    const elDialog = document.querySelector('.book-details');
    
    elDialog.innerHTML = `
                <form onsubmit="onConfirmUpdatePrice(event, ${bookId})">
                    <div>
                        <div>Please specify a new price value for book <span class="book-name">${book.title}</span></div>
                        <div>Current Price is <span class="book-price">${book.price}</span></div>
                    </div>
                    <div class="set-book-price">
                        <input type="number" name="newPrice" placeholder="New Price value" required min=0 step=1>
                        <button class="update" type="submit">Confirm</button>
                    </div>
                </form>
                `;
    elDialog.showModal();
}

function onConfirmUpdatePrice(ev, bookId) {
    ev.preventDefault();
    
    const elDialog = document.querySelector('.book-details');
    const newPrice = +ev.target.newPrice.value;
    
    if (!newPrice || !Number.isInteger(newPrice) || newPrice < 0) return
    updatePrice(bookId, newPrice)
    
    elDialog.close();
    renderBookshop();
}

function onRemoveBook(bookId){
    removeBook(bookId);
    renderBookshop();
}