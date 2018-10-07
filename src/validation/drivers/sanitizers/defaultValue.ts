export const defaultValue = <D>(defaultValue: D) => <I>(input?: I): I | D => {
    if (input === undefined) {
        return defaultValue
    }

    return input
}
