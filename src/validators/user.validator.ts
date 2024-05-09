// const Joi = require('joi');
import Joi from "joi";

export class UserValidator {
    public static create = Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().lowercase().trim().email().required(),
        phone: Joi.string().pattern(new RegExp('^[0-9]{3,30}$')),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        age: Joi.number().min(18).max(100).required(),
    })
    public static update = Joi.object({
        name: Joi.string().alphanum().min(3).max(30),
        phone: Joi.string().pattern(new RegExp('^[0-9]{3,30}$')),
        age: Joi.number().min(18).max(100),
    })
    public static login = Joi.object({
        email: Joi.string().lowercase().trim().email(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    })

    public static forgotPassword = Joi.object({
        email: Joi.string().lowercase().trim().email().required(),
    });

    public static setForgotPassword = Joi.object({
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    });

};