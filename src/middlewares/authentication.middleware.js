const { verifyToken, decodeToken } = require('../utils/jwt.util')

exports.isAuth = async (req, res, next) => {
    let token = req.params.token;
    try {
        if( !req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
            return res.status(403).json({message: 'Invalid token, Unauthorized user'})
        }

        token = req.headers.authorization.split(' ')[1]

        const { expired } = verifyToken(token);
    
        if (expired) {
            return res.status(403).json({message: 'Expired token, Unauthorized user'})
        } 
        // req.user = { _id: decode?._id }
        req.user = decodeToken(token)
       
        next();

    } catch (error) {
        return res.status(403).json({
            success: false,
            message: error
        })    
    }
};