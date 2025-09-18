/*
 * StructureSheet - Character sheet for Structure/Plot actors
 */

import logger from '../utils/Logger.js';
// TextEditor is a global Foundry VTT API - no need to import explicitly

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
        
        // Format status Items for display
        data.statusEffects = this.actor.getStatusItems().map(item => ({
            id: item.id,
            label: item.name,
            icon: item.img || 'icons/svg/hazard.svg',
            isActive: true
        }));
        
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
        
        // Add status button
        html.find('.add-status-btn[data-action="create-status"]').click(this._onAddCustomStatus.bind(this));
        
        // Remove status Item buttons
        html.find('.remove-status').click(this._onRemoveStatus.bind(this));
        
        // Status name and description change handlers
        html.find('.status-name').change(this._onStatusNameChange.bind(this));
        html.find('.status-description-input').change(this._onStatusDescriptionChange.bind(this));
        
        // Toggle capturable checkbox
        html.find('.capturable-checkbox').change(this._onToggleCapturable.bind(this));
        
        // Make editable fields work with TinyMCE for rich text editing
        if (this.isEditable) {
            this._activateEditor(html);
        }
    }

    /**
     * Handle adding a custom status Item to the structure
     * @param {Event} event - The click event
     * @private
     */
    async _onAddCustomStatus(event) {
        event.preventDefault();
        
        try {
            // 创建自定义状态Item
            await this.actor.addStatus('新状态');
            
            logger.debug(`Added new status to structure ${this.actor.name}`);
        } catch (err) {
            logger.error(`Failed to add status to structure ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to add status: ${err.message}`);
        }
    }
    
    /**
     * Handle status name change
     * @param {Event} event - The change event
     * @private
     */
    async _onStatusNameChange(event) {
        event.preventDefault();
        
        try {
            // Get the status Item ID and new name
            const statusId = event.currentTarget.dataset.statusId;
            const newName = event.currentTarget.value.trim();
            
            if (statusId && newName) {
                // Find the status Item
                const statusItem = this.actor.items.get(statusId);
                
                if (statusItem) {
                    // Update the status name
                    await statusItem.update({ name: newName });
                    logger.debug(`Updated status name from ${statusItem.name} to ${newName} for structure ${this.actor.name}`);
                }
            }
        } catch (err) {
            logger.error(`Failed to update status name for structure ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to update status name: ${err.message}`);
        }
    }
    
    /**
     * Handle status description change
     * @param {Event} event - The change event
     * @private
     */
    async _onStatusDescriptionChange(event) {
        event.preventDefault();
        
        try {
            // Get the status Item ID and new description
            const statusId = event.currentTarget.dataset.statusId;
            const newDescription = event.currentTarget.value.trim();
            
            if (statusId) {
                // Find the status Item
                const statusItem = this.actor.items.get(statusId);
                
                if (statusItem) {
                    // Update the status description
                    await statusItem.update({ 'system.description': newDescription });
                    logger.debug(`Updated status description for structure ${this.actor.name}`);
                }
            }
        } catch (err) {
            logger.error(`Failed to update status description for structure ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to update status description: ${err.message}`);
        }
    }

    /**
     * Handle removing a status Item from the structure
     * @param {Event} event - The click event
     * @private
     */
    async _onRemoveStatus(event) {
        event.preventDefault();
        
        try {
            // Get the status Item ID
            const statusId = event.currentTarget.dataset.statusId;
            
            if (statusId) {
                // Remove the status Item
                await this.actor.removeStatus(statusId);
                logger.debug(`Removed status ${statusId} from structure ${this.actor.name}`);
            } else {
                throw new Error('No status ID provided');
            }
        } catch (err) {
            logger.error(`Failed to remove status from structure ${this.actor.name}:`, err);
            ui.notifications.error(`Failed to remove status: ${err.message}`);
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
                    editable: this.isEditable
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