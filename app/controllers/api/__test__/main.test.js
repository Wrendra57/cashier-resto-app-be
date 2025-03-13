const { onLost, onError } = require('../main');

describe('API Main Controller', () => {
    describe('onLost', () => {
        it('should return 404 status and route not found message', () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            onLost(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: "FAIL",
                message: "Route not found!",
            });
        });
    });
});