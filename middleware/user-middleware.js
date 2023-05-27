const Joi = require('joi');



exports.validatelogin = async (req, res, next) => {

    const schema =  Joi.object({
        email: Joi.string().email().required(),
        passeword: Joi.string().max(13).min(6).required(),
    })
    const {value,error} = schema.validate(req.body)
    if(error){
        const {path,message} = error.details[0];
        return res.status(404).json({
            error: {
                path: path[0], message
            }
        })

    }
    next();

}

exports.validateRegister = async (req, res, next) => {

    const schema =  Joi.object({
        name: Joi.string().uppercase().min(4).max(15).required(),
        email: Joi.string().email().required(),
        passeword: Joi.string().min(4).max(15).required(),
        address: Joi.string().lowercase().min(4).max(30).required(),
        // city: Joi.string().max(10).min(4),
        // country: Joi.string().max(10).min(4),
        // phone: Joi.string(),
        // age: Joi.number().integer().positive().required(),
    })
    const {error} = schema.validate(req.body)
    if(error){
        const {path,message} = error.details[0];
        return res.status(404).json({
            error: {
                path: path[0], message
            }
        })

    }
    next();

}