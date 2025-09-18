/*
 * Data Models for Battlefield System
 */

import logger from '../utils/Logger.js';

const { NumberField, StringField, ArrayField, ObjectField, BooleanField } = foundry.data.fields;

/**
 * Data Model for Army Actors
 */
export class ArmyDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            // 基础信息
            name: new StringField({
                required: true,
                nullable: false,
                initial: "New Army"
            }),
            
            // 阵营信息
            faction: new StringField({
                required: false,
                nullable: true,
                initial: ""
            }),
            
            // 军队规模
            size: new NumberField({
                required: false,
                nullable: true,
                initial: 0,
                min: 0
            }),
            
            // 战斗力评级
            powerRating: new NumberField({
                required: false,
                nullable: true,
                initial: 0,
                min: 0,
                max: 100
            }),
            
            // 描述信息
            description: new StringField({
                required: false,
                nullable: true,
                initial: ""
            }),
            
            // 传奇英雄列表
            heroes: new ArrayField(new ObjectField({
                schema: {
                    name: new StringField({
                        required: true,
                        nullable: false,
                        initial: "Hero Name"
                    }),
                    equipment: new StringField({
                        required: false,
                        nullable: true,
                        initial: ""
                    }),
                    traits: new StringField({
                        required: false,
                        nullable: true,
                        initial: ""
                    })
                }
            }), {
                required: false,
                initial: []
            }),
            
            // 载誉军团信息
            honoredLegions: new StringField({
                required: false,
                nullable: true,
                initial: ""
            }),
            
            // 特殊能力
            specialAbilities: new StringField({
                required: false,
                nullable: true,
                initial: ""
            })
        };
    }

    /**
     * 获取所有英雄的列表
     * @returns {Array<Object>} 英雄列表
     */
    getHeroes() {
        return this.heroes || [];
    }

    /**
     * 添加新英雄
     * @param {Object} heroData - 英雄数据
     */
    addHero(heroData) {
        try {
            if (!heroData || typeof heroData !== 'object') {
                throw new Error('Invalid hero data provided');
            }
            
            const newHero = {
                name: heroData.name || "New Hero",
                equipment: heroData.equipment || "",
                traits: heroData.traits || ""
            };
            this.heroes.push(newHero);
            
            logger.debug(`Added new hero to army: ${newHero.name}`);
        } catch (err) {
            logger.error(`Failed to add hero to army:`, err);
            throw err;
        }
    }

    /**
     * 更新英雄信息
     * @param {number} index - 英雄索引
     * @param {Object} heroData - 更新后的英雄数据
     */
    updateHero(index, heroData) {
        try {
            if (!Number.isInteger(index)) {
                throw new Error('Invalid hero index provided');
            }
            
            if (index >= 0 && index < this.heroes.length) {
                if (!heroData || typeof heroData !== 'object') {
                    throw new Error('Invalid hero data provided');
                }
                
                const oldName = this.heroes[index].name;
                this.heroes[index] = {
                    ...this.heroes[index],
                    ...heroData
                };
                
                logger.debug(`Updated hero at index ${index}: ${oldName} -> ${this.heroes[index].name}`);
            } else {
                throw new Error(`Hero index ${index} out of bounds`);
            }
        } catch (err) {
            logger.error(`Failed to update hero at index ${index}:`, err);
            // Don't throw the error to avoid breaking the flow for UI operations
        }
    }

    /**
     * 删除英雄
     * @param {number} index - 英雄索引
     */
    removeHero(index) {
        try {
            if (!Number.isInteger(index)) {
                throw new Error('Invalid hero index provided');
            }
            
            if (index >= 0 && index < this.heroes.length) {
                const removedHero = this.heroes.splice(index, 1)[0];
                logger.debug(`Removed hero from army: ${removedHero.name}`);
            } else {
                throw new Error(`Hero index ${index} out of bounds`);
            }
        } catch (err) {
            logger.error(`Failed to remove hero at index ${index}:`, err);
            // Don't throw the error to avoid breaking the flow for UI operations
        }
    }
}

/**
 * Data Model for Structure/Plot Actors
 */
export class StructureDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            // 地块类型
            structureType: new StringField({
                required: true,
                nullable: false,
                initial: "Generic"
            }),
            
            // 建筑类型（如果适用）
            buildingType: new StringField({
                required: false,
                nullable: true,
                initial: ""
            }),
            
            // 描述信息
            description: new StringField({
                required: false,
                nullable: true,
                initial: ""
            }),
            
            // 特殊效果备注
            specialEffects: new StringField({
                required: false,
                nullable: true,
                initial: ""
            }),
            
            // 所属势力
            ownerFaction: new StringField({
                required: false,
                nullable: true,
                initial: ""
            }),
            
            // 防御值
            defenseValue: new NumberField({
                required: false,
                nullable: true,
                initial: 0,
                min: 0
            }),
            
            // 是否可占领
            isCapturable: new BooleanField({
                required: false,
                initial: true
            }),
            
            // 资源产出（如果适用）
            resourceProduction: new StringField({
                required: false,
                nullable: true,
                initial: ""
            })
        };
    }

    /**
     * 获取地块完整类型信息
     * @returns {string} 完整的地块类型描述
     */
    getFullType() {
        if (this.buildingType) {
            return `${this.structureType} - ${this.buildingType}`;
        }
        return this.structureType;
    }
}

/**
 * Data Model for Status Items
 */
export class StatusDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            // 状态描述
            description: new StringField({
                required: false,
                nullable: true,
                initial: "",
                label: 'battlefield-system.Status.Description'
            }),
            
            // 持续时间（轮次、回合或秒）
            duration: new ObjectField({
                schema: {
                    rounds: new NumberField({
                        required: false,
                        nullable: true,
                        initial: null,
                        min: 0
                    }),
                    turns: new NumberField({
                        required: false,
                        nullable: true,
                        initial: null,
                        min: 0
                    }),
                    seconds: new NumberField({
                        required: false,
                        nullable: true,
                        initial: null,
                        min: 0
                    })
                },
                required: false,
                nullable: true,
                initial: null
            }),
            
            // 状态是否激活
            isActive: new BooleanField({
                required: false,
                initial: true,
                label: 'battlefield-system.Status.IsActive'
            }),
            
            // 状态来源
            source: new StringField({
                required: false,
                nullable: true,
                initial: ""
            })
        };
    }
    
    /**
     * 获取状态的完整显示信息
     * @returns {Object} 包含状态名称、图标和描述的对象
     */
    getDisplayInfo() {
        return {
            name: this.parent.name || "Unknown Status",
            icon: this.parent.img || "icons/svg/hazard.svg",
            description: this.description || "No description provided",
            isActive: this.isActive
        };
    }
    
    /**
     * 切换状态的激活/禁用状态
     */
    toggleActive() {
        this.isActive = !this.isActive;
        return this.parent.update({"system.isActive": this.isActive});
    }
}