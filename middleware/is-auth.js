const isAuth = (req, res, next, access) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    if (access === 'admin' && req.session.user.access !== 'Admin') {
        return res.redirect('/');
    }
    next();
};

export default isAuth;
