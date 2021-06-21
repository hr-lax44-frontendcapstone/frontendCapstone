/*

READ ME!
https://jestjs.io/docs/snapshot-testing
https://jestjs.io/docs/tutorial-react

How does Jest know what’s a test file and what isn’t? The first rule is that any files found in any directory with the name __test__ are considered a test. If you put a JavaScript file in one of these folders, Jest will try to run it when you call Jest, for better or for worse. The second rule is that Jest will recognize any file with the suffix .spec.js or .test.js. It will search the names of all folders and all files in your entire repository.

Jest testing for React uses SNAPSHOT testing - it renders a component, takes a snapshot, and compares it to a reference snapshot that is stored alongside the test. Test will fail if the snapshots do not match!

FIRST TIME A TEST IS RUN, A SNAPSHOT WILL BE CREATED AND SAVED!

TWO MAIN WAYS TO HANDLE A FAILING SNAPSHOT TEST:

1) There is an actual bug - fix the bug and run the test again until it passes

2) Fails because there was an INTENTIONAL implementation change - YOU MUST REGENERATE THE TEST SNAPSHOTS

  -run this command in the terminal:

    jest --updateSnapshot

  -accept the new changes

  *failed snapshots can also be updated interactively when Jest is in watch mode (there will be a list of commands available to you)

*/

// these are the dependencies you must import. *Remember to import the files you are testing!!
import React from 'react';
import renderer from 'react-test-renderer';
import MainProduct from '../client/src/components/productDetails/MainProduct.jsx';


describe('Addition', () => {
  it('knows that 2 plus 2 equals 4', () => {
    expect(2+2).toBe(4);
  });
});

it('renders without crashing', () => {
  shallow(<MainProduct />);
});