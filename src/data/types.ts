export interface DataStore {
    getItem: (key: string) => JSONValue | undefined
    setItem: (key: string, value: JSONValue) => void
}

export type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue }
