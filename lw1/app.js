function getTriangleTypeFromCommandLine() {
    const args = process.argv.slice(2).map(item => +item);
    let wasNotNumberValue = false;
    args.forEach(value => (isNaN(value) || value < 0) && (wasNotNumberValue = true));
    if (wasNotNumberValue) {
        return 'Got not number values as arguments';
    }
    if (args.length !== 3) {
        return 'Not a triangle';
    }
    const [a, b, c] = args;
    if ((a + b) <= c || (a + c) <= b || (c + b) <= a) {
        return 'Invalid triangle';
    }
    return getTriangleType(a, b, c);
}

function getTriangleType(a, b, c) {
    if (a === b && b === c) {
        return 'equilateral';
    }
    if (a === b || a === c || b === c) {
        return 'isosceles';
    }
    return 'default';
}

console.log(getTriangleTypeFromCommandLine());