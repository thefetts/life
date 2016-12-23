describe('Grid', () => {
  let grid,
    mockCallback,
    gridNode = {};

  beforeEach(() => {
    mockCallback = jasmine.createSpy('mockCallback');
    grid = new Grid(mockCallback, gridNode);
  });

  describe('build', () => {
    describe('with a querystring', () => {
      it('decodes the querystring and sets the grid', () => {
        spyOn(Tint, 'location').and.returnValue({search: '?12412'});
        grid.build();

        expect(grid.grid.length).toEqual(30);
        expect(grid.grid[0]).toEqual(
          [true, false, false, true, true, true, true, false, true, true]
        );
        expect(mockCallback).toHaveBeenCalledWith(grid.grid);
      });
    });

    describe('without a querystring', () => {
      it('clears the grid', () => {
        spyOn(Tint, 'location').and.returnValue({search: null});
        grid.build();

        expect(grid.grid.length).toEqual(30);
        expect(grid.grid
          .some(row => row
            .some(cell => cell))).toEqual(false);
        expect(mockCallback).toHaveBeenCalledWith(grid.grid);
      });
    })
  });
});
