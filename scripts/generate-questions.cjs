const fs = require('fs');

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const quizData = [
  { q: "What does CPU stand for?", a: "Central Processing Unit", w: ["Central Process Unit", "Computer Personal Unit", "Central Processor Unit"] },
  { q: "Which data structure uses LIFO?", a: "Stack", w: ["Queue", "Tree", "Graph"] },
  { q: "What is the time complexity of binary search?", a: "O(log n)", w: ["O(n)", "O(n log n)", "O(1)"] },
  { q: "Which protocol is used for secure communication over the internet?", a: "HTTPS", w: ["HTTP", "FTP", "SSH"] },
  { q: "What is the main function of an operating system?", a: "Managing hardware and software resources", w: ["Compiling code", "Browsing the internet", "Creating databases"] },
  { q: "What does HTML stand for?", a: "Hyper Text Markup Language", w: ["High Text Markup Language", "Hyper Tabular Markup Language", "None of these"] },
  { q: "Which language is primarily used for web styling?", a: "CSS", w: ["HTML", "JavaScript", "Python"] },
  { q: "What is the output of typeof null in JavaScript?", a: "object", w: ["null", "undefined", "number"] },
  { q: "Which database is a NoSQL database?", a: "MongoDB", w: ["MySQL", "PostgreSQL", "Oracle"] },
  { q: "What does SQL stand for?", a: "Structured Query Language", w: ["Strong Question Language", "Structured Question Language", "Simple Query Language"] },
  { q: "What is the default port for HTTP?", a: "80", w: ["443", "8080", "21"] },
  { q: "Which HTTP method is used to update data?", a: "PUT", w: ["GET", "POST", "DELETE"] },
  { q: "What is the purpose of a load balancer?", a: "Distributing network traffic", w: ["Storing data", "Encrypting passwords", "Compiling code"] },
  { q: "What is a primary key?", a: "A unique identifier for a database record", w: ["A foreign key", "A password", "An index"] },
  { q: "What does API stand for?", a: "Application Programming Interface", w: ["Applied Programming Interface", "Application Process Interface", "Automated Programming Interface"] },
  { q: "Which sorting algorithm has the worst-case time complexity of O(n^2)?", a: "Bubble Sort", w: ["Merge Sort", "Heap Sort", "Radix Sort"] },
  { q: "What is a closure in JavaScript?", a: "A function bundled with its lexical environment", w: ["A block of code", "A loop", "A variable"] },
  { q: "What is the difference between == and === in JavaScript?", a: "=== checks for type and value", w: ["== checks for type and value", "They are the same", "=== is used for assignment"] },
  { q: "What does CSS stand for?", a: "Cascading Style Sheets", w: ["Computer Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"] },
  { q: "What is the DOM?", a: "Document Object Model", w: ["Data Object Model", "Document Oriented Model", "Data Oriented Model"] },
  { q: "What is the purpose of Docker?", a: "Containerization", w: ["Virtualization", "Compilation", "Encryption"] },
  { q: "What is Kubernetes used for?", a: "Container orchestration", w: ["Database management", "Version control", "Web hosting"] },
  { q: "What is a microservice?", a: "An architectural style that structures an application as a collection of loosely coupled services", w: ["A small server", "A tiny database", "A short function"] },
  { q: "What is the difference between TCP and UDP?", a: "TCP is connection-oriented, UDP is connectionless", w: ["TCP is faster", "UDP is more reliable", "They are the same"] },
  { q: "What is DNS?", a: "Domain Name System", w: ["Data Name System", "Domain Network System", "Data Network System"] },
  { q: "What is a firewall?", a: "A network security system", w: ["A physical wall", "A virus", "A database"] },
  { q: "What is the OSI model?", a: "A conceptual model that characterizes and standardizes the communication functions of a telecommunication or computing system", w: ["A database model", "A programming paradigm", "A network protocol"] },
  { q: "What is a MAC address?", a: "A unique identifier assigned to a network interface controller", w: ["An IP address", "A memory address", "A web address"] },
  { q: "What is an IP address?", a: "A numerical label assigned to each device connected to a computer network", w: ["A physical address", "A memory address", "A web address"] },
  { q: "What is a subnet mask?", a: "A 32-bit number that masks an IP address", w: ["A network protocol", "A firewall rule", "A routing table"] }
];

