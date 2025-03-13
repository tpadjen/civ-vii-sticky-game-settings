import { GameSettingsStore } from "../../api/game-settings/game-settings-store.js";
import { JSONStore } from "../../api/storage/json-store.js";
import { GameSetupHandler } from "./game-setup.js";


const gameSettingsStore = new GameSettingsStore(new JSONStore('sticky-game-settings'));
export const gameSetupHandler = new GameSetupHandler(gameSettingsStore);