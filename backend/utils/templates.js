export const bugTemplates = [
    {
        type: "wrong_variable",
        difficulty: 1,
        generate: () => {
            const vars = ['count', 'total', 'index', 'limit', 'score', 'value'];
            const v1 = vars[Math.floor(Math.random() * vars.length)];
            let v2 = vars[Math.floor(Math.random() * vars.length)];
            while (v1 === v2) v2 = vars[Math.floor(Math.random() * vars.length)];

            const val = Math.floor(Math.random() * 10) + 1;

            return {
                title: "Variable Confusion",
                description: "The code is using the wrong variable. Fix the reference.",
                brokenCode: `let ${v1} = ${val};\nlet ${v2} = 0;\nconsole.log(${v2}); // Should print ${val}`,
                correctCode: `let ${v1} = ${val};\nlet ${v2} = 0;\nconsole.log(${v1}); // Should print ${val}`,
                hints: ["Check which variable holds the value you need.", "console.log is printing the wrong variable."]
            };
        }
    },
    {
        type: "off_by_one",
        difficulty: 2,
        generate: () => {
            const limit = Math.floor(Math.random() * 5) + 3;
            return {
                title: "Off By One Error",
                description: `The loop should run exactly ${limit} times (0 to ${limit - 1}).`,
                brokenCode: `for (let i = 0; i <= ${limit}; i++) {\n  console.log(i);\n}`,
                correctCode: `for (let i = 0; i < ${limit}; i++) {\n  console.log(i);\n}`,
                hints: ["Arrays and loops are usually 0-indexed.", "Check the loop condition operator."]
            };
        }
    },
    {
        type: "infinite_loop",
        difficulty: 2,
        generate: () => {
            return {
                title: "Infinite Loop",
                description: "The loop condition never becomes false.",
                brokenCode: `let i = 0;\nwhile (i < 5) {\n  console.log(i);\n  // Missing increment\n}`,
                correctCode: `let i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;\n}`,
                hints: ["The variable 'i' never changes.", "You need to increment 'i' inside the loop."]
            };
        }
    },
    {
        type: "condition_flip",
        difficulty: 1,
        generate: () => {
            const val = Math.floor(Math.random() * 100);
            return {
                title: "Broken Logic",
                description: "The if statement logic is inverted.",
                brokenCode: `let score = ${val};\nif (score > ${val + 10}) {\n  console.log("Win");\n} else {\n  console.log("Lose");\n} // Should be a Win logic`,
                correctCode: `let score = ${val};\nif (score < ${val + 10}) {\n  console.log("Win");\n} else {\n  console.log("Lose");\n}`,
                hints: ["Check the comparison operator.", "Is > correct or should it be < ?"]
            };
        }
    }
];
