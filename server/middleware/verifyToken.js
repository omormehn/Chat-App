import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "Not Authenticated" });
    
     try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = decoded;
         next();
     } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
        throw new Error(error);
     }
}