// placeholder file — add code in small chunks
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Zone from "../models/Zone.js";
import BugChallenge from "../models/BugChallenge.js";

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learning-platform';
mongoose.connect(MONGODB_URI).then(() => {
  console.log("MongoDB connected");
});

async function seed() {
  await Zone.deleteMany({});
  await BugChallenge.deleteMany({});

  const basics = await Zone.create({
    name: "Basics World",
    description: "Fix simple beginner bugs.",
    order: 1,
    worldType: "basics",
    icon: "/icons/basics.png",
    isLockedByDefault: false
  });

  const loops = await Zone.create({
    name: "Loops World",
    description: "Fix loop-related bugs.",
    order: 2,
    worldType: "loops",
    icon: "/icons/loops.png",
    isLockedByDefault: true
  });

  const arrays = await Zone.create({
    name: "Arrays World",
    description: "Master array manipulation bugs.",
    order: 3,
    worldType: "arrays",
    icon: "/icons/arrays.png",
    isLockedByDefault: true
  });

  const functions = await Zone.create({
    name: "Functions World",
    description: "Debug function-related issues.",
    order: 4,
    worldType: "functions",
    icon: "/icons/functions.png",
    isLockedByDefault: true
  });

  const objects = await Zone.create({
    name: "Objects World",
    description: "Fix object property bugs.",
    order: 5,
    worldType: "oop",
    icon: "/icons/objects.png",
    isLockedByDefault: true
  });

  // ========== BASICS WORLD ==========
  await BugChallenge.create({
    zoneId: basics._id,
    title: "Wrong Variable Name",
    description: "Fix the incorrect variable used in console.log.",
    brokenCode: "let x = 5; console.log(y);",
    correctCode: "let x = 5; console.log(x);",
    xpReward: 10,
    difficulty: "easy",
    order: 1,
    bugType: "wrong-variable",
    category: "syntax"
  });

  await BugChallenge.create({
    zoneId: basics._id,
    title: "Broken String",
    description: "Fix the string concatenation error.",
    brokenCode: "let name = \"Alice\"; console.log(\"Hello \" + nam);",
    correctCode: "let name = \"Alice\"; console.log(\"Hello \" + name);",
    xpReward: 15,
    difficulty: "easy",
    order: 2,
    bugType: "typo",
    category: "syntax"
  });

  await BugChallenge.create({
    zoneId: basics._id,
    title: "Syntax Terror Boss",
    description: "BOSS BATTLE: Fix multiple syntax errors to defeat the boss!",
    brokenCode: "function greet(name) {\n  return \"Hello \" + name\n}\nconsole.log(greet(\"World\"))",
    correctCode: "function greet(name) {\n  return \"Hello \" + name;\n}\nconsole.log(greet(\"World\"));",
    xpReward: 50,
    boss: true,
    difficulty: "medium",
    order: 3,
    bugType: "syntax-chaos",
    category: "syntax"
  });

  // ========== LOOPS WORLD ==========
  await BugChallenge.create({
    zoneId: loops._id,
    title: "Off-by-One Error",
    description: "Fix the loop boundary error.",
    brokenCode: "for(let i=0; i<=5; i++){ console.log(i); }",
    correctCode: "for(let i=0; i<5; i++){ console.log(i); }",
    xpReward: 20,
    difficulty: "medium",
    order: 1,
    bugType: "off-by-one",
    category: "logic"
  });

  await BugChallenge.create({
    zoneId: loops._id,
    title: "Infinite Loop",
    description: "Fix the loop that never ends.",
    brokenCode: "let i = 0;\nwhile(i < 5) {\n  console.log(i);\n}",
    correctCode: "let i = 0;\nwhile(i < 5) {\n  console.log(i);\n  i++;\n}",
    xpReward: 25,
    difficulty: "medium",
    order: 2,
    bugType: "infinite-loop",
    category: "logic"
  });

  await BugChallenge.create({
    zoneId: loops._id,
    title: "Loop Master Boss",
    description: "BOSS BATTLE: Fix the nested loop bug!",
    brokenCode: "for(let i=0; i<3; i++){\n  for(let j=0; j<3; i++){\n    console.log(i,j);\n  }\n}",
    correctCode: "for(let i=0; i<3; i++){\n  for(let j=0; j<3; j++){\n    console.log(i,j);\n  }\n}",
    xpReward: 60,
    boss: true,
    difficulty: "hard",
    order: 3,
    bugType: "nested-loop-bug",
    category: "logic"
  });

  // ========== ARRAYS WORLD ==========
  await BugChallenge.create({
    zoneId: arrays._id,
    title: "Array Index Error",
    description: "Fix the array access bug.",
    brokenCode: "let arr = [1,2,3];\nconsole.log(arr[3]);",
    correctCode: "let arr = [1,2,3];\nconsole.log(arr[2]);",
    xpReward: 25,
    difficulty: "easy",
    order: 1,
    bugType: "index-error",
    category: "logic"
  });

  await BugChallenge.create({
    zoneId: arrays._id,
    title: "Push vs Concat",
    description: "Fix the array method bug.",
    brokenCode: "let arr = [1,2];\narr.concat(3);\nconsole.log(arr);",
    correctCode: "let arr = [1,2];\narr.push(3);\nconsole.log(arr);",
    xpReward: 30,
    difficulty: "medium",
    order: 2,
    bugType: "wrong-method",
    category: "logic"
  });

  await BugChallenge.create({
    zoneId: arrays._id,
    title: "Array Destroyer Boss",
    description: "BOSS BATTLE: Fix the array manipulation chaos!",
    brokenCode: "let nums = [1,2,3,4,5];\nlet doubled = nums.map(n => n * 2)\nconsole.log(doubled)",
    correctCode: "let nums = [1,2,3,4,5];\nlet doubled = nums.map(n => n * 2);\nconsole.log(doubled);",
    xpReward: 70,
    boss: true,
    difficulty: "hard",
    order: 3,
    bugType: "array-chaos",
    category: "syntax"
  });

  // ========== FUNCTIONS WORLD ==========
  await BugChallenge.create({
    zoneId: functions._id,
    title: "Missing Return",
    description: "Fix the function that doesn't return.",
    brokenCode: "function add(a, b) {\n  a + b;\n}\nconsole.log(add(2,3));",
    correctCode: "function add(a, b) {\n  return a + b;\n}\nconsole.log(add(2,3));",
    xpReward: 30,
    difficulty: "easy",
    order: 1,
    bugType: "missing-return",
    category: "logic"
  });

  await BugChallenge.create({
    zoneId: functions._id,
    title: "Wrong Parameter",
    description: "Fix the parameter mismatch.",
    brokenCode: "function multiply(x, y) {\n  return x * z;\n}\nconsole.log(multiply(3,4));",
    correctCode: "function multiply(x, y) {\n  return x * y;\n}\nconsole.log(multiply(3,4));",
    xpReward: 35,
    difficulty: "medium",
    order: 2,
    bugType: "wrong-parameter",
    category: "logic"
  });

  await BugChallenge.create({
    zoneId: functions._id,
    title: "Function Overlord Boss",
    description: "BOSS BATTLE: Fix the callback nightmare!",
    brokenCode: "function process(arr, callback) {\n  return arr.map(callback)\n}\nlet result = process([1,2,3], x => x * 2)\nconsole.log(result)",
    correctCode: "function process(arr, callback) {\n  return arr.map(callback);\n}\nlet result = process([1,2,3], x => x * 2);\nconsole.log(result);",
    xpReward: 80,
    boss: true,
    difficulty: "hard",
    order: 3,
    bugType: "callback-bug",
    category: "syntax"
  });

  // ========== OBJECTS WORLD ==========
  await BugChallenge.create({
    zoneId: objects._id,
    title: "Missing Property",
    description: "Fix the undefined property access.",
    brokenCode: "let user = {name: 'John'};\nconsole.log(user.age);",
    correctCode: "let user = {name: 'John', age: 25};\nconsole.log(user.age);",
    xpReward: 35,
    difficulty: "easy",
    order: 1,
    bugType: "undefined-property",
    category: "runtime"
  });

  await BugChallenge.create({
    zoneId: objects._id,
    title: "Dot vs Bracket",
    description: "Fix the property access method.",
    brokenCode: "let obj = {'user-name': 'Alice'};\nconsole.log(obj.user-name);",
    correctCode: "let obj = {'user-name': 'Alice'};\nconsole.log(obj['user-name']);",
    xpReward: 40,
    difficulty: "medium",
    order: 2,
    bugType: "property-access",
    category: "syntax"
  });

  await BugChallenge.create({
    zoneId: objects._id,
    title: "Object Titan Boss",
    description: "BOSS BATTLE: Master object destructuring!",
    brokenCode: "let person = {name: 'Bob', age: 30}\nlet {name, city} = person\nconsole.log(name, city)",
    correctCode: "let person = {name: 'Bob', age: 30, city: 'NYC'};\nlet {name, city} = person;\nconsole.log(name, city);",
    xpReward: 100,
    boss: true,
    difficulty: "expert",
    order: 3,
    bugType: "destructuring-bug",
    category: "syntax"
  });

  console.log("Bug Game expanded with 5 zones and 18 challenges!");
  process.exit();
}
seed();
