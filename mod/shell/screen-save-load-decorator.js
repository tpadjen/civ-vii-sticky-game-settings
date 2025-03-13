import { gameSetupHandler } from "./sticky-game-settings.js";

function isConfigurationSave(saveGameInfo) {
    return saveGameInfo?.path?.endsWith('Cfg');
}

class ScreenSaveLoadDecorator {
    constructor(panel) {
        this.panel = panel;
        this.Root = panel.Root;
        
        // disable the mod for the current shell session when the user loads a configuration save
        const proto = Object.getPrototypeOf(this.panel);
        const loadSave = proto.loadSave;
        proto.loadSave = function(saveGameInfo, serverType) {
            if (isConfigurationSave(saveGameInfo)) {
                gameSetupHandler.disable();
            }

            loadSave.apply(this, [saveGameInfo, serverType]);
        }
    }

    beforeAttach() {}
    
    afterAttach() {}
    
    beforeDetach() {}
    
    afterDetach() {}
}

Controls.decorate('screen-save-load', (panel) => new ScreenSaveLoadDecorator(panel));