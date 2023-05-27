const Joi = require('joi');

exports.validateProduct = async (req, res, next) => {
    const schema =  Joi.object({
        title: Joi.string().min(4).max(30).required(),
        discription: Joi.string().min(4).max(100).required(),
        content: Joi.string().min(4).max(50).required(),
        brand: Joi.string().min(4).max(10).required(),
        countStock: Joi.number().required(),
        price: Joi.number().required(),
        // thumbnail: Joi.string(),
        // images: Joi.array().items(Joi.string()),
        rating: Joi.number().valid(0, 1, 2, 3, 4, 5).default(0),
        // isFeatured: Joi.boolean().falsy('N').truthy('Y'),
        category: Joi.string().required()
    })

    // console.log(JSON.parse(req.body.product))
    // return
    const {error} = schema.validate(JSON.parse(req.body.product))
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

exports.validatePutProduct = async (req, res, next) => {
    const schema =  Joi.object({
        title: Joi.string().uppercase().trim().min(4).max(30).required(),
        discription: Joi.string().trim().min(4).max(100).required(),
        content: Joi.string().trim().min(4).max(50).required(),
        brand: Joi.string().uppercase().trim().min(4).max(10).required(),
        countStock: Joi.number().integer().positive().required(),
        price: Joi.number().integer().positive().required(),
        // thumbnail: Joi.string(),
        // images: Joi.array().items(Joi.string()),
        rating: Joi.number().valid(0, 1, 2, 3, 4, 5).default(0),
        // isFeatured: Joi.boolean().falsy('N').truthy('Y'),
        category: Joi.string().required()
    })
    const {error}  = schema.validate(JSON.parse(req.body.product));
    // const {error} = schema.validate(req.body)
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
