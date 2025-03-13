export function pp(...args) {
    console.error(...(args.map(arg => JSON.stringify(arg, null, 2))));
}