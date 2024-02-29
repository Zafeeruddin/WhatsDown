"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignin = exports.userSignup = void 0;
const z = require("zod");
exports.userSignup = z.object({
    username: z.coerce.string().min(5).max(20).refine((username) => !/\s/.test(username), {
        message: "Username should not contain whitespace",
    }),
    email: z.string().email(),
    password: z.coerce.string().min(8)
});
exports.userSignin = z.object({
    username: z.string().min(8).max(20),
    password: z.coerce.string().min(8)
});
