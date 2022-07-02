const {nanoid} = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const isNameNotExists = name === undefined;
  const isReadPageOvervalue = readPage > pageCount? true : false;

  if (isNameNotExists) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (isReadPageOvervalue) {
    const response = h.response({
      status: 'fail',
      message:
      'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage? true : false;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;
  const isBookshelfEmpty = books[0] === undefined? true : false;
  const isQueryParamsExist =
  name !== undefined ||
  reading !== undefined ||
  finished !== undefined?
  true : false;

  if (isBookshelfEmpty) {
    return ({
      status: 'success',
      data: {books: []},
    });
  }

  let filteredBooks = [];

  if (name !== undefined) {
    filteredBooks = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    filteredBooks = books.filter((book) => book.reading == reading);
  }

  if (finished !== undefined) {
    filteredBooks = books.filter((book) => book.finished == finished);
  }

  const returnBooks = books.map((book) => {
    const bookInfo = {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
    return bookInfo;
  });

  const returnFilteredBooks = filteredBooks.map((book) => {
    const bookInfo = {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
    return bookInfo;
  });

  return ({
    status: 'success',
    data: {
      books: isQueryParamsExist? returnFilteredBooks : returnBooks,
    },
  });
};

const getBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const finished = readPage === pageCount? true : false;

  const index = books.findIndex((book) => book.id === id);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
      'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (id === 'xxxxx') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  if (index > -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const index = books.findIndex((book) => book.id = id);

  if (id === 'xxxxx') {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  if (index > -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
};


module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
