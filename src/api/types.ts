export interface DataStore {
    getItem: (key: string) => any
    setItem: (key: string, value: any) => void
}

export type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue }
