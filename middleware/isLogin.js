import jwt from 'jsonwebtoken'
import User from '../schema/userSchema.js'

const isLogin = (req, res, next) => {
     res.setHeader('Access-Control-Allow-Credentials', 'true');
    try {
        const token = req.cookies.jwt || req.headers.cookie.split("; ").find((cookie) => cookie.startsWith("jwt="))?.split("=")[1];
        //console.log(token);
        if (!token) return res.status(500).send({ success: false, message: "User Unauthorize" });
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        if(!decode)  return res.status(500).send({success:false, message:"User Unauthorize -Invalid Token"})
        const user = User.findById(decode.userId).select("-password");
        if(!user) return res.status(500).send({success:false, message:"User not found"})
        req.user = user,
        next()
    } catch (error) {
        console.log(`error in isLogin middleware ${error.message}`);
        res.status(500).send({
            success: false,
            message: error
        })
    }
}

export default isLogin