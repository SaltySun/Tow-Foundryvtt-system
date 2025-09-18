/*
 * Battlefield System for Foundry VTT
 * A system for managing armies, heroes, and battlefield locations
 */

import BattlefieldActor from './documents/BattlefieldActor.js';
import { ArmySheet } from './sheets/ArmySheet.js';
import { StructureSheet } from './sheets/StructureSheet.js';
import { ArmyDataModel, StructureDataModel, StatusDataModel } from './documents/dataModels.js';
import logger from './utils/Logger.js';

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */
Hooks.once('init', async function() {
    try {
        // Define custom Document classes
        CONFIG.Actor.documentClass = BattlefieldActor;
        CONFIG.Actor.dataModels.army = ArmyDataModel;
        CONFIG.Actor.dataModels.structure = StructureDataModel;
        
        // Define custom Item data models
        CONFIG.Item.dataModels.status = StatusDataModel;

        // Register system settings
        game.settings.register(game.system.id, 'loggingLevel', {
            name: 'battlefield-system.Settings.LoggingLevel.Name',
            hint: 'battlefield-system.Settings.LoggingLevel.Hint',
            scope: 'client',
            config: true,
            default: 'LOG',
            type: String,
            choices: {
                NONE: 'battlefield-system.Settings.LoggingLevel.Choices.NONE',
                ERROR: 'battlefield-system.Settings.LoggingLevel.Choices.ERROR',
                WARN: 'battlefield-system.Settings.LoggingLevel.Choices.WARN',
                INFO: 'battlefield-system.Settings.LoggingLevel.Choices.INFO',
                LOG: 'battlefield-system.Settings.LoggingLevel.Choices.LOG',
                DEBUG: 'battlefield-system.Settings.LoggingLevel.Choices.DEBUG'
            }
        });

        // Register sheet application classes
        Actors.unregisterSheet('core', ActorSheet);
        Actors.registerSheet(game.system.id, ArmySheet, {
            makeDefault: true,
            types: ['army'],
            label: 'battlefield-system.Sheet.Army.Name'
        });
        Actors.registerSheet(game.system.id, StructureSheet, {
            makeDefault: true,
            types: ['structure'],
            label: 'battlefield-system.Sheet.Structure.Name'
        });

        // Helper functions for handlebars
        Handlebars.registerHelper('eq', (a, b) => a == b);
        Handlebars.registerHelper('add', (a, b) => a + b);

        // Load templates
        await loadTemplates([
            'systems/battlefield-system/templates/actor/army-sheet.hbs',
            'systems/battlefield-system/templates/actor/structure-sheet.hbs'
        ]);

        logger.log('Initialized successfully!');
        return true;
    } catch (err) {
        logger.error('Error during initialization:', err);
    }
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */
Hooks.once('ready', async function() {
    // Initialize the logger
    logger.initialize();
    logger.log('Ready!');
});