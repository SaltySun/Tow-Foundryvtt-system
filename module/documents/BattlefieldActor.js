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
     * Add a status effect (Buff/Debuff) to the actor
     * @param {string} statusId - The ID of the status effect
     * @returns {Promise<ActiveEffect>} The created ActiveEffect
     */
    async addStatusEffect(statusId) {
        const status = CONFIG.statusEffects.find(e => e.id === statusId);
        if (!status) {
            logger.error(`Invalid status ID "${statusId}" provided`);
            throw new Error(`Invalid status ID "${statusId}" provided`);
        }
        
        // Check if the status already exists
        const existing = this.effects.find(effect => {
            const statuses = effect.statuses;
            return statuses.size === 1 && statuses.has(status.id);
        });
        
        if (existing) return existing;
        
        // Create a new effect
        const effect = await ActiveEffect.create({
            label: status.label,
            icon: status.icon,
            statuses: new Set([status.id]),
            origin: this.uuid,
            duration: {
                rounds: status.duration?.rounds || null,
                seconds: status.duration?.seconds || null,
                turns: status.duration?.turns || null,
                startRound: game.combat?.round || null,
                startTime: game.time.worldTime
            }
        }, { parent: this });
        
        return effect;
    }

    /**
     * Remove a status effect (Buff/Debuff) from the actor
     * @param {string} statusId - The ID of the status effect to remove
     * @returns {Promise<Array<ActiveEffect>>} The removed ActiveEffects
     */
    async removeStatusEffect(statusId) {
        const effects = this.effects.filter(effect => {
            const statuses = effect.statuses;
            return statuses.size === 1 && statuses.has(statusId);
        });
        
        if (effects.length === 0) return [];
        
        await ActiveEffect.deleteDocuments(effects.map(e => e.id));
        return effects;
    }

    /**
     * Get all ActiveEffects that are created on this Actor.
     * @yields {ActiveEffect}
     * @returns {Generator<ActiveEffect, void, void>}
     */
    *allApplicableEffects({ excludeExternal = false } = {}) {
        for (const effect of this.effects) {
            yield effect;
        }
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