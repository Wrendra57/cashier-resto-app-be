const { toTemplateResponseApi, success, created, internalServerError, badRequest } = require('../templateResponeApi');

describe('templateResponeApi utility functions', () => {
    describe('toTemplateResponseApi', () => {
        it('should return the correct template response', () => {
            const params = {
                status: 'success',
                message: 'Operation successful',
                data: { id: 1 }
            };
            const result = toTemplateResponseApi(params);
            expect(result).toEqual({
                status: 'success',
                message: 'Operation successful',
                data: { id: 1 }
            });
        });
    });

    describe('internalServerError', () => {
        it('should return the correct internal server error response', () => {
            const result = internalServerError();
            expect(result).toEqual({
                code: 500,
                status: 'Error',
                message: 'Internal Server Error',
                data: null
            });
        });
    });

    describe('success', () => {
        it('should return the correct success response', () => {
            const data = { id: 1 };
            const message = 'Operation successful';
            const result = success(data, message);
            expect(result).toEqual({
                code: 200,
                status: 'Success',
                message: message,
                data: data
            });
        });
    });

    describe('created', () => {
        it('should return the correct created response', () => {
            const data = { id: 1 };
            const message = 'Resource created';
            const result = created(data, message);
            expect(result).toEqual({
                code: 201,
                status: 'Success',
                message: message,
                data: data
            });
        });
    });

    describe('badRequest', () => {
        it('should return the correct bad request response', () => {
            const message = 'Invalid request';
            const result = badRequest(message);
            expect(result).toEqual({
                code: 400,
                status: 'Failed',
                message: message,
                data: null
            });
        });
    });
});