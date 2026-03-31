'use strict';

function onInit() {
    renderBookshop();
}

function renderBookshop() {
    const elBooksContainer = document.querySelector('.books-container');
    const books = getBooks()

    const strHtml = books.map( book => {
        return `
            <tr>
                <td>${book.title}</td>
                <td>${book.price}</td>
                <td>
                    <button class="read">
                        Read
                    </button>
                    <button class="update">
                        Update
                    </button>
                    <button class="delete">
                        Delete
                    </button>
                </td>
            </tr>
            `
    })
    
    elBooksContainer.innerHTML = strHtml.join('')
}