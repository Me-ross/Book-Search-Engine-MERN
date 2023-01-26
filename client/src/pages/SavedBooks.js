import React, { useState, useEffect } from 'react';
// import useQuery and useMutation hooks from apollolibrary so you can use the ./utils/queries and .utils/queries/mutations
import { useQuery, useMutation } from '@apollo/client';

import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

// GET-ME queri and REMOVE-BOOk mutation are imported from utils
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK} from '../utils/mutations';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // hook useQuery is used to execute the GET-ME query - returned object of the hook will always include a loading and data properties
  const { loading, data } = useQuery(GET_ME);
  // store the returned data in a variable userData that will be referred to in the jsx that is returned below.  ? syntax means if the data is ready then return the data.me details specified in the queries file lines 7-17, Otherwise (||) return an empty array []
  const userData = data?.me || [];

  // Invoke `useMutation()` hook to return a Promise-based function and data about the REMOVE_BOOK mutation
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

     // Since mutation function is async, wrap in a `try...catch` to catch any network errors from throwing due to a failed request.
    try {
      // Execute mutation and pass in defined parameter data as variables
      const { data } = await removeBook({
        variables: { 
          bookId: data.bookId
        },
      });

      // const updatedUser = await response.json();
      // setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  // if (!userDataLength) {
  //   return <h2>LOADING...</h2>;
  // }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
         {/* loading comes from useQuery parameter above- means if we are waiting for the query to load then reurn loading... otherwise go ahead and display the data */}
      <div>
      {/* {loading ? (
          <div>Loading...</div>
        ) : (       */}
        <h2>
          {/* not sure why above line is red!!
          next line should be - ?? userData={me.bookCount} ?? */}
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
        )}
        </div>
        {/* error message collected once the mutation was invoked above */}
        {error && (
          <div className="col-12 my-3 bg-danger text-white p-3">
            Something went wrong...
          </div>
        )}
      </Container>
    </>
  );
};

export default SavedBooks;
