/*
 * FactionSheet - Character sheet for Faction actors
 */

import logger from '../utils/Logger.js';

export class FactionSheet extends ActorSheet {
    /**
     * Define default rendering options for the sheet
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ['battlefield-system', 'sheet', 'actor', 'faction'],
            template: 'systems/battlefield-system/templates/actor/faction-sheet.hbs',
            width: 600,
            height: 500,
            tabs: [
                { navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'main' }
            ]
        });
    }

    /**
     * Prepare data for rendering the sheet
     */
    getData() {
        // Basic data
        const data = super.getData();
        
        // Add the actor's system data
        data.system = this.actor.system;
        
        return data;
    }

    /**
     * Activate event listeners using the prepared sheet HTML
     * @param {HTMLElement} html - The prepared HTML object ready to be rendered into the DOM
     */
    async activateListeners(html) {
        super.activateListeners(html);
        
        // Add enemy button
        html.find('.add-enemy').click(this._onAddEnemy.bind(this));
        
        // Remove enemy buttons
        html.find('.remove-enemy').click(this._onRemoveEnemy.bind(this));
        
        // Add ally button
        html.find('.add-ally').click(this._onAddAlly.bind(this));
        
        // Remove ally buttons
        html.find('.remove-ally').click(this._onRemoveAlly.bind(this));
    }

    /**
     * Handle form submission for the sheet
     * @param {Event} event - The form submission event
     * @param {Object} formData - The form data to process
     * @private
     */
    async _updateObject(event, formData) {
        try {
            // Process enemy data
            const enemyUpdates = {};
            const enemies = this.actor.system.enemies || [];
            
            for (let i = 0; i < enemies.length; i++) {
                if (formData[`enemy-name-${i}`] !== undefined) {
                    enemyUpdates[`system.enemies.${i}.name`] = formData[`enemy-name-${i}`];
                    delete formData[`enemy-name-${i}`];
                }
                if (formData[`enemy-deeds-${i}`] !== undefined) {
                    enemyUpdates[`system.enemies.${i}.deeds`] = formData[`enemy-deeds-${i}`];
                    delete formData[`enemy-deeds-${i}`];
                }
            }
            
            // Process ally data
            const allyUpdates = {};
            const allies = this.actor.system.allies || [];
            
            for (let i = 0; i < allies.length; i++) {
                if (formData[`ally-name-${i}`] !== undefined) {
                    allyUpdates[`system.allies.${i}.name`] = formData[`ally-name-${i}`];
                    delete formData[`ally-name-${i}`];
                }
                if (formData[`ally-deeds-${i}`] !== undefined) {
                    allyUpdates[`system.allies.${i}.deeds`] = formData[`ally-deeds-${i}`];
                    delete formData[`ally-deeds-${i}`];
                }
            }
            
            // Update the actor with the form data, enemy updates, and ally updates
            await this.actor.update({...formData, ...enemyUpdates, ...allyUpdates});
            
            logger.debug(`Updated faction sheet for ${this.actor.name}`);
        } catch (err) {
            logger.error(`Failed to update faction sheet for ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to save changes: ${err.message}`);
        }
    }

    /**
     * Handle adding a new enemy
     * @param {Event} event - The click event
     * @private
     */
    async _onAddEnemy(event) {
        event.preventDefault();
        try {
            const enemies = this.actor.system.enemies || [];
            enemies.push({
                name: '新仇敌',
                deeds: ''
            });
            await this.actor.update({
                'system.enemies': enemies
            });
            logger.debug(`Added new enemy to faction ${this.actor.name}`);
        } catch (err) {
            logger.error(`Failed to add enemy to faction ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to add enemy: ${err.message}`);
        }
    }

    /**
     * Handle removing an enemy
     * @param {Event} event - The click event
     * @private
     */
    async _onRemoveEnemy(event) {
        event.preventDefault();
        try {
            const index = parseInt(event.currentTarget.dataset.index);
            const enemies = this.actor.system.enemies || [];
            if (isNaN(index)) {
                throw new Error('Invalid enemy index');
            }
            if (index >= 0 && index < enemies.length) {
                const enemyName = enemies[index].name;
                enemies.splice(index, 1);
                await this.actor.update({
                    'system.enemies': enemies
                });
                logger.debug(`Removed enemy ${enemyName} from faction ${this.actor.name}`);
            } else {
                throw new Error('Enemy index out of range');
            }
        } catch (err) {
            logger.error(`Failed to remove enemy from faction ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to remove enemy: ${err.message}`);
        }
    }

    /**
     * Handle adding a new ally
     * @param {Event} event - The click event
     * @private
     */
    async _onAddAlly(event) {
        event.preventDefault();
        try {
            const allies = this.actor.system.allies || [];
            allies.push({
                name: '新盟友',
                deeds: ''
            });
            await this.actor.update({
                'system.allies': allies
            });
            logger.debug(`Added new ally to faction ${this.actor.name}`);
        } catch (err) {
            logger.error(`Failed to add ally to faction ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to add ally: ${err.message}`);
        }
    }

    /**
     * Handle removing an ally
     * @param {Event} event - The click event
     * @private
     */
    async _onRemoveAlly(event) {
        event.preventDefault();
        try {
            const index = parseInt(event.currentTarget.dataset.index);
            const allies = this.actor.system.allies || [];
            if (isNaN(index)) {
                throw new Error('Invalid ally index');
            }
            if (index >= 0 && index < allies.length) {
                const allyName = allies[index].name;
                allies.splice(index, 1);
                await this.actor.update({
                    'system.allies': allies
                });
                logger.debug(`Removed ally ${allyName} from faction ${this.actor.name}`);
            } else {
                throw new Error('Ally index out of range');
            }
        } catch (err) {
            logger.error(`Failed to remove ally from faction ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to remove ally: ${err.message}`);
        }
    }
}
