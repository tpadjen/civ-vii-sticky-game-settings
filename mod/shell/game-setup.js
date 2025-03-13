import { STICKY_PARAMETER_ID_NAMES, STICKY_PARAMETER_IDS } from "../sticky-constants.js";


export class GameSetupHandler {

    constructor(gameSettingsStore) {
        this.gameSettingsStore = gameSettingsStore;
        this.proto = Object.getPrototypeOf(GameSetup);
        this.getGameParameters = this.proto.getGameParameters;
        this.setGameParameterValue = this.proto.setGameParameterValue;
        this.startCampaignListener = this.applySavedSettingsOneLastTime.bind(this)

        this.readSavedParameters(gameSettingsStore);
        this.interceptGetGameParameters();
        this.listenForGameParameterChanges();
        
        // overwrite params on game launch yet again because sometimes the 
        // settings still get overwritten despite all appearances in the ui
        window.addEventListener('startCampaign', this.startCampaignListener);
    }

    // load in the previously saved state, or else save the current one
    readSavedParameters() {
        const parameters = GameSetup.getGameParameters();
        for (const [index, setupParam] of parameters.entries()) {
            if (STICKY_PARAMETER_IDS.includes(setupParam.ID)
            ) {   
                const parameterID = GameSetup.resolveString(setupParam.ID);
                const value = this.gameSettingsStore.readAndSet(parameterID, setupParam.value.value);
                GameSetup.setGameParameterValue(parameterID, value);
            }
        }
    }

    // insert saved data into future getGameParameters results (GameSetup resets on 'revisions')
    interceptGetGameParameters() {
        const handler = this;
        this.proto.getGameParameters = function() {
            const parameters = handler.getGameParameters.apply(this);

            // replace the param values with saved data when available
            for (const [index, setupParam] of parameters.entries()) {
                if (STICKY_PARAMETER_IDS.includes(setupParam.ID)
                ) {   
                    const parameterID = GameSetup.resolveString(setupParam.ID);
                    const value = handler.gameSettingsStore.load(parameterID);
                    if (value !== undefined) {
                        parameters[index] = {
                            ...setupParam,
                            value: {
                                ...setupParam.value,
                                value
                            }
                        }
                    }
                }
            }

            return parameters;
        }
    }

    listenForGameParameterChanges() {
        const handler = this;
        this.proto.setGameParameterValue = function(id, value) {
            if (STICKY_PARAMETER_ID_NAMES.includes(id)) {
                handler.gameSettingsStore.save(id, value);
            }
            handler.setGameParameterValue.apply(this, [id, value]);
        }
    }

    applySavedSettingsOneLastTime() {
        this.unwrapPrototype();
        this.readSavedParameters(this.gameSettingsStore);
    }

    disable() {
        this.unwrapPrototype();
        window.removeEventListener('startCampaign', this.startCampaignListener);
    }

    unwrapPrototype() {
        this.proto.getGameParameters = this.getGameParameters;
        this.proto.setGameParameterValue = this.setGameParameterValue;
    }
}