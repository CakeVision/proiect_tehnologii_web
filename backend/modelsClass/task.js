"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { Task } from '../models';
var sequelize_1 = require("sequelize");
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
var Task = /** @class */ (function (_super) {
    __extends(Task, _super);
    function Task() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Task.initModel = function (sequelize) {
        Task.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                field: "task_id",
            },
            title: {
                type: sequelize_1.DataTypes.STRING(200),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'Title is required'
                    }
                }
            },
            idCreator: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                field: 'id_creator',
                references: {
                    model: 'Users',
                    key: 'user_id'
                }
            }
        }, {
            sequelize: sequelize,
            tableName: "Tasks",
        });
        return Task;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Task.associate = function (models) {
        Task.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'creator_id'
        });
    };
    return Task;
}(sequelize_1.Model));
exports.Task = Task;
// task_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//     field: 'task_id'
//   },
//   id_creator: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   title: {
//     type: DataTypes.STRING(250),
//     allowNull: false
//   }
// }, {
//   tableName: 'Tasks',
//   timestamps: false
// }
