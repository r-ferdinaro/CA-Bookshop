'use strict'

var gBooks = getBooks();

function getBooks() {
    const books = [
        _createBook('The adventures of Lori Ipsi',120),
        _createBook('World Atlas',300),
        _createBook('Zobra the greek',87),
    ];

    return books;
}

function getBook(bookId) {
    return gBooks.find( book => book.id === bookId);
}

function updatePrice(bookId, price) {
    const book = getBook(bookId);
    book.price = price;
}

function removeBook(bookId) {
    const idx = gBooks.findIndex( book => book.id === bookId);
    gBooks.splice(idx, 1);
}

function _createBook(title, price) {
    return {
        id: generateId(),
        title,
        price,
        imgUrl: `${title}.jpg` 
    };
}
