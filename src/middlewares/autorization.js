const autorization = (role) => {
    return (req, res, next) => {
        //console.log("authorization",req.session.user);
        if (!req.session.user) {//Si el usuario no esta logueado
            return res.status(401).send({ message: "Debes iniciar session para realizar esta acción" });
        } else {//Si el usuario esta logueado
            if (req.session.user.role == role) {
                next();
            } else {
                return res.status(403).send({ message: "No tienes permisos para realizar esta acción" });
            }
        }
    }
}
export default autorization;