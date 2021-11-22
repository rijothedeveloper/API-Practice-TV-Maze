describe("search api test", function() {

    it("should get data for search query",async function() {
        const result = await searchShows("girls");
        expect(result.length).toBeGreaterThanOrEqual(1);
    })

});


describe("Episode api test", function() {

    it("should get data for episode query",async function() {
        const result = await getEpisodes(139);
        expect(result.length).toBeGreaterThanOrEqual(1);
    })

});