import { STICKY_PARAMETER_ID_NAMES } from './constants'
import { SaveGameInfo } from '/core/ui/save-load/model-save-load'

export type ScreenSaveLoadType = typeof Component & {
    Root: ComponentRoot
    loadSave: (saveGameInfo: SaveGameInfo, serverType: ServerType) => void
}

export type GameSettingName = (typeof STICKY_PARAMETER_ID_NAMES)[number]

export type GameSettings = {
    [key in GameSettingName]?: GameSettingValue
}

export type GameParameterInfo = {
    name: string
    value: GameSettingValue
}
