'use strict';

const STORAGE_KEY = 'books'

var gBooks;
_loadBooks();

function getBook(bookId) {
    return gBooks.find( book => book.id === bookId);
}

function updatePrice(bookId, price) {
    const book = getBook(bookId);
    book.price = price;
}

function addBook(name, title) {
    gBooks.push(_createBook(name, title))
}

function removeBook(bookId) {
    const idx = gBooks.findIndex( book => book.id === bookId);
    gBooks.splice(idx, 1);
}

// Private functions

function _createBook(title, price) {
    return {
        id: generateId(),
        title,
        price,
        imgUrl: `${title}.jpg` 
    };
}

function _saveBooks() {
    saveToStorage(STORAGE_KEY, gBooks)    
}

function _loadBooks() {
    gBooks = loadFromStorage(STORAGE_KEY);
    if (gBooks && gBooks.length > 0) return;
    
    gBooks = _createDummyBooks();
    _saveBooks()
}

function _createDummyBooks() {
    return [
            _createBook('The adventures of Lori Ipsi',120),
            _createBook('World Atlas',300),
            _createBook('Zobra the greek',87),
        ];
}
