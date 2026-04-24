'use strict';

const gQueryParams = {
    filterBy: {title: '', minRating: 1},
    sortBy: {sort: 'title', direction: 1},
    page: {idx: 0, size: 6}
}

function onInit() {
    readQueryParams();
    renderBookshop();
}

function renderBookshop() {
    const elBooksContainer = document.querySelector('.books-container');
    const books = getBooks(gQueryParams);
    
    let strHtml;
    if (books.length === 0) {
        const message = (books.length > 0)
            ? 'No matching books were found...'
            : 'There are no books in the library';
        strHtml = [`<tr><td colspan="100"><div class="empty">${message}</div></td></tr>`];
    } else {
        strHtml = books.map(book => `
            <tr>
                <td>${book.title}</td>
                <td>${book.title}</td>
                <td>${visualRating(book.rating)}</td>
                <td>${book.price}</td>
                <td>
                    <button class="action-btn read" onclick="onGetBookDetails('${book.id}')">Read</button>
                    <button class="action-btn update" onclick="onUpdateBook('${book.id}')">Update</button>
                    <button class="action-btn delete" onclick="onRemoveBook('${book.id}')">Delete</button>
                </td>
            </tr>
        `);
    }
    
    elBooksContainer.innerHTML = strHtml.join('');
    renderStats();
    renderCurrentPage();
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
    const ratingHTML = createRatingElement(+book.rating);
    
    const dialogContent = `
                <form onsubmit="onConfirmUpdatePrice(event, '${bookId}')">
                    <div>
                        <div>Please specify a new price value for book <span class="book-name">${book.title}</span></div>
                    </div>
                    <div class="set-book-details">
                        <span>Price:</span>
                        <input type="number" name="newPrice" value="${book.price}" required min=0 step=1>
                        <span>rating:</span>
                        ${ratingHTML}
                        <button class="update" type="submit">Confirm</button>
                        <button class="close" onclick="closeDialog()">Close</button>
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
    const ratingHTML = createRatingElement(5);
    const dialogContent = `
                <form onsubmit="onConfirmAddBook(event)">
                    <div>Please specify the new book's name and price.</div>
                    <div class="set-book-details">
                        <span>Name:</span>
                        <input type="text" name="bookName" placeholder="Book's name" required>
                        <span>Price:</span>
                        <input type="number" name="bookPrice" placeholder="Book's price" required min=0 step=1>
                        <span>Rating:</span>
                        ${ratingHTML}
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
    const bookRating = ev.target.newRating.value;

    if (!(bookName && bookPrice) || !Number.isInteger(bookPrice) || bookPrice < 0) return;
    const bookId = addBook(bookName, bookPrice, bookRating);

    elDialog.close();
    renderBookshop();
    notifyUser('add',bookId);
}

function onRemoveBook(bookId){
    const book = getBookById(bookId);

    notifyUser('delete', bookId);
    removeBook(bookId);
    renderBookshop();
}

function visualRating(rating) {
    let str = '';
    
    for (let i = 0; i < 5; i++) {
        str += (i < rating) ? '★' : '☆';
    }
    return str;
}

function createRatingElement(bookRating) {
    let res = '<select name="newRating">';

    for (let i = 1 ; i <= 5; i++) {
        const rating = `${'★'.repeat(i) + '☆'.repeat(5 - i)}`
        res += `<option value="${i}" ${i === bookRating ? ' selected' : ''}>${rating}</option>`;
    }
    res += '</select>';
    return res;
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

function onSetFilterBy() {
    const elTitleFilter = document.querySelector('.filter-by .search-title');
    const elMinRating = document.querySelector('.filter-by .rating');

    gQueryParams.filterBy = {
        title: elTitleFilter.value,
        minRating: +elMinRating.value
    };
    setQueryParams();
    renderBookshop();
}

function onClearFilterSearchbox() {
    const elSearchBox = document.querySelector('.filter-by .search-title');
    const elMinRating = document.querySelector('.filter-by .rating');
    
    gQueryParams.filterBy = {title: '', minRating: 1};
    elSearchBox.value = '';
    elMinRating.value = '1';
    setQueryParams();
    renderBookshop();
}

function onSetSortBy() {
    const elOrderSelect = document.querySelector('.sort-by .sort');
    const elOrderDir = document.querySelector('.sort-by .desc');

    gQueryParams.sortBy = {
        sort: elOrderSelect.value,
        direction: (elOrderDir.checked) ? -1 : 1
    };

    setQueryParams();
    renderBookshop();
}

function renderCurrentPage() {
    const elCurrPage = document.querySelector('.pagination .current');
    
    elCurrPage.innerText = `${gQueryParams.page.idx}`;
}

function onPageChange(next) {
    const currPage = gQueryParams.page.idx;
    
    if (!next && currPage === 0) return
    
    const lastPageIdx = getLastPageIdx(gQueryParams);
    if (currPage === lastPageIdx) {
        gQueryParams.page.idx = 0
    } else {
        gQueryParams.page.idx = (next) 
            ? currPage + 1
            : currPage - 1;
    }
    renderBookshop();

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

function notifyUser(operation, id) {
    const elBanner = document.querySelector('.banner');
    const book = getBookById(id);
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

function readQueryParams() {
    const readQueryParams = new URLSearchParams(window.location.search);

    gQueryParams.filterBy = {
        title: readQueryParams.get('title') || '',
        minRating: +readQueryParams.get('minRating') || 1,
    };

    gQueryParams.sortBy = {
        sort: readQueryParams.get('sort') || 'title',
        direction: +readQueryParams.get('dir')|| 1
    };

    renderQueryParams();
}

function renderQueryParams() {
    const elFilterContainer = document.querySelector('.content-header');

    elFilterContainer.querySelector('.search-title').value = gQueryParams.filterBy.title;
    elFilterContainer.querySelector('.rating').value = gQueryParams.filterBy.rating || '1';
    elFilterContainer.querySelector('.sort').value = gQueryParams.sortBy.sort;
    elFilterContainer.querySelector('.desc').checked = (Number(gQueryParams.sortBy.direction) === 1) ? false : true;
}

function setQueryParams() {
    const queryParams = new URLSearchParams();
    const title = gQueryParams.filterBy.title;
    const minRating = gQueryParams.filterBy.minRating;
    const sortBy = gQueryParams.sortBy.sort;
    const sortDir = gQueryParams.sortBy.direction;

    if (title) queryParams.set('title', title);
    if (minRating) queryParams.set('minRating', minRating);
    if (sortBy) queryParams.set('sort', sortBy);
    if (sortDir) queryParams.set('dir', sortDir);

    const newUrl = 
        window.location.protocol + '//' +
        window.location.host +
        window.location.pathname + '?' + queryParams.toString();
    
    window.history.pushState({path: newUrl}, '', newUrl);
}