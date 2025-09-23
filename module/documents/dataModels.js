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
            
            // 特殊能力（现在用作事件效果）
            specialAbilities: new StringField({
                required: false,
                nullable: true,
                initial: ""
            }),
            
            // 传奇军团列表
            legendaryLegions: new ArrayField(new ObjectField({
                schema: {
                    name: new StringField({
                        required: true,
                        nullable: false,
                        initial: "传奇军团名称"
                    }),
                    banner: new StringField({
                        required: false,
                        nullable: true,
                        initial: ""
                    }),
                    rules: new StringField({
                        required: false,
                        nullable: true,
                        initial: ""
                    })
                }
            }), {
                required: false,
                initial: []
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

    /**
     * 获取所有传奇军团的列表
     * @returns {Array<Object>} 传奇军团列表
     */
    getLegendaryLegions() {
        return this.legendaryLegions || [];
    }

    /**
     * 添加新传奇军团
     * @param {Object} legionData - 传奇军团数据
     */
    addLegendaryLegion(legionData) {
        try {
            if (!legionData || typeof legionData !== 'object') {
                throw new Error('Invalid legion data provided');
            }
            
            const newLegion = {
                name: legionData.name || "新传奇军团",
                banner: legionData.banner || "",
                rules: legionData.rules || ""
            };
            this.legendaryLegions.push(newLegion);
            
            logger.debug(`Added new legendary legion to army: ${newLegion.name}`);
        } catch (err) {
            logger.error(`Failed to add legendary legion to army:`, err);
            throw err;
        }
    }

    /**
     * 更新传奇军团信息
     * @param {number} index - 传奇军团索引
     * @param {Object} legionData - 更新后的传奇军团数据
     */
    updateLegendaryLegion(index, legionData) {
        try {
            if (!Number.isInteger(index)) {
                throw new Error('Invalid legion index provided');
            }
            
            if (index >= 0 && index < this.legendaryLegions.length) {
                if (!legionData || typeof legionData !== 'object') {
                    throw new Error('Invalid legion data provided');
                }
                
                const oldName = this.legendaryLegions[index].name;
                this.legendaryLegions[index] = {
                    ...this.legendaryLegions[index],
                    ...legionData
                };
                
                logger.debug(`Updated legendary legion at index ${index}: ${oldName} -> ${this.legendaryLegions[index].name}`);
            } else {
                throw new Error(`Legion index ${index} out of bounds`);
            }
        } catch (err) {
            logger.error(`Failed to update legendary legion at index ${index}:`, err);
            // Don't throw the error to avoid breaking the flow for UI operations
        }
    }

    /**
     * 删除传奇军团
     * @param {number} index - 传奇军团索引
     */
    removeLegendaryLegion(index) {
        try {
            if (!Number.isInteger(index)) {
                throw new Error('Invalid legion index provided');
            }
            
            if (index >= 0 && index < this.legendaryLegions.length) {
                const removedLegion = this.legendaryLegions.splice(index, 1)[0];
                logger.debug(`Removed legendary legion from army: ${removedLegion.name}`);
            } else {
                throw new Error(`Legion index ${index} out of bounds`);
            }
        } catch (err) {
            logger.error(`Failed to remove legendary legion at index ${index}:`, err);
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
 * Data Model for Faction Actors
 */
export class FactionDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            // 势力名称
            name: new StringField({
                required: true,
                nullable: false,
                initial: "新势力"
            }),
            
            // 势力图标
            icon: new StringField({
                required: false,
                nullable: true,
                initial: "icons/svg/star.svg"
            }),
            
            // 势力类型
            factionType: new StringField({
                required: false,
                nullable: true,
                initial: "拥土",
                choices: {
                    "拥土": "拥土",
                    "游荡": "游荡", 
                    "佣兵": "佣兵"
                }
            }),
            
            // 遗物数量
            relics: new NumberField({
                required: false,
                nullable: true,
                initial: 0,
                min: 0
            }),
            
            // 仇敌列表
            enemies: new ArrayField(new ObjectField({
                schema: {
                    name: new StringField({
                        required: true,
                        nullable: false,
                        initial: "仇敌名称"
                    }),
                    deeds: new StringField({
                        required: false,
                        nullable: true,
                        initial: ""
                    })
                }
            }), {
                required: false,
                initial: []
            }),
            
            // 盟友列表
            allies: new ArrayField(new ObjectField({
                schema: {
                    name: new StringField({
                        required: true,
                        nullable: false,
                        initial: "盟友名称"
                    }),
                    deeds: new StringField({
                        required: false,
                        nullable: true,
                        initial: ""
                    })
                }
            }), {
                required: false,
                initial: []
            }),
            
            // 领土尺寸
            territorySize: new NumberField({
                required: false,
                nullable: true,
                initial: 0,
                min: 0
            })
        };
    }

    /**
     * 获取所有仇敌的列表
     * @returns {Array<Object>} 仇敌列表
     */
    getEnemies() {
        return this.enemies || [];
    }

    /**
     * 添加新仇敌
     * @param {Object} enemyData - 仇敌数据
     */
    addEnemy(enemyData) {
        try {
            if (!enemyData || typeof enemyData !== 'object') {
                throw new Error('Invalid enemy data provided');
            }
            
            const newEnemy = {
                name: enemyData.name || "新仇敌",
                deeds: enemyData.deeds || ""
            };
            this.enemies.push(newEnemy);
            
            logger.debug(`Added new enemy to faction: ${newEnemy.name}`);
        } catch (err) {
            logger.error(`Failed to add enemy to faction:`, err);
            throw err;
        }
    }

    /**
     * 更新仇敌信息
     * @param {number} index - 仇敌索引
     * @param {Object} enemyData - 更新后的仇敌数据
     */
    updateEnemy(index, enemyData) {
        try {
            if (!Number.isInteger(index)) {
                throw new Error('Invalid enemy index provided');
            }
            
            if (index >= 0 && index < this.enemies.length) {
                if (!enemyData || typeof enemyData !== 'object') {
                    throw new Error('Invalid enemy data provided');
                }
                
                const oldName = this.enemies[index].name;
                this.enemies[index] = {
                    ...this.enemies[index],
                    ...enemyData
                };
                
                logger.debug(`Updated enemy at index ${index}: ${oldName} -> ${this.enemies[index].name}`);
            } else {
                throw new Error(`Enemy index ${index} out of bounds`);
            }
        } catch (err) {
            logger.error(`Failed to update enemy at index ${index}:`, err);
        }
    }

    /**
     * 删除仇敌
     * @param {number} index - 仇敌索引
     */
    removeEnemy(index) {
        try {
            if (!Number.isInteger(index)) {
                throw new Error('Invalid enemy index provided');
            }
            
            if (index >= 0 && index < this.enemies.length) {
                const removedEnemy = this.enemies.splice(index, 1)[0];
                logger.debug(`Removed enemy from faction: ${removedEnemy.name}`);
            } else {
                throw new Error(`Enemy index ${index} out of bounds`);
            }
        } catch (err) {
            logger.error(`Failed to remove enemy at index ${index}:`, err);
        }
    }

    /**
     * 获取所有盟友的列表
     * @returns {Array<Object>} 盟友列表
     */
    getAllies() {
        return this.allies || [];
    }

    /**
     * 添加新盟友
     * @param {Object} allyData - 盟友数据
     */
    addAlly(allyData) {
        try {
            if (!allyData || typeof allyData !== 'object') {
                throw new Error('Invalid ally data provided');
            }
            
            const newAlly = {
                name: allyData.name || "新盟友",
                deeds: allyData.deeds || ""
            };
            this.allies.push(newAlly);
            
            logger.debug(`Added new ally to faction: ${newAlly.name}`);
        } catch (err) {
            logger.error(`Failed to add ally to faction:`, err);
            throw err;
        }
    }

    /**
     * 更新盟友信息
     * @param {number} index - 盟友索引
     * @param {Object} allyData - 更新后的盟友数据
     */
    updateAlly(index, allyData) {
        try {
            if (!Number.isInteger(index)) {
                throw new Error('Invalid ally index provided');
            }
            
            if (index >= 0 && index < this.allies.length) {
                if (!allyData || typeof allyData !== 'object') {
                    throw new Error('Invalid ally data provided');
                }
                
                const oldName = this.allies[index].name;
                this.allies[index] = {
                    ...this.allies[index],
                    ...allyData
                };
                
                logger.debug(`Updated ally at index ${index}: ${oldName} -> ${this.allies[index].name}`);
            } else {
                throw new Error(`Ally index ${index} out of bounds`);
            }
        } catch (err) {
            logger.error(`Failed to update ally at index ${index}:`, err);
        }
    }

    /**
     * 删除盟友
     * @param {number} index - 盟友索引
     */
    removeAlly(index) {
        try {
            if (!Number.isInteger(index)) {
                throw new Error('Invalid ally index provided');
            }
            
            if (index >= 0 && index < this.allies.length) {
                const removedAlly = this.allies.splice(index, 1)[0];
                logger.debug(`Removed ally from faction: ${removedAlly.name}`);
            } else {
                throw new Error(`Ally index ${index} out of bounds`);
            }
        } catch (err) {
            logger.error(`Failed to remove ally at index ${index}:`, err);
        }
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