export const match = patterns => defaultPattern => key =>
patterns.hasOwnProperty(key) ? patterns[key] : defaultPattern

const tryEvaluate = f => f instanceof Function ? f() : f    

export const matchF = patterns => defaultCase => key =>
    tryEvaluate(match (patterns) (defaultCase) (key))    