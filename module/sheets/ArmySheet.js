/*
 * ArmySheet - Character sheet for Army actors
 */

import logger from '../utils/Logger.js';

export class ArmySheet extends ActorSheet {
    /**
     * Define default rendering options for the sheet
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ['battlefield-system', 'sheet', 'actor', 'army'],
            template: 'systems/battlefield-system/templates/actor/army-sheet.hbs',
            width: 600,
            height: 700,
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
        
        // Format status effects for display
        data.statusEffects = this.actor.effects.map(effect => {
            const statuses = effect.statuses;
            const status = statuses.size > 0 ? Array.from(statuses)[0] : null;
            const configStatus = CONFIG.statusEffects.find(s => s.id === status);
            
            return {
                id: effect.id,
                label: configStatus?.label || game.i18n.localize('battlefield-system.StatusEffects.Unknown'),
                icon: configStatus?.icon || 'icons/svg/hazard.svg',
                isActive: true
            };
        });
        
        // Add system configuration for status effects
        data.configStatusEffects = CONFIG.statusEffects;
        
        return data;
    }

    /**
     * Activate event listeners using the prepared sheet HTML
     * @param {HTMLElement} html - The prepared HTML object ready to be rendered into the DOM
     */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Add hero button
        html.find('.add-hero').click(this._onAddHero.bind(this));
        
        // Remove hero buttons
        html.find('.remove-hero').click(this._onRemoveHero.bind(this));
        
        // Add status effect button
        html.find('.add-status').click(this._onAddStatusEffect.bind(this));
        
        // Remove status effect buttons
        html.find('.remove-status').click(this._onRemoveStatusEffect.bind(this));
        
        // Make editable fields work with TinyMCE for rich text editing
        if (this.isEditable) {
            this._activateEditor(html);
        }
    }

    /**
     * Handle adding a new hero to the army
     * @param {Event} event - The click event
     * @private
     */
    async _onAddHero(event) {
        event.preventDefault();
        
        try {
            // Get current heroes
            const heroes = this.actor.system.heroes || [];
            
            // Add new hero
            heroes.push({
                name: 'New Hero',
                equipment: '',
                traits: ''
            });
            
            // Update the actor
            await this.actor.update({
                'system.heroes': heroes
            });
            
            logger.debug(`Added new hero to army ${this.actor.name}`);
        } catch (err) {
            logger.error(`Failed to add hero to army ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to add hero: ${err.message}`);
        }
    }

    /**
     * Handle removing a hero from the army
     * @param {Event} event - The click event
     * @private
     */
    async _onRemoveHero(event) {
        event.preventDefault();
        
        try {
            // Get the index of the hero to remove
            const index = parseInt(event.currentTarget.dataset.index);
            
            // Get current heroes
            const heroes = this.actor.system.heroes || [];
            
            // Check if index is valid
            if (isNaN(index)) {
                throw new Error('Invalid hero index');
            }
            
            // Remove the hero
            if (index >= 0 && index < heroes.length) {
                const heroName = heroes[index].name;
                heroes.splice(index, 1);
                
                // Update the actor
                await this.actor.update({
                    'system.heroes': heroes
                });
                
                logger.debug(`Removed hero ${heroName} from army ${this.actor.name}`);
            } else {
                throw new Error('Hero index out of range');
            }
        } catch (err) {
            logger.error(`Failed to remove hero from army ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to remove hero: ${err.message}`);
        }
    }

    /**
     * Handle adding a status effect to the army
     * @param {Event} event - The click event
     * @private
     */
    async _onAddStatusEffect(event) {
        event.preventDefault();
        
        try {
            // Get the selected status effect ID
            const statusId = event.currentTarget.dataset.statusId;
            
            if (statusId) {
                await this.actor.addStatusEffect(statusId);
                logger.debug(`Added status effect ${statusId} to army ${this.actor.name}`);
            } else {
                throw new Error('No status effect ID provided');
            }
        } catch (err) {
            logger.error(`Failed to add status effect to army ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to add status effect: ${err.message}`);
        }
    }

    /**
     * Handle removing a status effect from the army
     * @param {Event} event - The click event
     * @private
     */
    async _onRemoveStatusEffect(event) {
        event.preventDefault();
        
        try {
            // Get the status effect ID
            const statusId = event.currentTarget.dataset.statusId;
            
            if (statusId) {
                await this.actor.removeStatusEffect(statusId);
                logger.debug(`Removed status effect ${statusId} from army ${this.actor.name}`);
            } else {
                throw new Error('No status effect ID provided');
            }
        } catch (err) {
            logger.error(`Failed to remove status effect from army ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to remove status effect: ${err.message}`);
        }
    }

    /**
     * Handle form submission for the sheet
     * @param {Event} event - The form submission event
     * @param {Object} formData - The form data to process
     * @private
     */
    async _updateObject(event, formData) {
        try {
            // Process hero data
            const heroUpdates = {};
            const heroes = this.actor.system.heroes || [];
            
            for (let i = 0; i < heroes.length; i++) {
                if (formData[`hero-name-${i}`] !== undefined) {
                    heroUpdates[`system.heroes.${i}.name`] = formData[`hero-name-${i}`];
                    delete formData[`hero-name-${i}`];
                }
                if (formData[`hero-equipment-${i}`] !== undefined) {
                    heroUpdates[`system.heroes.${i}.equipment`] = formData[`hero-equipment-${i}`];
                    delete formData[`hero-equipment-${i}`];
                }
                if (formData[`hero-traits-${i}`] !== undefined) {
                    heroUpdates[`system.heroes.${i}.traits`] = formData[`hero-traits-${i}`];
                    delete formData[`hero-traits-${i}`];
                }
            }
            
            // Update the actor with the form data and hero updates
            await this.actor.update({...formData, ...heroUpdates});
            
            logger.debug(`Updated army sheet for ${this.actor.name}`);
        } catch (err) {
            logger.error(`Failed to update army sheet for ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to save changes: ${err.message}`);
        }
    }

    /**
     * Activate TinyMCE editors for rich text fields
     * @param {HTMLElement} html - The sheet HTML
     * @private
     */
    _activateEditor(html) {
        // Find all elements with the 'editor-content' class and activate TinyMCE
        html.find('.editor-content').each((i, element) => {
            const editorId = element.id;
            const content = element.innerHTML;
            const fieldName = element.dataset.field;
            
            if (editorId && fieldName) {
                // Use TextEditor.create API to create the editor
                TextEditor.create(element, {
                    value: content,
                    onChange: (html) => this._onEditorSubmit(fieldName, html),
                    editable: this.isEditable,
                    document: this.document // 添加document参数
                });
            }
        });
    }

    /**
     * Handle TinyMCE editor content submission
     * @param {string} fieldName - The name of the field being edited
     * @param {string} html - The HTML content from the editor
     * @private
     */
    async _onEditorSubmit(fieldName, html) {
        try {
            // Update the actor with the new editor content
            await this.actor.update({
                [`system.${fieldName}`]: html
            });
            
            logger.debug(`Updated editor field ${fieldName} for army ${this.actor.name}`);
        } catch (err) {
            logger.error(`Failed to update editor field ${fieldName} for army ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to save editor content: ${err.message}`);
        }
    }
}