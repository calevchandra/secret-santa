# Secret Santa Instructions

- **Build, run and test instructions:**
  To run the program, you will need node installed in your machine.
  Once done, go to terminal -> inside the directory -> run this command 'npm install' and then 'npm start'

- **Test instructions:**
  I have only done snapshot testing for this assignment. I would definitely put in more unit tests later to make sure the program is fully or most places are tested.

To run the tests, go to terminal -> inside the directory -> run this command 'npm t'. You should see a total of 6 tests of which 3 are snapshot tests.

- **Design decisions and trade-offs:**
  I used React library based on Javascript ES6 conventions. As for the backend, I used express.js.

The reason I chose them are:

1. React is responsive and very efficient for Single Page Applications.
2. React library comes already with optimized performance and
   thus, more focus on development.
3. I have been training myself as a Javascript developer and React has been my most used Javascript library.

On the UI side, I mostly used react-bootstrap and normal css.

- **Rough edges:**
  Configuring email was not very straight forward as it required
  to create a JSON server within the React App so it could talk
  to the sendGrid email client.
