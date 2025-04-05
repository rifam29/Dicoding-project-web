(function () {
    let books = JSON.parse(localStorage.getItem("books")) || [];

    function saveBooks() {
        localStorage.setItem("books", JSON.stringify(books));
    }

    function addBook(event) {
        event.preventDefault();
        const title = document.querySelector("#bookFormTitle").value.trim();
        const author = document.querySelector("#bookFormAuthor").value.trim();
        const year = parseInt(document.querySelector("#bookFormYear").value.trim());
        const isComplete = document.querySelector("#bookFormIsComplete").checked;

        if (!title || !author || isNaN(year)) {
            alert("Harap isi semua bidang dengan benar!");
            return;
        }

        const book = {
            id: +new Date(),
            title,
            author,
            year,
            isComplete,
        };

        books.push(book);
        saveBooks();
        renderBooks();
        document.querySelector("#bookForm").reset();
    }

    function searchBook(event) {
        event.preventDefault();
        const query = document.querySelector("#searchBookTitle").value.toLowerCase();
        const filteredBooks = query
            ? books.filter(book => book.title.toLowerCase().includes(query))
            : books;
        renderBooks(filteredBooks);
    }

    function toggleBookStatus(bookId) {
        const bookIndex = books.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
            books[bookIndex].isComplete = !books[bookIndex].isComplete;
            saveBooks();
            renderBooks();
        }
    }

    function deleteBook(bookId) {
        books = books.filter(book => book.id !== bookId);
        saveBooks();
        renderBooks();
    }

    function createBookElement(book) {
        const bookElement = document.createElement("div");
        bookElement.dataset.bookid = book.id;
        bookElement.setAttribute("data-testid", "bookItem");

        bookElement.innerHTML = `
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div>
                <button class="toggle-status" data-testid="bookItemIsCompleteButton" data-bookid="${book.id}">
                    ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
                </button>
                <button class="delete-book" data-testid="bookItemDeleteButton" data-bookid="${book.id}">Hapus</button>
            </div>
        `;

        return bookElement;
    }

    function renderBooks(bookList = books) {
        const incompleteBookList = document.querySelector("#incompleteBookList");
        const completeBookList = document.querySelector("#completeBookList");

        incompleteBookList.innerHTML = "";
        completeBookList.innerHTML = "";

        bookList.forEach(book => {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                completeBookList.appendChild(bookElement);
            } else {
                incompleteBookList.appendChild(bookElement);
            }
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        renderBooks();

        document.querySelector("#bookForm").addEventListener("submit", addBook);
        document.querySelector("#searchBook").addEventListener("submit", searchBook);

        document.querySelector("#incompleteBookList").addEventListener("click", event => {
            if (event.target.classList.contains("toggle-status")) {
                toggleBookStatus(Number(event.target.dataset.bookid));
            }
            if (event.target.classList.contains("delete-book")) {
                deleteBook(Number(event.target.dataset.bookid));
            }
        });

        document.querySelector("#completeBookList").addEventListener("click", event => {
            if (event.target.classList.contains("toggle-status")) {
                toggleBookStatus(Number(event.target.dataset.bookid));
            }
            if (event.target.classList.contains("delete-book")) {
                deleteBook(Number(event.target.dataset.bookid));
            }
        });
    });
})();