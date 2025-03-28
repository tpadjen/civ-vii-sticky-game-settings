import { GameSettingsStore } from 'mod/game-settings/game-settings-store.js'
import { GameSettingName } from 'mod/types.js'
import {
    STICKY_PARAMETER_ID_NAMES,
    STICKY_PARAMETER_IDS,
} from '../constants.js'

export class GameSetupHandler {
    private gameSettingsStore: GameSettingsStore
    proto: any
    getGameParameters: () => GameParameter[]
    setGameParameterValue: (id: string, value: GameSettingValue) => void
    setPlayerParameterValue: (
        id: number,
        parameterId: GameSettingName,
        value: GameSettingValue
    ) => void
    startCampaignListener: () => void
    private _isActive: boolean

    constructor(gameSettingsStore: GameSettingsStore) {
        this.gameSettingsStore = gameSettingsStore
        this.proto = Object.getPrototypeOf(GameSetup)
        this.getGameParameters = this.proto.getGameParameters
        this.setGameParameterValue = this.proto.setGameParameterValue
        this.setPlayerParameterValue = this.proto.setPlayerParameterValue

        this.startCampaignListener = this.deactivate.bind(this)
    }

    activate() {
        if (this._isActive) return

        this.readSavedParameters()
        this.interceptSetPlayerParameterValue()
        this.listenForGameParameterChanges()
        this._isActive = true
    }

    deactivate() {
        if (!this._isActive) return

        this.unwrapPrototype()
        window.removeEventListener('startCampaign', this.startCampaignListener)
        this._isActive = false
    }

    // load in the previously saved state, or else save the current one
    private readSavedParameters() {
        const parameters = GameSetup.getGameParameters()
        parameters.forEach((setupParam: GameParameter) => {
            if (STICKY_PARAMETER_IDS.includes(setupParam.ID)) {
                const parameterID = GameSetup.resolveString(
                    setupParam.ID
                ) as GameSettingName
                const value = this.gameSettingsStore.readAndSet(
                    parameterID,
                    setupParam.value.value
                )
                GameSetup.setGameParameterValue(parameterID, value)
            }
        })
    }

    private interceptSetPlayerParameterValue() {
        const handler = this
        this.proto.setPlayerParameterValue = function (
            id: number,
            parameterId: GameSettingName,
            value: GameSettingValue
        ) {
            handler.setPlayerParameterValue.apply(this, [
                id,
                parameterId,
                value,
            ])

            // only read in saved state the local player's game parameters
            if (id !== GameContext.localPlayerID) return

            // The normal game params are reset to defaults when
            // picking a leader or civ so replace them with saved
            // data when available
            handler.getGameParameters
                .apply(this)
                .filter((setupParam: GameParameter) =>
                    STICKY_PARAMETER_IDS.includes(setupParam.ID)
                )
                .forEach((setupParam: GameParameter) => {
                    const parameterID = GameSetup.resolveString(
                        setupParam.ID
                    ) as GameSettingName
                    const value = handler.gameSettingsStore.load(parameterID)
                    if (value !== undefined) {
                        handler.setGameParameterValue.call(
                            this,
                            parameterID,
                            value
                        )
                    }
                })
        }
    }

    private listenForGameParameterChanges() {
        const handler = this
        this.proto.setGameParameterValue = function (
            id: GameSettingName,
            value: GameSettingValue
        ) {
            if (STICKY_PARAMETER_ID_NAMES.includes(id)) {
                handler.gameSettingsStore.save(id, value)
            }
            handler.setGameParameterValue.apply(this, [id, value])
        }
    }

    private unwrapPrototype() {
        this.proto.getGameParameters = this.getGameParameters
        this.proto.setGameParameterValue = this.setGameParameterValue
        this.proto.setPlayerParameterValue = this.setPlayerParameterValue
    }
}
