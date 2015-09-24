# How to make your own game with this

This document explains how to create your own game.

## Configure the server

Open ./configuration.json and set the basic definitions for the server.

* Define the connection port the clients will connect at
* Activate all modules your game would need from the server (delete the rest from activeModules)
* Define the directories you will place your game modules and data in
* Optional: Define successors and set configuration for respective modules

## Create a new directory for your game

Your game modules and actions are located in a directory of your choice. Note that you defined the name of this directory in the configuration above.

## Create your data model

### Define your components

The server handles game data as small collections of data elements called components. Each component represents a capability of an object that inherits this component. An example component could be "CanMove" while the properties within the component might describe how the object can move (speed, vector etc.).

Try to be as atomic as possible when creating your components, meaning that components should be meaningful but only contain a limited amount of properties within them.

Add components as individual .json files inside the /data/components folder and they will be automatically loaded.

### Define your assemblages

Assemblages act as templates for objects, aggregating a number of components into logical types. An example would be the type "tank", which might contain the components "CanMove", "HasArmor", "CanAttack" and so on.

Note that components can only attached once to assemblages. While you could actually add the same component multiple times to the assemblage array, it will be only added once.

## Define data for your game

TBD

## Create actions for your game

TBD

## Run the server

TBD
