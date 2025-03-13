export class JSONStore {

    static #LOCAL_STORAGE_KEY = "modSettings";
    
    constructor(namespace = 'default') {
        this.namespace = namespace;
    }

    setItem(key, value) {
        const store = this.#readStore();
        const namespaceStore = store[this.namespace] ?? {}; 
        const updated = {
            ...store,
            [this.namespace]: {
                ...namespaceStore,
                [key]: value
            }
        }
        this.#writeStore(updated);
    }

    getItem(key) {
        const store = this.#readStore();
        const namespaceStore = store[this.namespace] ?? {};
        return namespaceStore[key];
    }

    clear() {
        const store = this.#readStore();
        delete store[this.namespace];
        this.#writeStore(store);
    }

    #readStore() {
        return JSON.parse(localStorage.getItem(JSONStore.#LOCAL_STORAGE_KEY))
    }

    #writeStore(store) {
        localStorage.setItem(JSONStore.#LOCAL_STORAGE_KEY, JSON.stringify(store));
    }
}