'use strict';

function onInit() {
    renderBookshop();
}

function renderBookshop(textFilter) {
    const elBooksContainer = document.querySelector('.books-container');
    const books = getBooks(textFilter);
    
    let strHtml;
    if (books.length === 0) {
        const existingBooks = getBooks();
        const message = (existingBooks.length > 0)
            ? 'No matching books were found...'
            : 'There are no books in the library';
        strHtml = [`<tr><td colspan="100"><div class="empty">${message}</div></td></tr>`];
    } else {
        strHtml = books.map(book => `
            <tr>
                <td>${book.title}</td>
                <td>${visualRating(book.rating)}</td>
                <td>${book.price}</td>
                <td>
                    <button class="read" onclick="onGetBookDetails('${book.id}')">Read</button>
                    <button class="update" onclick="onUpdateBook('${book.id}')">Update</button>
                    <button class="delete" onclick="onRemoveBook('${book.id}')">Delete</button>
                </td>
            </tr>
        `);
    }
    
    elBooksContainer.innerHTML = strHtml.join('');
    renderStats();
}

function renderStats() {
    const elStatsContainer = document.querySelector('.stats-container');
    const elExpensive = elStatsContainer.querySelector('.expensive');
    const elAverage = elStatsContainer.querySelector('.average');
    const elCheap = elStatsContainer.querySelector('.cheap');

    const stats = getBookStats();

    elExpensive.innerText = stats.expensive;
    elAverage.innerText = stats.average;
    elCheap.innerText = stats.cheap;
}

function onGetBookDetails(bookId) {
    const book = getBookById(bookId);
    
    const dialogContent = `
        <pre>${JSON.stringify(book, null, 4)}</pre>
        <button class="close" onclick="closeDialog()">Close</button>
        `;
    renderDialog(dialogContent);
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId);
    const elRating = elRatingSelect(+book.rating);
    
    const dialogContent = `
                <form onsubmit="onConfirmUpdatePrice(event, '${bookId}')">
                    <div>
                        <div>Please specify a new price value for book <span class="book-name">${book.title}</span></div>
                    </div>
                    <div class="set-book-details">
                        <span>Price:</span>
                        <input type="number" name="newPrice" value="${book.price}" required min=0 step=1>
                        <span>rating:</span>
                        ${elRating}
                        <button class="update" type="submit">Confirm</button>
                    </div>
                </form>
                `;
    renderDialog(dialogContent);
}

function onConfirmUpdatePrice(ev, bookId) {
    ev.preventDefault();
    
    const book = getBookById(bookId);
    const elDialog = document.querySelector('.book-details');
    const newPrice = +ev.target.newPrice.value;
    const newRating = ev.target.newRating.value;
    
    if (!newPrice || !Number.isInteger(newPrice) || newPrice < 0) return;
    if (book.price === newPrice && book.rating === newRating) {
        elDialog.close();
        return;
    } 
    
    updatePrice(bookId, newPrice, newRating);
    
    elDialog.close();
    renderBookshop();
    notifyUser('update', bookId);
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
    notifyUser('add', bookName);
}

function onRemoveBook(bookId){
    const book = getBookById(bookId);

    notifyUser('delete', bookId);
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

function onTextFilter(ev) {
    const textFilter = ev.target.value;
    
    if (!textFilter) {
        onClearFilterSearchbox();
        return;
    }
    renderBookshop(textFilter);
}

function onClearFilterSearchbox() {
    const elSearchBox = document.querySelector('.search-container input');
    
    renderBookshop();
    elSearchBox.value = '';
}

function notifyUser(operation, bookFilter) {
    const elBanner = document.querySelector('.banner');
    const book =  (operation === 'add') ? getBooks(bookFilter)[0] : getBookById(bookFilter); 
    let strHtml;

    switch (operation) {
        case 'add': strHtml = `Book <span>${book.title}</span> has been created with a price of <span>${book.price}</span>`; break;
        case 'update': strHtml = `The price of book <span>${book.title}</span> has been changed to <span>${book.price}</span>`; break;
        case 'delete': strHtml = `Book <span>${book.title}</span> has been removed`; break;
    }

    elBanner.innerHTML = strHtml;
    elBanner.style.opacity = 1;

    setTimeout(() => {
        elBanner.style.opacity = 0;
    }, 2000);
}

function visualRating(rating) {
    let str = '';
    
    for (let i = 0; i < 5; i++) {
        str += (i < rating) ? '★' : '☆';
    }
    return str;
}

function elRatingSelect(bookRating) {
    let res = '<select name="newRating">'

    for (let i = 1 ; i <= 5; i++) {
        res += `<option value="${i}" ${i === bookRating ? ' selected' : ''}>${i}</option>`;
    }
    res += '</select>';
    return res;
}