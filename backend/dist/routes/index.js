"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRouter = void 0;
const express = require("express");
const user_1 = require("./user");
exports.indexRouter = express.Router();
const cors = require("cors");
exports.indexRouter.use(cors());
exports.indexRouter.use("/user", user_1.userRouter);
