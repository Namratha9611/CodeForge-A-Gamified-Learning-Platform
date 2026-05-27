export function mutateCode(correctCode, type) {
    // A simple mutator that can reverse common operators
    // In a full implementation, this would parse the AST.
    // Here we use regex for simplicity and speed.

    let broken = correctCode;
    let description = "Fix the code.";

    if (type === 'operator') {
        if (broken.includes('===')) {
            broken = broken.replace('===', '=');
            description = "Fix the assignment/equality operator.";
        } else if (broken.includes('<')) {
            broken = broken.replace('<', '>');
            description = "Fix the comparison logic.";
        }
    } else if (type === 'semicolon') {
        broken = broken.replace(/;/g, '');
        description = "Missing semicolons can be dangerous.";
    }

    return { broken, description };
}
