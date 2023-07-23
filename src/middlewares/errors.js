import EErrors from "../services/errors/enumError.js";
export default (error, req, res, next) => {
    console.log(error.cause);
    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            res.status(404).send({ status: "error", error:error.name });
            break;
        case EErrors.INVALID_TYPE_ERROR:
            res.status(401).send({ status: "error", error:error.name });
            break;
        case EErrors.DATABASE_ERROR:
            res.status(500).send({ status: "error", error:error.name });
            break;
        default:
            res.status(500).send({ status: "error", error: "Error indeterminado" });
            break;
    }
}


