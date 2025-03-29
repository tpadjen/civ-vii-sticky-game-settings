import { JSONStore } from '../../data/json-store.js'
import { GameSettingsStore } from '../game-settings/game-settings-store.js'
import { GameSetupHandler } from './game-setup.js'

const gameSettingsStore = new GameSettingsStore(
    new JSONStore('sticky-game-settings')
)
export const gameSetupHandler = new GameSetupHandler(gameSettingsStore)

function init() {
    const inAgeTransition =
        Modding.getTransitionInProgress() == TransitionType.Age
    if (inAgeTransition) {
        return
    }

    gameSetupHandler.activate()
}

Loading.runWhenFinished(init)
