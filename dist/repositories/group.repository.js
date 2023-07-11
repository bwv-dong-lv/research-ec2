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
        // deleteUserById = async (userId: number, adminId: number, date: Date) => {
        //   return await this.update(userId, {
        //     del_flg: 1,
        //     deleted_by: adminId,
        //     deleted_at: date,
        //   });
        // };
        this.getGroupById = async (groupId) => {
            return await this.findOne({ id: groupId });
        };
        this.getAllGroup = async () => {
            const groups = await this.find({ deleted_date: (0, typeorm_1.IsNull)() });
            return groups;
        };
    }
};
GroupRepository = __decorate([
    (0, typeorm_1.EntityRepository)(group_entity_1.Group)
], GroupRepository);
exports.GroupRepository = GroupRepository;
//# sourceMappingURL=group.repository.js.map