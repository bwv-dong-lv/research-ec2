"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
/* eslint-disable @typescript-eslint/camelcase */
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.createUser = async (user) => {
            return await this.save(user);
        };
        this.getUserByEmail = async (userEmail) => {
            return await this.findOne({ email: userEmail });
        };
        this.getUserById = async (userId) => {
            return await this.findOne({ id: userId });
        };
        this.updateUser = async (userId, user) => {
            const property = await this.findOne({
                where: { id: userId },
            });
            return this.save(Object.assign(Object.assign({}, property), user));
        };
        this.getAllUsers = async (email, name, user_flg, phone) => {
            const isMultiUserType = Array.isArray(user_flg);
            const whereClause = {
                name: (0, typeorm_1.Like)(`%${name ? name : ''}%`),
                user_flg: isMultiUserType ? (0, typeorm_1.In)(user_flg) : user_flg,
                del_flg: 0,
            };
            if (email) {
                whereClause.email = email;
            }
            if (phone) {
                whereClause.phone = phone;
            }
            const [result, total] = await this.findAndCount({
                where: whereClause,
            });
            return {
                data: result,
                count: total,
            };
        };
        this.findUsers = async (email, name, user_flg, date_of_birth, phone, page) => {
            const isMultiUserType = Array.isArray(user_flg);
            const whereClause = {
                name: (0, typeorm_1.Like)(`%${name ? name : ''}%`),
                user_flg: isMultiUserType ? (0, typeorm_1.In)(user_flg) : user_flg,
                del_flg: 0,
            };
            if (email) {
                whereClause.email = email;
            }
            if (phone) {
                whereClause.phone = phone;
            }
            const [result, total] = await this.findAndCount({
                where: whereClause,
                take: 10,
                skip: page ? (page - 1) * 10 : 0,
            });
            return {
                data: result,
                count: total,
            };
        };
        // deleteUserById = async (userId: number, adminId: number, date: Date) => {
        //   return await this.update(userId, {
        //     del_flg: 1,
        //     deleted_by: adminId,
        //     deleted_at: date,
        //   });
        // };
        this.isEmailInvalid = async (email) => {
            const user = await this.getUserByEmail(email);
            return user ? true : false;
        };
    }
};
UserRepository = __decorate([
    (0, typeorm_1.EntityRepository)(user_entity_1.User)
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map