const autorization = (role)=>{
    return async(req, res, next) => {
        console.log(req.session.user);
        if (!req.session.user) {
            res.status(401).send({ message: "Debes iniciar session para realizar esta acción" });
        }
        if (req.session.user.role === role) {
            next();
        } else {
            res.status(403).send({ message: "No tienes permisos para realizar esta acción" });
        }
    }
}
export default autorization;