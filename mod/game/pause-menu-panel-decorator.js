import { STICKY_PARAMETER_IDS } from "../sticky-constants.js";


class PauseMenuPanelDecorator {
    constructor(panel) {
        this.panel = panel;
        this.Root = panel.Root;
        this.gameSettings = this.#loadGameSettings();
    }

    beforeAttach() {}
    
    // display details of chosen persistent game settings on pause panel
    afterAttach() {
        const gameInfo = this.Root.querySelector(".pause-menu__game-info");

        const ageInfo = document.createElement('p');
        const dangerInfo = document.createElement('p');
        const mapInfo = document.createElement('p');
        
        ageInfo.textContent = this.#localGameSettingName("AgeLength");
        mapInfo.textContent = [
            this.#localGameSettingName("MapSize"), 
            this.#localGameSettingName("Map")
        ].join(' | ');
        dangerInfo.textContent = [
            this.#localGameSettingName("DisasterIntensity"),
            `${Locale.compose('LOC_ADVANCED_OPTIONS_CRISIS')} ${this.gameSettings["CrisesEnabled"].value 
                ? Locale.compose('LOC_ADVANCED_OPTIONS_ON') 
                : Locale.compose('LOC_ADVANCED_OPTIONS_OFF')}`
        ].join(' | ');

        const infoClassName = 'pause-menu__game-info self-center font-body-base pointer-events-auto';
        ageInfo.className = infoClassName;
        dangerInfo.className = infoClassName;
        mapInfo.className = `${infoClassName} mb-2`;
        
        gameInfo.insertAdjacentHTML('beforebegin', ageInfo.outerHTML);
        gameInfo.insertAdjacentHTML('beforebegin', dangerInfo.outerHTML);
        gameInfo.insertAdjacentHTML('beforebegin', mapInfo.outerHTML);
    }
    
    beforeDetach() {}
    
    afterDetach() {}

    #localGameSettingName(name) {
        return Locale.compose(GameSetup.resolveString(this.gameSettings[name]?.name));
    }

    #loadGameSettings() {
        const parameters = GameSetup.getGameParameters();
        let settings = {}
        for (const [index, setupParam] of parameters.entries()) {
            if (STICKY_PARAMETER_IDS.includes(setupParam.ID)
            ) {   
                const parameterID = GameSetup.resolveString(setupParam.ID);
                settings[parameterID] = setupParam.value;
            }
        }

        return settings;
    }
}

Controls.decorate('screen-pause-menu', (panel) => new PauseMenuPanelDecorator(panel));