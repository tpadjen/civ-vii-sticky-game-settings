import { DataStore } from '../../data/types.js'
import { GameSettingName, GameSettings } from '../types.js'

export class GameSettingsStore {
    private dataStore: DataStore
    private settingsKey: string

    constructor(dataStore: DataStore, settingsKey = 'game-settings') {
        this.dataStore = dataStore
        this.settingsKey = settingsKey
    }

    readAndSet(parameterID: GameSettingName, value: GameSettingValue) {
        const newValue = this.load(parameterID) ?? value
        this.save(parameterID, newValue)
        return newValue
    }

    load(parameterID: GameSettingName) {
        const settings = this.#readGameSettings()
        return settings?.[parameterID] as GameSettingValue
    }

    save(parameterID: GameSettingName, value: GameSettingValue) {
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

    #readGameSettings(): GameSettings {
        return (this.dataStore.getItem(this.settingsKey) as GameSettings) ?? {}
    }

    #writeGameSettings(settings: GameSettings) {
        this.dataStore.setItem(this.settingsKey, settings)
    }
}
