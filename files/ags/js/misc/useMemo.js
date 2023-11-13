function memo() {
    const stack = {};
    return (callback, deps) => {
    /* Creating hashkey with dependencies + function source without whitespaces */
        const hash = deps.join('/') + '/' + callback.toString().replace(/\s+/g, '');

        if (!stack[hash])
            stack[hash] = callback();


        return stack[hash];
    };
}

export const useMemo = memo();
