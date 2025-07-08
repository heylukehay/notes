export const successResponse = (res, {
    message = 'Operation successful',
    data = null,
    statusCode = 200,
    internalCode = 'OPERATION_SUCCESS',
}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        internalCode,
        ...(data && { data }),
    });
};

export const errorResponse = (res, {
    message = 'An error occurred',
    statusCode = 500,
    internalCode = 'INTERNAL_ERROR',
}) => {
    return res.status(statusCode).json({
        success: false,
        message,
        internalCode,
    });
};