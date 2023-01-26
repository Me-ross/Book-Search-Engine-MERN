import { gql } from '@apollo/client';

// entry point on line6 and the field names lines 7-17 HAVE to match what you created in the schema typedefs. const name and line 4 can be any name! this query will be consued in the ./src/pages/SavedBooks.js
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link        
      }
    }
  }
`;