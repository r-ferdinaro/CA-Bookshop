'use strict';

const STORAGE_KEY = 'books'

var gBooks;
_loadBooks();

function getBookById(bookId) {
    return gBooks.find( book => book.id === bookId);
}

function getBooks(options) {
    const page = options.page;
    let books = _filter(options.filterBy);
    
    books = _sort(books, options.sortBy);

    const startIdx = page.idx * page.size;
    const endIdx = startIdx + page.size;

    books = books.slice(startIdx, endIdx);
    return books;
}

function _filter(filterBy) {
    let books = [...gBooks];

    if (filterBy.title) {
        const regex = new RegExp(filterBy.title, 'i');
        books = books.filter(book => regex.test(book.title));
    }
    if (filterBy.minRating) {
        books = books.filter(book => book.rating >= filterBy.minRating);
    }
    return books;
}

function _sort(books, sortBy) {
    const sort = sortBy.sort;
    const direction = sortBy.direction;
    
    if (sort === 'title') {
        books.sort((book1, book2) => book1.title.localeCompare(book2.title) * direction);
    } else if (sort === 'price') {
        books.sort((book1, book2) => (book1.price - book2.price) * direction);
    } else if (sort === 'rating') {
        books.sort((book1, book2) => (book1.rating - book2.rating) * direction);
    }
    return books;
}

function getLastPageIdx(options) {
    return Math.ceil(_filter(options.filterBy).length / options.page.size) - 1;
}

function updatePrice(bookId, price, rating) {
    const book = getBookById(bookId);
    book.price = price;
    book.rating = rating;
    _saveBooks();
}

function addBook(title, price ,rating) {
    const book = _createBook(title, price, rating);
    
    gBooks.push(book);
    _saveBooks();
    return book.id
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
        imgUrl: `${title.toLowerCase().replaceAll(' ', '_')}.jpg`,
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
            _createBook('The Adventure home', 120, 5),
            _createBook('World Atlas', 300, 3),
            _createBook('Zorba the greek', 87, 4),
        ];
}
