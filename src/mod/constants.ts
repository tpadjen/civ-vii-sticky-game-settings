export const STICKY_PARAMETER_ID_NAMES = [
    'Difficulty',
    'GameSpeeds',
    'Map',
    'MapSize',
    'AgeLength',
    'DisasterIntensity',
    'CrisesEnabled',
    'StartPosition',
] as const

export const STICKY_PARAMETER_IDS = STICKY_PARAMETER_ID_NAMES.map((idName) =>
    GameSetup.makeString(idName)
)
