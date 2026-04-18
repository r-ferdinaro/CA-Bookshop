'use strict';

const STORAGE_KEY = 'books'

var gBooks;
_loadBooks();

function getBookById(bookId) {
    return gBooks.find( book => book.id === bookId);
}

function getBooks(textFilter = '') {
    if (!textFilter) return gBooks;
    
    // const filter = textFilter.toLowerCase();
    const regex = new RegExp(textFilter, 'i')
    return gBooks.filter(book => regex.test(book.title))
    // return gBooks.filter( book => book.title.toLowerCase().includes(filter));
}

function updatePrice(bookId, price) {
    const book = getBookById(bookId);
    book.price = price;
    _saveBooks();
}

function addBook(name, title) {
    gBooks.push(_createBook(name, title));
    _saveBooks();
}

function removeBook(bookId) {
    const idx = gBooks.findIndex( book => book.id === bookId);
    gBooks.splice(idx, 1);
    _saveBooks();
}

function getBookStats() {
    return {
        expensive: gBooks.filter( book => book.price > 200).length,
        average: gBooks.filter( book => book.price >= 80 && book.price <= 200).length,
        cheap: gBooks.filter( book => book.price < 80).length
    };
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
    saveToStorage(STORAGE_KEY, gBooks);
}

function _loadBooks() {
    gBooks = loadFromStorage(STORAGE_KEY);
    if (gBooks && gBooks.length > 0) return;
    
    gBooks = _createDummyBooks();
    _saveBooks();
}

function _createDummyBooks() {
    return [
            _createBook('The adventures of Lori Ipsi',120),
            _createBook('World Atlas',300),
            _createBook('Zobra the greek',87),
        ];
}
