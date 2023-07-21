"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupRepository = void 0;
/* eslint-disable @typescript-eslint/camelcase */
const typeorm_1 = require("typeorm");
const user_1 = __importDefault(require("../middlewares/user"));
const group_entity_1 = require("../entities/group.entity");
let GroupRepository = class GroupRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        // CRUD
        this.createGroup = async (group) => {
            return await this.save(group);
        };
        this.updateGroup = async (groupId, group) => {
            const property = await this.findOne({
                where: { id: groupId },
            });
            return this.save(Object.assign(Object.assign({}, property), user_1.default));
        };
        this.getGroupById = async (groupId) => {
            return await this.findOne({ where: { id: groupId, deleted_date: (0, typeorm_1.IsNull)() } });
        };
        this.getAllGroup = async () => {
            const groups = await this.find({
                where: {
                    deleted_date: (0, typeorm_1.IsNull)(),
                },
                order: {
                    name: 'ASC',
                },
            });
            return groups;
        };
        this.getAllGroupNull = async () => {
            const [result, total] = await this.findAndCount({});
            return {
                data: result,
                count: total,
            };
        };
        this.getGroups = async (page) => {
            const [result, total] = await this.findAndCount({
                order: {
                    id: 'DESC',
                },
                take: 10,
                skip: page ? (page - 1) * 10 : 0,
            });
            return {
                data: result,
                count: total,
            };
        };
        this.deleteGroupById = async (groupId) => {
            return await this.update(groupId, {
                deleted_date: new Date(),
            });
        };
    }
};
GroupRepository = __decorate([
    (0, typeorm_1.EntityRepository)(group_entity_1.Group)
], GroupRepository);
exports.GroupRepository = GroupRepository;
//# sourceMappingURL=group.repository.js.map