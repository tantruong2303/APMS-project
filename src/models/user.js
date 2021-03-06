const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");

class User {
        constructor(username, password) {
                this._username = username;
                this.password = password;
                this.isAdmin = false;
        }

        static classTraformer({ username, isAdmin }) {
                const user = new User(username, "");
                user.isAdmin = isAdmin;
                return user;
        }

        set _username(value) {
                this.username = value.toLowerCase();
        }

        get _username() {
                return this.username.toUpperCase();
        }

        async hashingPassword(round) {
                const salt = await bcrypt.genSalt(round);
                const newPassword = await bcrypt.hash(this.password, salt);
                this.password = newPassword;
        }

        async comparePassword(password) {
                const isCorrect = await bcrypt.compare(password, this.password);
                return isCorrect;
        }

        static validateLogin(param) {
                const schema = Joi.object({
                        username: Joi.string().min(5).max(50).required(),
                        password: Joi.string().min(5).max(50).required(),
                });
                return schema.validate(param);
        }

        static validateRegister(param) {
                const schema = Joi.object({
                        username: Joi.string()
                                .min(5)
                                .max(50)
                                .regex(/^[a-zA-Z0-9]/)
                                .required(),
                        password: Joi.string()
                                .min(5)
                                .max(50)
                                .regex(/^[a-zA-Z0-9]/)
                                .required(),
                        confirm: Joi.valid(Joi.ref("password")).required(),
                });
                return schema.validate(param);
        }

        static validateChangePassword(param) {
                const schema = Joi.object({
                        username: Joi.string()
                                .min(5)
                                .max(50)
                                .regex(/^[a-zA-Z0-9]/)
                                .required(),
                        currentPassword: Joi.string()
                                .min(5)
                                .max(50)
                                .regex(/^[a-zA-Z0-9]/)
                                .required(),
                        newPassword: Joi.string()
                                .min(5)
                                .max(50)
                                .regex(/^[a-zA-Z0-9]/)
                                .required(),
                        confirm: Joi.valid(Joi.ref("newPassword")).required(),
                });
                return schema.validate(param);
        }
}

module.exports.User = User;
