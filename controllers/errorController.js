const triggerError = (req, res, next) => {
    // Simulate a server error
    const err = new Error("Intentional 500 error triggered.");
    err.status = 500;
    next(err);
};

module.exports = { triggerError };
