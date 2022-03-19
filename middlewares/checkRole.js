module.exports = (typeRoles) => {
    return (req, res, next) => {
        const { role } = req.user;
        console.log('role = ', role);
        console.log('typeRoles =', typeRoles);
        next();
    }
}