import { STICKY_PARAMETER_IDS } from '../constants.js'
import { GameParameterInfo, GameSettingName } from '../types.js'

class PauseMenuPanelDecorator {
    Root: ComponentRoot
    private gameParameters: Record<GameSettingName, GameParameterInfo>

    constructor(panel: Component) {
        this.Root = panel.Root
        this.gameParameters = this.#loadGameParameters()
    }

    beforeAttach() {}

    // display details of chosen persistent game settings on pause panel
    afterAttach() {
        const gameInfo = this.Root.querySelector('.pause-menu__game-info')

        const ageInfo = document.createElement('p')
        const dangerInfo = document.createElement('p')
        const mapInfo = document.createElement('p')

        ageInfo.textContent = [
            this.#localGameSettingName('AgeLength'),
            `${this.#localGameSettingName('StartPosition')} ${Locale.compose('LOC_DIPLOMACY_QUICK_START_PROJECT')}`,
        ].join(' | ')
        mapInfo.textContent = [
            this.#localGameSettingName('MapSize'),
            this.#localGameSettingName('Map'),
        ].join(' | ')
        dangerInfo.textContent = [
            this.#localGameSettingName('DisasterIntensity'),
            `${Locale.compose('LOC_ADVANCED_OPTIONS_CRISIS')} ${
                this.gameParameters['CrisesEnabled'].value
                    ? Locale.compose('LOC_ADVANCED_OPTIONS_ON')
                    : Locale.compose('LOC_ADVANCED_OPTIONS_OFF')
            }`,
        ].join(' | ')

        const infoClassName =
            'pause-menu__game-info self-center font-body-base pointer-events-auto'
        ageInfo.className = infoClassName
        dangerInfo.className = infoClassName
        mapInfo.className = `${infoClassName} mb-2`

        gameInfo.insertAdjacentHTML('beforebegin', ageInfo.outerHTML)
        gameInfo.insertAdjacentHTML('beforebegin', dangerInfo.outerHTML)
        gameInfo.insertAdjacentHTML('beforebegin', mapInfo.outerHTML)
    }

    beforeDetach() {}

    afterDetach() {}

    #localGameSettingName(name: GameSettingName) {
        return Locale.compose(
            GameSetup.resolveString(this.gameParameters[name]?.name)
        )
    }

    #loadGameParameters(): Record<GameSettingName, GameParameterInfo> {
        return GameSetup.getGameParameters()
            .filter((setupParam) =>
                STICKY_PARAMETER_IDS.includes(setupParam.ID)
            )
            .reduce(
                (acc, setupParam) => {
                    const parameterID = GameSetup.resolveString(setupParam.ID)
                    return {
                        ...acc,
                        [parameterID]: setupParam.value,
                    }
                },
                {} as Record<GameSettingName, GameParameterInfo>
            )
    }

    onAttributeChanged(attribute: string, value: string) {}
}

Controls.decorate(
    'screen-pause-menu',
    (panel: Component) => new PauseMenuPanelDecorator(panel)
)