const logoData = [
  { q: "Identify this logo:", img: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg", a: "React", w: ["Angular", "Vue", "Svelte"] },
  { q: "Identify this logo:", img: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg", a: "Python", w: ["Java", "C++", "Ruby"] },
  { q: "Identify this logo:", img: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg", a: "Docker", w: ["Kubernetes", "Jenkins", "Git"] },
  { q: "Identify this logo:", img: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg", a: "Git", w: ["GitHub", "GitLab", "Bitbucket"] },
  { q: "Identify this logo:", img: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg", a: "Linux", w: ["Windows", "macOS", "Android"] },
  { q: "Identify this logo:", img: "https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg", a: "JavaScript", w: ["TypeScript", "CoffeeScript", "Dart"] },
  { q: "Identify this logo:", img: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg", a: "Tailwind CSS", w: ["Bootstrap", "Bulma", "Foundation"] },
  { q: "Identify this logo:", img: "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg", a: "PHP", w: ["Perl", "Python", "Ruby"] },
  { q: "Identify this logo:", img: "https://upload.wikimedia.org/wikipedia/commons/7/73/Ruby_logo.svg", a: "Ruby", w: ["Rails", "Sinatra", "Crystal"] },
  { q: "Identify this logo:", img: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg", a: "C++", w: ["C", "C#", "Objective-C"] }
];

const debugData = [
  { q: "Why does this JavaScript code return undefined?", code: "function getObj() {\n  return \n  {\n    key: 'value'\n  };\n}", a: "ASI (Automatic Semicolon Insertion)", w: ["Syntax Error", "Reference Error", "Type Error"] },
  { q: "What is the bug in this C++ code?", code: "int arr[5] = {1, 2, 3, 4, 5};\nfor (int i = 0; i <= 5; i++) {\n  cout << arr[i];\n}", a: "Array out of bounds", w: ["Syntax error", "Infinite loop", "Compilation error"] },
  { q: "What is the issue with this Python function?", code: "def append_to_list(val, my_list=[]):\n    my_list.append(val)\n    return my_list", a: "Mutable default argument", w: ["Syntax error", "Indentation error", "Type error"] },
  { q: "What is wrong with this SQL query?", code: "SELECT * FROM users WHERE age = NULL;", a: "Should use IS NULL", w: ["Syntax error", "Table doesn't exist", "Type mismatch"] },
  { q: "What is the issue in this Java code?", code: "String s1 = new String('hello');\nString s2 = new String('hello');\nif (s1 == s2) {\n    System.out.println('Equal');\n}", a: "Compares object references instead of values", w: ["Syntax error", "Null pointer exception", "Compilation error"] },
  { q: "What is the error in this React component?", code: "function Counter() {\n  let count = 0;\n  return <button onClick={() => count++}>{count}</button>;\n}", a: "State is not managed with useState", w: ["Syntax error", "Missing return statement", "Invalid JSX"] },
  { q: "Why does this promise chain fail to catch the error?", code: "Promise.resolve().then(() => {\n  throw new Error('fail');\n});\n.catch(e => console.log(e));", a: "Semicolon terminates the statement before .catch", w: ["Promise is already resolved", "Syntax error", "Error is not thrown correctly"] },
  { q: "What is the problem with this CSS?", code: ".box {\n  width: 100%;\n  padding: 20px;\n}", a: "Width exceeds 100% due to box-sizing", w: ["Syntax error", "Invalid property", "Missing unit"] },
  { q: "Why does this Go code not compile?", code: "package main\nimport 'fmt'\nfunc main() {\n  x := 5\n}", a: "Unused variable x", w: ["Syntax error", "Missing return", "Invalid import"] },
  { q: "What is the issue with this regex?", code: "const regex = /^[a-z]+$/;\nregex.test('Hello');", a: "Case sensitive, fails on uppercase", w: ["Syntax error", "Invalid characters", "Missing flags"] },
  { q: "Why does this Node.js server crash?", code: "const http = require('http');\nhttp.createServer((req, res) => {\n  res.send('Hello');\n}).listen(3000);", a: "res.send is not a standard http method (it's Express)", w: ["Syntax error", "Port is in use", "Missing require"] },
  { q: "What is the bug in this sorting function?", code: "const arr = [10, 2, 5, 1];\narr.sort();", a: "Sorts alphabetically by default", w: ["Syntax error", "Invalid array", "Missing arguments"] },
  { q: "Why does this loop run infinitely?", code: "for (let i = 0; i < 10; i--) {\n  console.log(i);\n}", a: "Decrementing i instead of incrementing", w: ["Syntax error", "Condition is always true", "Missing block"] },
  { q: "What is the issue with this JSON?", code: "{ 'name': 'John', 'age': 30 }", a: "Keys must be enclosed in double quotes", w: ["Syntax error", "Missing comma", "Invalid types"] },
  { q: "Why does this event listener trigger multiple times?", code: "function setup() {\n  document.getElementById('btn').addEventListener('click', () => {\n    console.log('Clicked');\n  });\n}\nsetup();\nsetup();", a: "Listener is added multiple times", w: ["Syntax error", "Invalid element", "Missing event object"] }
];

const optimizationData = [
  { q: "Which algorithm design paradigm solves a problem by breaking it into overlapping subproblems and storing the results?", a: "Dynamic Programming" },
  { q: "What technique is used to optimize recursive functions by caching previously computed results?", a: "Memoization" },
  { q: "Which data structure provides O(1) average time complexity for lookups?", a: "Hash Table" },
  { q: "What is the process of reducing the size of a file or data stream?", a: "Compression" },
  { q: "Which sorting algorithm is generally considered the fastest for large, random datasets in practice?", a: "Quick Sort" },
  { q: "What technique involves pre-allocating a fixed number of resources (like database connections) to be reused?", a: "Connection Pooling" },
  { q: "What is the term for loading only the necessary data or code when it is actually needed?", a: "Lazy Loading" },
  { q: "Which indexing structure is most commonly used in relational databases for fast range queries?", a: "B-Tree" },
  { q: "What technique distributes network traffic across multiple servers to ensure no single server bears too much demand?", a: "Load Balancing" },
  { q: "What is the process of storing frequently accessed data in a fast, temporary storage layer?", a: "Caching" }
];

const allQuestions = [
  ...quizData.map(item => ({ roundId: 'quiz', question: item.q, options: shuffleArray([item.a, ...item.w]), correctAnswer: item.a })),
  ...logoData.map(item => ({ roundId: 'logo', question: item.q, imageUrl: item.img, options: shuffleArray([item.a, ...item.w]), correctAnswer: item.a })),
  ...debugData.map(item => ({ roundId: 'debug', question: item.q, codeSnippet: item.code, options: shuffleArray([item.a, ...item.w]), correctAnswer: item.a })),
  ...optimizationData.map(item => ({ roundId: 'optimization', question: item.q, options: [], correctAnswer: item.a }))
];

const seedContent = `import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const csQuestions = ${JSON.stringify(allQuestions, null, 2)};

async function seed() {
  try {
    console.log('Deleting existing questions...');
    const snapshot = await getDocs(collection(db, 'questions'));
    console.log(\`Found \${snapshot.docs.length} existing questions.\`);
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
    }
    
    console.log('Adding new CS questions...');
    for (const q of csQuestions) {
      await addDoc(collection(db, 'questions'), q);
    }
    console.log('Successfully seeded questions!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding questions:', error);
    process.exit(1);
  }
}

seed();
`;

fs.writeFileSync('scripts/seed.ts', seedContent);
console.log('seed.ts generated successfully');
