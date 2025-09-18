/*
 * BattlefieldActor - Custom Actor class for Battlefield System
 */

import logger from '../utils/Logger.js';

export const BattlefieldActorTypes = ['army', 'structure'];

/**
 * Extend the base Actor document
 * @extends {Actor}
 */
export default class BattlefieldActor extends Actor {
    static isArmyActor(actor) {
        return !!actor && actor instanceof BattlefieldActor && actor.type === 'army';
    }

    static isStructureActor(actor) {
        return !!actor && actor instanceof BattlefieldActor && actor.type === 'structure';
    }

    isArmyActor() {
        return BattlefieldActor.isArmyActor(this);
    }

    isStructureActor() {
        return BattlefieldActor.isStructureActor(this);
    }

    /**
     * @override
     * @ignore
     */
    _onCreate(data, options, userId) {
        super._onCreate(data, options, userId);
        if (this.permission === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) {
            if (!data.flags?.[game.system.id]?.version) {
                this.setFlag(game.system.id, 'version', game.system.version);
            }
        }
    }

    /**
     * Add a status as an Item to the actor
     * @param {string} statusName - The name of the status
     * @returns {Promise<Item>} The created Item
     */
    async addStatus(statusName) {
        if (!statusName || typeof statusName !== 'string' || statusName.trim() === '') {
            logger.error('Invalid status name provided');
            throw new Error('Invalid status name provided');
        }
        
        // Check if the status already exists
        const existing = this.items.find(item => item.type === 'status' && item.name === statusName);
        
        if (existing) {
            logger.debug(`Status "${statusName}" already exists on actor ${this.name}`);
            return existing;
        }
        
        // Create a new status Item
        const statusItem = await this.createEmbeddedDocuments('Item', [{
            name: statusName,
            type: 'status',
            img: 'icons/svg/hazard.svg',
            system: {
                description: '',
                duration: null,
                isActive: true,
                source: this.uuid
            },
            flags: {
                'battlefield-system': {
                    isStatus: true
                }
            }
        }]);
        
        logger.debug(`Added status "${statusName}" to actor ${this.name}`);
        return statusItem[0];
    }

    /**
     * Remove a status Item from the actor
     * @param {string} statusId - The ID of the status Item to remove
     * @returns {Promise<Array<Item>>} The removed Items
     */
    async removeStatus(statusId) {
        const statusItem = this.items.get(statusId);
        
        if (!statusItem || statusItem.type !== 'status') {
            logger.warn(`No status Item found with ID: ${statusId}`);
            return [];
        }
        
        await this.deleteEmbeddedDocuments('Item', [statusId]);
        logger.debug(`Removed status "${statusItem.name}" from actor ${this.name}`);
        return [statusItem];
    }

    /**
     * Get all status Items on the actor
     * @returns {Array<Item>} Array of status Items
     */
    getStatusItems() {
        return this.items.filter(item => item.type === 'status');
    }

    /**
     * @deprecated Use addStatus instead
     */
    async addStatusEffect(statusId) {
        logger.warn('addStatusEffect is deprecated. Use addStatus instead.');
        // This is kept for backward compatibility but will be removed in future versions
        try {
            const status = CONFIG.statusEffects.find(e => e.id === statusId);
            if (status) {
                return this.addStatus(status.label);
            }
        } catch (err) {
            logger.error('Error in deprecated addStatusEffect:', err);
        }
        return null;
    }

    /**
     * @deprecated Use removeStatus instead
     */
    async removeStatusEffect(statusId) {
        logger.warn('removeStatusEffect is deprecated. Use removeStatus instead.');
        // This is kept for backward compatibility but will be removed in future versions
        try {
            const status = this.items.find(item => {
                return item.type === 'status' && item.name === statusId;
            });
            if (status) {
                return this.removeStatus(status.id);
            }
        } catch (err) {
            logger.error('Error in deprecated removeStatusEffect:', err);
        }
        return [];
    }

    /**
     * Get all ActiveEffects that are created on this Actor and effects from status Items.
     * @yields {ActiveEffect}
     * @returns {Generator<ActiveEffect, void, void>}
     */
    *allApplicableEffects({ excludeExternal = false } = {}) {
        // First yield all ActiveEffects for backward compatibility
        for (const effect of this.effects) {
            yield effect;
        }
        
        // TODO: In future versions, we should create ActiveEffects based on status Items
        // For now, we just yield the existing effects
    }

    /**
     * @override
     * @inheritDoc
     * @ignore
     */
    prepareDerivedData() {
        // Prepare data specific to each actor type
        if (this.isArmyActor()) {
            this._prepareArmyData();
        } else if (this.isStructureActor()) {
            this._prepareStructureData();
        }
    }

    /**
     * Prepare data specific to army actors
     * @private
     */
    _prepareArmyData() {
        // Additional data preparation for army actors can be added here
    }

    /**
     * Prepare data specific to structure actors
     * @private
     */
    _prepareStructureData() {
        // Additional data preparation for structure actors can be added here
    }

    /**
     * @override
     * @inheritDoc
     * @ignore
     */
    getRollData() {
        const rollData = super.getRollData();
        // Add any additional roll data specific to our system
        return rollData;
    }
}