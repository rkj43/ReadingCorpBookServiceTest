//https://learn.microsoft.com/en-us/aspnet/core/tutorials/web-api-javascript?view=aspnetcore-7.0
document.getElementById('new-book-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const author = document.getElementById('author').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    const newBook = {
        name: name,
        author: author,
        category: category,
        description: description
    };

    fetch('api/Books/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error creating book');
            }
        })
        .then(bookId => {
            alert(`Book created successfully! Book ID: ${bookId}`);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error creating book');
        });
});


document.getElementById('update-book-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const id = document.getElementById('update-id').value;
    const name = document.getElementById('update-name').value;
    const author = document.getElementById('update-author').value;
    const category = document.getElementById('update-category').value;
    const description = document.getElementById('update-description').value;

    fetch(`api/Books/${id}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Book not found');
            }
        })
        .then(data => {
            const updatedBook = {
                id: id,
                name: name || data.name,
                author: author || data.author,
                category: category || data.category,
                description: description || data.description
            };

            return fetch(`api/Books/${id}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedBook),
            });
        })
        .then((response) => {
            if (response.ok) {
                alert('Book updated successfully');
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch((error) => console.error('Error:', error));
});



document.getElementById('get-book-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const id = document.getElementById('get-id').value;

    fetch(`api/Books/${id}`)
        .then(response => {
            if (response.status === 404) {
                alert("Book not found.");
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data) {
                const singleBookContainer = document.getElementById('single-book');
                singleBookContainer.innerHTML = ''; // Clear out any existing book

                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';
                bookCard.innerHTML = `
                <div class="book-title">Name: ${data.name}</div>
                <div class="book-id">ID: ${data.id}</div>
                <div class="book-author">Author: ${data.author}</div>
                <div class="book-category">Category: ${data.category}</div>
                <div class="book-description">Description: ${data.description}</div>
                <div class="book-timestamp">Timestamp: ${data.registrationTimestamp}</div>
            `;
                singleBookContainer.appendChild(bookCard);
            }
        })
        .catch((error) => console.error('Error:', error));
});



document.getElementById('get-all-books').addEventListener('click', function () {
    fetch('api/Books')
        .then(response => response.json())
        .then(data => {
            const booksContainer = document.getElementById('books');
            booksContainer.innerHTML = ''; // Clear out any existing books
            data.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';
                bookCard.innerHTML = `
                    <div class="book-title">${book.name}</div>
                    <div class="book-id">ID: ${book.id}</div>
                    <div class="book-category">Category: ${book.category}</div>
                `;
                booksContainer.appendChild(bookCard);
            });
        })
        .catch((error) => console.error('Error:', error));
});



