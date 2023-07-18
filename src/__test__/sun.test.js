const sum  = require("../sun")

test("test the addition function for sun", () => {
    expect(sum(1,2)).toBe(3)
    expect(sum(1,2)).toBeTruthy();
})

// const {sum} = require('./sun');

// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3);
// });