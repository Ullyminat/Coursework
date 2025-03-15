export function roleCheck (req,res) {
    return (req,res,next,error) => {
        if (req.user.role === role) {
            return next();
        } else {
            res.status(403).json({error})
        }}
} 