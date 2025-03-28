import { JSONValue } from 'api/types'
import { STICKY_PARAMETER_IDS } from './constants'
import { SaveGameInfo } from '/core/ui/save-load/model-save-load'

export type ScreenSaveLoadType = typeof Component & {
    Root: ComponentRoot
    loadSave: (saveGameInfo: SaveGameInfo, serverType: ServerType) => void
}

export type GameSetting = {
    name: string
    value: JSONValue
}

export type GameSettings = {
    [key in (typeof STICKY_PARAMETER_IDS)[number]]: GameSetting
}
