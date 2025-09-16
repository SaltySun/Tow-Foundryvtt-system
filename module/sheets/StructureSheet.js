/*
 * StructureSheet - Character sheet for Structure/Plot actors
 */

import logger from '../utils/Logger.js';

export class StructureSheet extends ActorSheet {
    /**
     * Define default rendering options for the sheet
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ['battlefield-system', 'sheet', 'actor', 'structure'],
            template: 'systems/battlefield-system/templates/actor/structure-sheet.hbs',
            width: 550,
            height: 600,
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
        
        // Get full type description
        data.fullType = this.actor.system.getFullType ? this.actor.system.getFullType() : this.actor.system.structureType;
        
        return data;
    }

    /**
     * Activate event listeners using the prepared sheet HTML
     * @param {HTMLElement} html - The prepared HTML object ready to be rendered into the DOM
     */
    activateListeners(html) {
        super.activateListeners(html);
        
        // Add status effect button
        html.find('.add-status').click(this._onAddStatusEffect.bind(this));
        
        // Remove status effect buttons
        html.find('.remove-status').click(this._onRemoveStatusEffect.bind(this));
        
        // Toggle capturable checkbox
        html.find('.capturable-checkbox').change(this._onToggleCapturable.bind(this));
        
        // Make editable fields work with TinyMCE for rich text editing
        if (this.isEditable) {
            this._activateEditor(html);
        }
    }

    /**
     * Handle adding a status effect to the structure
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
                logger.debug(`Added status effect ${statusId} to structure ${this.actor.name}`);
            } else {
                throw new Error('No status effect ID provided');
            }
        } catch (err) {
            logger.error(`Failed to add status effect to structure ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to add status effect: ${err.message}`);
        }
    }

    /**
     * Handle removing a status effect from the structure
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
                logger.debug(`Removed status effect ${statusId} from structure ${this.actor.name}`);
            } else {
                throw new Error('No status effect ID provided');
            }
        } catch (err) {
            logger.error(`Failed to remove status effect from structure ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to remove status effect: ${err.message}`);
        }
    }

    /**
     * Handle toggling the capturable status
     * @param {Event} event - The change event
     * @private
     */
    async _onToggleCapturable(event) {
        event.preventDefault();
        
        try {
            // Get the new value
            const isCapturable = event.currentTarget.checked;
            
            // Update the actor
            await this.actor.update({
                'system.isCapturable': isCapturable
            });
            
            logger.debug(`Updated capturable status for structure ${this.actor.name} to ${isCapturable}`);
        } catch (err) {
            logger.error(`Failed to update capturable status for structure ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to update capturable status: ${err.message}`);
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
            // Update the actor with the form data
            await this.actor.update(formData);
            
            logger.debug(`Updated structure sheet for ${this.actor.name}`);
        } catch (err) {
            logger.error(`Failed to update structure sheet for ${this.actor.name}:`, err);
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
            
            logger.debug(`Updated editor field ${fieldName} for structure ${this.actor.name}`);
        } catch (err) {
            logger.error(`Failed to update editor field ${fieldName} for structure ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to save editor content: ${err.message}`);
        }
    }
}