export class GameSettingsStore {

    constructor(dataStore, settingsKey = 'game-settings') {
        this.dataStore = dataStore;
    }

    readAndSet(parameterID, value) {
        const newValue = this.load(parameterID) ?? value;
        this.save(parameterID, newValue);
        return newValue;
    }

    load(parameterID) {
        const settings = this.#readGameSettings();
        return settings?.[parameterID];
    }

    save(parameterID, value) {
        const oldSettings = this.#readGameSettings();
        const newSettings = {
            ...oldSettings,
            [parameterID]: value
        };
            
        this.#writeGameSettings(newSettings);
    }

    all() {
        return this.#readGameSettings();
    }

    clear() {
        this.dataStore.setItem(this.settingsKey, undefined);
    }

    #readGameSettings() {
        return this.dataStore.getItem(this.settingsKey) ?? {};
    }

    #writeGameSettings(settings) {
        this.dataStore.setItem(this.settingsKey, settings);
    }
}