

test("Test", () => {
    console.log(global.__SPECIFIC__MONGO_DB_NAME__);
    console.log(global.__SPECIFIC__MONGO_URI__);
    expect(0).toBe(0);
});
