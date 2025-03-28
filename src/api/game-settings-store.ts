import { DataStore, JSONValue } from './types.js'

export class GameSettingsStore {
    private dataStore: DataStore
    private settingsKey: string

    constructor(dataStore: DataStore, settingsKey = 'game-settings') {
        this.dataStore = dataStore
        this.settingsKey = settingsKey
    }

    readAndSet(parameterID: string, value: JSONValue) {
        const newValue = this.load(parameterID) ?? value
        this.save(parameterID, newValue)
        return newValue
    }

    load(parameterID: string) {
        const settings = this.#readGameSettings()
        return settings?.[parameterID]
    }

    save(parameterID: string, value: JSONValue) {
        const oldSettings = this.#readGameSettings()
        const newSettings = {
            ...oldSettings,
            [parameterID]: value,
        }

        this.#writeGameSettings(newSettings)
    }

    all() {
        return this.#readGameSettings()
    }

    clear() {
        this.dataStore.setItem(this.settingsKey, undefined)
    }

    #readGameSettings() {
        return this.dataStore.getItem(this.settingsKey) ?? {}
    }

    #writeGameSettings(settings: Record<string, JSONValue>) {
        this.dataStore.setItem(this.settingsKey, settings)
    }
}
