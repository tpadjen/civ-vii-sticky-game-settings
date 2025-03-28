import { ScreenSaveLoadType } from '../types.js'
import { gameSetupHandler } from './sticky-game-settings.js'
import { SaveGameInfo } from '/core/ui/save-load/model-save-load.js'

function isConfigurationSave(saveGameInfo?: ExtendedSaveGameInfo) {
    return saveGameInfo?.path?.endsWith('Cfg')
}

class ScreenSaveLoadDecorator {
    panel: ScreenSaveLoadType
    Root: ComponentRoot

    constructor(panel: ScreenSaveLoadType) {
        this.panel = panel
        this.Root = panel.Root

        // disable the mod for the current shell session when the user loads a configuration save
        const proto = Object.getPrototypeOf(this.panel)
        const loadSave = proto.loadSave
        proto.loadSave = function (
            saveGameInfo: SaveGameInfo,
            serverType: ServerType
        ) {
            if (isConfigurationSave(saveGameInfo)) {
                gameSetupHandler.disable()
            }

            loadSave.apply(this, [saveGameInfo, serverType])
        }
    }

    beforeAttach() {}

    afterAttach() {}

    beforeDetach() {}

    afterDetach() {}

    onAttributeChanged(attribute: string, value: string) {}
}

Controls.decorate(
    'screen-save-load',
    (panel: Component) =>
        new ScreenSaveLoadDecorator(panel as unknown as ScreenSaveLoadType)
)
