exports.handleError = (res, error, message) => {
    console.error(error);
    
    if (error.message === 'Email or phone number is required') {
        return res.status(400).json({
            error: 'Bad Request',
            message: error.message
        });
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message: message || 'An unexpected error occurred'
    });
};