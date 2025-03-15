import jwt from 'jsonwebtoken';

export function authToken (req,res, next) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: 'Доступ запрещен' });
    }
  
    jwt.verify(token, process.env.SECRET, (err, user) => {  
      if (err) {
        return res.status(403).json({ msg: 'Неверный токен' });
      }
      req.user = user;
      console.log(user);
      next();
    });
  }