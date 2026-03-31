'use strict'

var gBooks = getBooks()

function getBooks() {
    const books = [
        {
            id: 1,
            title: 'The adventures of Lori Ipsi',
            price: 120,
            imgUrl: 'lori-ipsi.jpg'
        },
        {
            id: 2,
            title: 'World Atlas',
            price: 300,
            imgUrl: 'atlas.jpg'
        },
        {
            id: 3,
            title: 'Zobra the greek',
            price: 87,
            imgUrl: 'zobra.jpg'
        },
    ];

    return books;
}

function getBook(bookId) {
    return gBooks.find( book => book.id === bookId);
}

function updatePrice(bookId, price) {
    const book = getBook(bookId)
    book.price = price;
}

function removeBook(bookId) {
    const idx = gBooks.findIndex( book => book.id === bookId);
    gBooks.splice(idx, 1);
}