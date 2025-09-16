# Battlefield System for Foundry VTT

A lightweight Foundry Virtual Tabletop system designed for managing battlefield encounters, including armies and structures/plots.

## Features

### Army Management
- Create and manage army units with unique tokens
- Track buff/debuff status effects
- Maintain a list of legendary heroes with equipment and growth traits
- Record elite regiment information

### Structure/Plot Management
- Create and manage battlefield structures and plots
- Track structure type, owner faction, and defense values
- Mark structures as capturable
- Record special effects and resource production

### Status Effects
- Add and remove status effects to both armies and structures
- Visual representation of active effects

## Installation

1. Ensure you have Foundry VTT v13 installed
2. Place the `battlefield-system` folder in your FoundryVTT `Data/systems` directory
3. Restart Foundry VTT
4. Select "Battlefield System" when creating a new world or changing the system of an existing world

## Usage

### Creating Army Actors
1. Click the "Create Actor" button in the Actors Directory
2. Select "Army" as the type
3. Fill in the army details including name, faction, and size
4. Add legendary heroes by clicking the "Add Hero" button in the Heroes tab
5. Manage status effects in the Status tab

### Creating Structure/Plot Actors
1. Click the "Create Actor" button in the Actors Directory
2. Select "Structure" as the type
3. Fill in the structure details including type, owner faction, and defense value
4. Mark the structure as capturable if applicable
5. Add special effects and resource production information
6. Manage status effects in the Status tab

### Token Setup
- Each army and structure can have its own unique token
- Drag and drop the actor onto the canvas to create a token
- Right-click on the token to access context menu options

## Data Structure

### Army Data
```
{
  name: "Army Name",
  type: "army",
  system: {
    faction: "Faction Name",
    size: 1000,
    description: "Army description",
    eliteRegiment: "Elite regiment information",
    heroes: [
      {
        id: "unique-id",
        name: "Hero Name",
        equipment: "Hero equipment",
        growthTraits: "Hero growth traits"
      }
    ],
    statusEffects: [
      {
        id: "unique-id",
        label: "Effect Name",
        icon: "icon-path.png"
      }
    ]
  }
}
```

### Structure Data
```
{
  name: "Structure Name",
  type: "structure",
  system: {
    structureType: "Structure Type",
    buildingType: "Building Type",
    description: "Structure description",
    ownerFaction: "Faction Name",
    defenseValue: 10,
    isCapturable: true,
    specialEffects: "Special effects description",
    resourceProduction: "Resource production information",
    statusEffects: [
      {
        id: "unique-id",
        label: "Effect Name",
        icon: "icon-path.png"
      }
    ]
  }
}
```

## Compatibility
- Foundry VTT v13

## License
This system is provided as-is under the MIT License.

## Support
For questions or issues, please contact the system developer.