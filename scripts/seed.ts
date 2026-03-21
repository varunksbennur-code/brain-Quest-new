import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const csQuestions = [
  {
    "roundId": "quiz",
    "question": "What does CPU stand for?",
    "options": [
      "Computer Personal Unit",
      "Central Processing Unit",
      "Central Process Unit",
      "Central Processor Unit"
    ],
    "correctAnswer": "Central Processing Unit"
  },
  {
    "roundId": "quiz",
    "question": "Which data structure uses LIFO?",
    "options": [
      "Graph",
      "Stack",
      "Queue",
      "Tree"
    ],
    "correctAnswer": "Stack"
  },
  {
    "roundId": "quiz",
    "question": "What is the time complexity of binary search?",
    "options": [
      "O(log n)",
      "O(1)",
      "O(n log n)",
      "O(n)"
    ],
    "correctAnswer": "O(log n)"
  },
  {
    "roundId": "quiz",
    "question": "Which protocol is used for secure communication over the internet?",
    "options": [
      "SSH",
      "HTTPS",
      "HTTP",
      "FTP"
    ],
    "correctAnswer": "HTTPS"
  },
  {
    "roundId": "quiz",
    "question": "What is the main function of an operating system?",
    "options": [
      "Creating databases",
      "Compiling code",
      "Browsing the internet",
      "Managing hardware and software resources"
    ],
    "correctAnswer": "Managing hardware and software resources"
  },
  {
    "roundId": "quiz",
    "question": "What does HTML stand for?",
    "options": [
      "Hyper Tabular Markup Language",
      "Hyper Text Markup Language",
      "None of these",
      "High Text Markup Language"
    ],
    "correctAnswer": "Hyper Text Markup Language"
  },
  {
    "roundId": "quiz",
    "question": "Which language is primarily used for web styling?",
    "options": [
      "Python",
      "HTML",
      "JavaScript",
      "CSS"
    ],
    "correctAnswer": "CSS"
  },
  {
    "roundId": "quiz",
    "question": "What is the output of typeof null in JavaScript?",
    "options": [
      "object",
      "number",
      "null",
      "undefined"
    ],
    "correctAnswer": "object"
  },
  {
    "roundId": "quiz",
    "question": "Which database is a NoSQL database?",
    "options": [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Oracle"
    ],
    "correctAnswer": "MongoDB"
  },
  {
    "roundId": "quiz",
    "question": "What does SQL stand for?",
    "options": [
      "Structured Question Language",
      "Strong Question Language",
      "Structured Query Language",
      "Simple Query Language"
    ],
    "correctAnswer": "Structured Query Language"
  },
  {
    "roundId": "quiz",
    "question": "What is the default port for HTTP?",
    "options": [
      "21",
      "8080",
      "80",
      "443"
    ],
    "correctAnswer": "80"
  },
  {
    "roundId": "quiz",
    "question": "Which HTTP method is used to update data?",
    "options": [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],
    "correctAnswer": "PUT"
  },
  {
    "roundId": "quiz",
    "question": "What is the purpose of a load balancer?",
    "options": [
      "Storing data",
      "Encrypting passwords",
      "Compiling code",
      "Distributing network traffic"
    ],
    "correctAnswer": "Distributing network traffic"
  },
  {
    "roundId": "quiz",
    "question": "What is a primary key?",
    "options": [
      "A unique identifier for a database record",
      "A foreign key",
      "An index",
      "A password"
    ],
    "correctAnswer": "A unique identifier for a database record"
  },
  {
    "roundId": "quiz",
    "question": "What does API stand for?",
    "options": [
      "Application Programming Interface",
      "Applied Programming Interface",
      "Application Process Interface",
      "Automated Programming Interface"
    ],
    "correctAnswer": "Application Programming Interface"
  },
  {
    "roundId": "quiz",
    "question": "Which sorting algorithm has the worst-case time complexity of O(n^2)?",
    "options": [
      "Merge Sort",
      "Bubble Sort",
      "Heap Sort",
      "Radix Sort"
    ],
    "correctAnswer": "Bubble Sort"
  },
  {
    "roundId": "quiz",
    "question": "What is a closure in JavaScript?",
    "options": [
      "A variable",
      "A loop",
      "A function bundled with its lexical environment",
      "A block of code"
    ],
    "correctAnswer": "A function bundled with its lexical environment"
  },
  {
    "roundId": "quiz",
    "question": "What is the difference between == and === in JavaScript?",
    "options": [
      "=== is used for assignment",
      "=== checks for type and value",
      "== checks for type and value",
      "They are the same"
    ],
    "correctAnswer": "=== checks for type and value"
  },
  {
    "roundId": "quiz",
    "question": "What does CSS stand for?",
    "options": [
      "Cascading Style Sheets",
      "Creative Style Sheets",
      "Colorful Style Sheets",
      "Computer Style Sheets"
    ],
    "correctAnswer": "Cascading Style Sheets"
  },
  {
    "roundId": "quiz",
    "question": "What is the DOM?",
    "options": [
      "Data Oriented Model",
      "Document Oriented Model",
      "Data Object Model",
      "Document Object Model"
    ],
    "correctAnswer": "Document Object Model"
  },
  {
    "roundId": "quiz",
    "question": "What is the purpose of Docker?",
    "options": [
      "Containerization",
      "Virtualization",
      "Compilation",
      "Encryption"
    ],
    "correctAnswer": "Containerization"
  },
  {
    "roundId": "quiz",
    "question": "What is Kubernetes used for?",
    "options": [
      "Web hosting",
      "Version control",
      "Database management",
      "Container orchestration"
    ],
    "correctAnswer": "Container orchestration"
  },
  {
    "roundId": "quiz",
    "question": "What is a microservice?",
    "options": [
      "A tiny database",
      "An architectural style that structures an application as a collection of loosely coupled services",
      "A small server",
      "A short function"
    ],
    "correctAnswer": "An architectural style that structures an application as a collection of loosely coupled services"
  },
  {
    "roundId": "quiz",
    "question": "What is the difference between TCP and UDP?",
    "options": [
      "TCP is faster",
      "TCP is connection-oriented, UDP is connectionless",
      "They are the same",
      "UDP is more reliable"
    ],
    "correctAnswer": "TCP is connection-oriented, UDP is connectionless"
  },
  {
    "roundId": "quiz",
    "question": "What is DNS?",
    "options": [
      "Domain Network System",
      "Data Network System",
      "Domain Name System",
      "Data Name System"
    ],
    "correctAnswer": "Domain Name System"
  },
  {
    "roundId": "quiz",
    "question": "What is a firewall?",
    "options": [
      "A physical wall",
      "A virus",
      "A database",
      "A network security system"
    ],
    "correctAnswer": "A network security system"
  },
  {
    "roundId": "quiz",
    "question": "What is the OSI model?",
    "options": [
      "A database model",
      "A network protocol",
      "A programming paradigm",
      "A conceptual model that characterizes and standardizes the communication functions of a telecommunication or computing system"
    ],
    "correctAnswer": "A conceptual model that characterizes and standardizes the communication functions of a telecommunication or computing system"
  },
  {
    "roundId": "quiz",
    "question": "What is a MAC address?",
    "options": [
      "A memory address",
      "A unique identifier assigned to a network interface controller",
      "An IP address",
      "A web address"
    ],
    "correctAnswer": "A unique identifier assigned to a network interface controller"
  },
  {
    "roundId": "quiz",
    "question": "What is an IP address?",
    "options": [
      "A physical address",
      "A memory address",
      "A numerical label assigned to each device connected to a computer network",
      "A web address"
    ],
    "correctAnswer": "A numerical label assigned to each device connected to a computer network"
  },
  {
    "roundId": "quiz",
    "question": "What is a subnet mask?",
    "options": [
      "A firewall rule",
      "A routing table",
      "A 32-bit number that masks an IP address",
      "A network protocol"
    ],
    "correctAnswer": "A 32-bit number that masks an IP address"
  },
  {
    "roundId": "logo",
    "question": "Identify this logo:",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    "options": [
      "React",
      "Svelte",
      "Vue",
      "Angular"
    ],
    "correctAnswer": "React"
  },
  {
    "roundId": "logo",
    "question": "Identify this logo:",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
    "options": [
      "Java",
      "C++",
      "Ruby",
      "Python"
    ],
    "correctAnswer": "Python"
  },
  {
    "roundId": "logo",
    "question": "Identify this logo:",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg",
    "options": [
      "Git",
      "Docker",
      "Kubernetes",
      "Jenkins"
    ],
    "correctAnswer": "Docker"
  },
  {
    "roundId": "logo",
    "question": "Identify this logo:",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg",
    "options": [
      "GitHub",
      "Git",
      "Bitbucket",
      "GitLab"
    ],
    "correctAnswer": "Git"
  },
  {
    "roundId": "logo",
    "question": "Identify this logo:",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg",
    "options": [
      "Linux",
      "Android",
      "macOS",
      "Windows"
    ],
    "correctAnswer": "Linux"
  },
  {
    "roundId": "logo",
    "question": "Identify this logo:",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg",
    "options": [
      "TypeScript",
      "CoffeeScript",
      "JavaScript",
      "Dart"
    ],
    "correctAnswer": "JavaScript"
  },
  {
    "roundId": "logo",
    "question": "Identify this logo:",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
    "options": [
      "Bulma",
      "Tailwind CSS",
      "Foundation",
      "Bootstrap"
    ],
    "correctAnswer": "Tailwind CSS"
  },
  {
    "roundId": "logo",
    "question": "Identify this logo:",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg",
    "options": [
      "PHP",
      "Perl",
      "Ruby",
      "Python"
    ],
    "correctAnswer": "PHP"
  },
  {
    "roundId": "logo",
    "question": "Identify this logo:",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/73/Ruby_logo.svg",
    "options": [
      "Rails",
      "Sinatra",
      "Ruby",
      "Crystal"
    ],
    "correctAnswer": "Ruby"
  },
  {
    "roundId": "logo",
    "question": "Identify this logo:",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
    "options": [
      "C#",
      "C",
      "Objective-C",
      "C++"
    ],
    "correctAnswer": "C++"
  },
  {
    "roundId": "debug",
    "question": "Why does this JavaScript code return undefined?",
    "codeSnippet": "function getObj() {\n  return \n  {\n    key: 'value'\n  };\n}",
    "options": [
      "Syntax Error",
      "Reference Error",
      "ASI (Automatic Semicolon Insertion)",
      "Type Error"
    ],
    "correctAnswer": "ASI (Automatic Semicolon Insertion)"
  },
  {
    "roundId": "debug",
    "question": "What is the bug in this C++ code?",
    "codeSnippet": "int arr[5] = {1, 2, 3, 4, 5};\nfor (int i = 0; i <= 5; i++) {\n  cout << arr[i];\n}",
    "options": [
      "Infinite loop",
      "Syntax error",
      "Compilation error",
      "Array out of bounds"
    ],
    "correctAnswer": "Array out of bounds"
  },
  {
    "roundId": "debug",
    "question": "What is the issue with this Python function?",
    "codeSnippet": "def append_to_list(val, my_list=[]):\n    my_list.append(val)\n    return my_list",
    "options": [
      "Type error",
      "Indentation error",
      "Mutable default argument",
      "Syntax error"
    ],
    "correctAnswer": "Mutable default argument"
  },
  {
    "roundId": "debug",
    "question": "What is wrong with this SQL query?",
    "codeSnippet": "SELECT * FROM users WHERE age = NULL;",
    "options": [
      "Syntax error",
      "Type mismatch",
      "Should use IS NULL",
      "Table doesn't exist"
    ],
    "correctAnswer": "Should use IS NULL"
  },
  {
    "roundId": "debug",
    "question": "What is the issue in this Java code?",
    "codeSnippet": "String s1 = new String('hello');\nString s2 = new String('hello');\nif (s1 == s2) {\n    System.out.println('Equal');\n}",
    "options": [
      "Compilation error",
      "Syntax error",
      "Compares object references instead of values",
      "Null pointer exception"
    ],
    "correctAnswer": "Compares object references instead of values"
  },
  {
    "roundId": "debug",
    "question": "What is the error in this React component?",
    "codeSnippet": "function Counter() {\n  let count = 0;\n  return <button onClick={() => count++}>{count}</button>;\n}",
    "options": [
      "Invalid JSX",
      "Syntax error",
      "State is not managed with useState",
      "Missing return statement"
    ],
    "correctAnswer": "State is not managed with useState"
  },
  {
    "roundId": "debug",
    "question": "Why does this promise chain fail to catch the error?",
    "codeSnippet": "Promise.resolve().then(() => {\n  throw new Error('fail');\n});\n.catch(e => console.log(e));",
    "options": [
      "Promise is already resolved",
      "Error is not thrown correctly",
      "Syntax error",
      "Semicolon terminates the statement before .catch"
    ],
    "correctAnswer": "Semicolon terminates the statement before .catch"
  },
  {
    "roundId": "debug",
    "question": "What is the problem with this CSS?",
    "codeSnippet": ".box {\n  width: 100%;\n  padding: 20px;\n}",
    "options": [
      "Syntax error",
      "Invalid property",
      "Missing unit",
      "Width exceeds 100% due to box-sizing"
    ],
    "correctAnswer": "Width exceeds 100% due to box-sizing"
  },
  {
    "roundId": "debug",
    "question": "Why does this Go code not compile?",
    "codeSnippet": "package main\nimport 'fmt'\nfunc main() {\n  x := 5\n}",
    "options": [
      "Unused variable x",
      "Invalid import",
      "Syntax error",
      "Missing return"
    ],
    "correctAnswer": "Unused variable x"
  },
  {
    "roundId": "debug",
    "question": "What is the issue with this regex?",
    "codeSnippet": "const regex = /^[a-z]+$/;\nregex.test('Hello');",
    "options": [
      "Case sensitive, fails on uppercase",
      "Missing flags",
      "Syntax error",
      "Invalid characters"
    ],
    "correctAnswer": "Case sensitive, fails on uppercase"
  },
  {
    "roundId": "debug",
    "question": "Why does this Node.js server crash?",
    "codeSnippet": "const http = require('http');\nhttp.createServer((req, res) => {\n  res.send('Hello');\n}).listen(3000);",
    "options": [
      "Port is in use",
      "res.send is not a standard http method (it's Express)",
      "Missing require",
      "Syntax error"
    ],
    "correctAnswer": "res.send is not a standard http method (it's Express)"
  },
  {
    "roundId": "debug",
    "question": "What is the bug in this sorting function?",
    "codeSnippet": "const arr = [10, 2, 5, 1];\narr.sort();",
    "options": [
      "Invalid array",
      "Missing arguments",
      "Syntax error",
      "Sorts alphabetically by default"
    ],
    "correctAnswer": "Sorts alphabetically by default"
  },
  {
    "roundId": "debug",
    "question": "Why does this loop run infinitely?",
    "codeSnippet": "for (let i = 0; i < 10; i--) {\n  console.log(i);\n}",
    "options": [
      "Decrementing i instead of incrementing",
      "Syntax error",
      "Condition is always true",
      "Missing block"
    ],
    "correctAnswer": "Decrementing i instead of incrementing"
  },
  {
    "roundId": "debug",
    "question": "What is the issue with this JSON?",
    "codeSnippet": "{ 'name': 'John', 'age': 30 }",
    "options": [
      "Keys must be enclosed in double quotes",
      "Missing comma",
      "Invalid types",
      "Syntax error"
    ],
    "correctAnswer": "Keys must be enclosed in double quotes"
  },
  {
    "roundId": "debug",
    "question": "Why does this event listener trigger multiple times?",
    "codeSnippet": "function setup() {\n  document.getElementById('btn').addEventListener('click', () => {\n    console.log('Clicked');\n  });\n}\nsetup();\nsetup();",
    "options": [
      "Invalid element",
      "Missing event object",
      "Syntax error",
      "Listener is added multiple times"
    ],
    "correctAnswer": "Listener is added multiple times"
  },
  {
    "roundId": "optimization",
    "question": "Which algorithm design paradigm solves a problem by breaking it into overlapping subproblems and storing the results?",
    "options": [],
    "correctAnswer": "Dynamic Programming"
  },
  {
    "roundId": "optimization",
    "question": "What technique is used to optimize recursive functions by caching previously computed results?",
    "options": [],
    "correctAnswer": "Memoization"
  },
  {
    "roundId": "optimization",
    "question": "Which data structure provides O(1) average time complexity for lookups?",
    "options": [],
    "correctAnswer": "Hash Table"
  },
  {
    "roundId": "optimization",
    "question": "What is the process of reducing the size of a file or data stream?",
    "options": [],
    "correctAnswer": "Compression"
  },
  {
    "roundId": "optimization",
    "question": "Which sorting algorithm is generally considered the fastest for large, random datasets in practice?",
    "options": [],
    "correctAnswer": "Quick Sort"
  },
  {
    "roundId": "optimization",
    "question": "What technique involves pre-allocating a fixed number of resources (like database connections) to be reused?",
    "options": [],
    "correctAnswer": "Connection Pooling"
  },
  {
    "roundId": "optimization",
    "question": "What is the term for loading only the necessary data or code when it is actually needed?",
    "options": [],
    "correctAnswer": "Lazy Loading"
  },
  {
    "roundId": "optimization",
    "question": "Which indexing structure is most commonly used in relational databases for fast range queries?",
    "options": [],
    "correctAnswer": "B-Tree"
  },
  {
    "roundId": "optimization",
    "question": "What technique distributes network traffic across multiple servers to ensure no single server bears too much demand?",
    "options": [],
    "correctAnswer": "Load Balancing"
  },
  {
    "roundId": "optimization",
    "question": "What is the process of storing frequently accessed data in a fast, temporary storage layer?",
    "options": [],
    "correctAnswer": "Caching"
  }
];

async function seed() {
  try {
    console.log('Deleting existing questions...');
    const snapshot = await getDocs(collection(db, 'questions'));
    console.log(`Found ${snapshot.docs.length} existing questions.`);
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
