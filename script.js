$(document).ready(function() {
    // Function to display books
    function displayBooks(books, users) {
        $('#books').empty();
        books.slice(0,10).forEach(function(book) {
            var authorName = users.find(user => user.id === book.userId).name;
            $('#books').append(`
                <div>
                    <h3>${book.title}</h3>
                    <p>Author: ${authorName}</p>
                    <p>Pages: ${book.body.length}</p>
                    <button class="delete" data-id="${book.id}">Delete</button>
                    <button class="edit" data-id="${book.id}">Edit</button>
                </div>
            `);
        });
    }

    $.get('https://jsonplaceholder.typicode.com/posts', { _limit:5 }, function(books) {
        // Fetch users
        $.get('https://jsonplaceholder.typicode.com/users', function(users) {
            displayBooks(books, users);
        });
    });

    // Create new book
    $('#create-form').submit(function(event) {
        event.preventDefault();
        var title = $('#title').val();
        var userId = $('#author').val();
        var body = $('#pages').val();
        $.post('https://jsonplaceholder.typicode.com/posts', { title: title, userId: userId, body: body }, function(book) {
            $('#title, #author, #pages').val('');
            $('#books').prepend(`
                <div>
                    <h3>${book.title}</h3>
                    <p>Author: ${book.userId}</p>
                    <p>Pages: ${book.body.length}</p>
                    <button class="delete" data-id="${book.id}">Delete</button>
                    <button class="edit" data-id="${book.id}">Edit</button>
                </div>
            `);
        });
    });

    // Delete book
    $(document).on('click', '.delete', function() {
        var bookId = $(this).data('id');
        var bookElementToRemove = $(this).parent(); 
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts/' + bookId,
            type: 'DELETE',
            success: function() {
                bookElementToRemove.remove(); 
            }
        });
    });

    // Edit book
    $(document).on('click', '.edit', function() {
        var bookId = $(this).data('id');
        var newTitle = prompt("Enter new title:");
        var newAuthorId = prompt("Enter new author's ID:");
        var newPages = prompt("Enter new pages:");
        if (newTitle && newAuthorId && newPages) {
            $.ajax({
                url: 'https://jsonplaceholder.typicode.com/posts/' + bookId,
                type: 'PUT',
                data: { title: newTitle, userId: newAuthorId, body: newPages },
                success: function(updatedBook) {
                    // Update the book in the UI
                    $(`[data-id="${bookId}"]`).siblings('h3').text(updatedBook.title);
                    $(`[data-id="${bookId}"]`).siblings('p').eq(0).text("Author: " + updatedBook.userId);
                    $(`[data-id="${bookId}"]`).siblings('p').eq(1).text("Pages: " + updatedBook.body.length);
                }
            });
        }
    });
});
