'use strict';

const STORAGE_KEY = 'books'

var gBooks;
_loadBooks();

function getBookById(bookId) {
    return gBooks.find( book => book.id === bookId);
}

function getBooks(params) {
    const filterBy = params.filterBy;
    let filteredBooks = [...gBooks];
    
    if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i');
        filteredBooks = filteredBooks.filter(book => regex.test(book.title));
    }
    
    if (filterBy.minRating) {
        filteredBooks = filteredBooks.filter(book => book.rating >= filterBy.minRating);
    }

    return filteredBooks;
}

function updatePrice(bookId, price, rating) {
    const book = getBookById(bookId);
    book.price = price;
    book.rating = rating;
    _saveBooks();
}

function addBook(title, price ,rating) {
    gBooks.push(_createBook(title, price, rating));
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

function _createBook(title, price, rating) {
    return {
        id: generateId(),
        title,
        price,
        imgUrl: `${title}.jpg`,
        rating: +rating || getRandomInt(1, 6)
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
            _createBook('The adventures of Lori Ipsi', 120, 5),
            _createBook('World Atlas', 300, 3),
            _createBook('Zobra the greek', 87, 4),
        ];
}
