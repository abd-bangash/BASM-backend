
// const { MongoClient } = require('mongodb');
// const { v4: uuidv4 } = require('uuid');

// // This script seeds the database with video and question data.
// // It connects to MongoDB using the DATABASE_URL environment variable,
// // or falls back to a default local URL.

// // Raw data extracted and mapped from the CSV and video files.
// const videoData = [
//     {
//         categoryName: 'Honeytrap',
//         title: 'Honeytrap',
//         description: 'Learn to identify and avoid honeytrap attacks.',
//         filePath: 'Honeytrap.mp4',
//         interactiveQuestions: [
//             {
//                 id: uuidv4(),
//                 timestamp: 58,
//                 question: `Chris thinks it’s safe to share general details about his job since Sara isn’t asking for login credentials. What’s wrong with this thinking?`,
//                 options: [
//                     "It’s only risky if someone asks for a password",
//                     "Small details can be combined to launch larger attacks",
//                     "General job information is always safe to share",
//                     "Security only applies to technical staff"
//                 ],
//                 correctAnswer: "Small details can be combined to launch larger attacks"
//             },
//             {
//                 id: uuidv4(),
//                 timestamp: 75,
//                 question: `True or False? Chris received a professional-looking message from Sara with a file titled "Industry Report." He clicked it, believing it was helpful. Since it appeared friendly and relevant to his work, Chris did the right thing.`,
//                 options: ["True", "False"],
//                 correctAnswer: "False"
//             },
//             {
//                 id: uuidv4(),
//                 timestamp: 115,
//                 question: `In a honeytrap attack, which of these tactics is not typically used?`,
//                 options: [
//                     "Emotional manipulation",
//                     "Fake personal or romantic interest",
//                     "Technical vulnerability scanning",
//                     "Asking subtle questions about internal processes"
//                 ],
//                 correctAnswer: "Technical vulnerability scanning"
//             }
//         ]
//     },
//     {
//         categoryName: 'Impersonation',
//         title: 'Impersonation',
//         description: 'Learn to detect when someone is impersonating a trusted individual.',
//         filePath: 'Impersonation.mp4',
//         interactiveQuestions: [
//             {
//                 id: uuidv4(),
//                 timestamp: 23,
//                 question: `You receive a message that says: "Hi, I’m Amy from IT. Just confirming the password reset from this morning’s call with Calvin. Can you please share your login credentials again so we can complete the process?" What’s the safest action to take?`,
//                 options: [
//                     "Respond with your credentials, since you already spoke with Calvin earlier",
//                     "Ask Amy to send a confirmation email from her official IT address",
//                     "Verify directly with your official IT helpdesk before taking any action",
//                     "Ignore the message completely — it’s probably fake"
//                 ],
//                 correctAnswer: "Verify directly with your official IT helpdesk before taking any action"
//             },
//             {
//                 id: uuidv4(),
//                 timestamp: 74,
//                 question: `You receive an email from your “manager” asking you to urgently purchase gift cards for a client. The email looks real but comes from a slightly different domain (e.g., manager@companny.com). What should you suspect?`,
//                 options: [
//                     "A typing error in the email address",
//                     "Your manager forgot their main account",
//                     "It’s likely an impersonation scam",
//                     "A legitimate business request"
//                 ],
//                 correctAnswer: "It’s likely an impersonation scam"
//             }
//         ]
//     },
//     {
//         categoryName: 'Shoulder-surfing',
//         title: 'Shoulder Surfing',
//         description: 'Understand and prevent shoulder surfing attacks.',
//         filePath: 'Shoulder-surfing.mp4',
//         interactiveQuestions: [
//             {
//                 id: uuidv4(),
//                 timestamp: 38,
//                 question: `What is shoulder surfing?`,
//                 options: [
//                     "Watching a tutorial video",
//                     "Glancing over someone’s shoulder to steal info",
//                     "Using someone else’s chair",
//                     "Logging in from another location"
//                 ],
//                 correctAnswer: "Glancing over someone’s shoulder to steal info"
//             },
//             {
//                 id: uuidv4(),
//                 timestamp: 51,
//                 question: `How can you protect against shoulder surfing?`,
//                 options: [
//                     "Use a privacy screen",
//                     "Turn up your screen brightness",
//                     "Sit in a dark corner",
//                     "Lock your phone loudly"
//                 ],
//                 correctAnswer: "Use a privacy screen"
//             }
//         ]
//     },
//     {
//         categoryName: 'Fraudulent-Activity',
//         title: 'Fraudulent Activity',
//         description: 'Learn about different types of fraudulent activities.',
//         filePath: 'Fraudulent-Activity.mp4',
//         interactiveQuestions: [
//             {
//                 id: uuidv4(),
//                 timestamp: 48,
//                 question: `What is required for a Card-Not-Present (CNP) fraud to happen?`,
//                 options: [
//                     "The physical card and PIN",
//                     "CVV, card number, and expiry date",
//                     "Just the cardholder’s name",
//                     "Card chip only"
//                 ],
//                 correctAnswer: "CVV, card number, and expiry date"
//             },
//             {
//                 id: uuidv4(),
//                 timestamp: 66,
//                 question: `Which of these is a clear sign of potential card fraud?`,
//                 options: [
//                     "A one-time mobile recharge",
//                     "A coffee purchase from your regular café",
//                     "Monthly charges from a service you never subscribed to",
//                     "A transaction you made last week"
//                 ],
//                 correctAnswer: "Monthly charges from a service you never subscribed to"
//             }
//         ]
//     },
//     {
//         categoryName: 'InsiderThreat',
//         title: 'Insider Threat',
//         description: 'Recognize and mitigate threats from inside the organization.',
//         filePath: 'InsiderThreat.mp4',
//         interactiveQuestions: [
//             {
//                 id: uuidv4(),
//                 timestamp: 35,
//                 question: `True/False: An inadvertent insider is someone who causes harm to the organization on purpose.`,
//                 options: ["True", "False"],
//                 correctAnswer: "False"
//             },
//             {
//                 id: uuidv4(),
//                 timestamp: 70,
//                 question: `True/False: If a third-party website is hacked, and you used your work email and the same password, your organization could be at risk.`,
//                 options: ["True", "False"],
//                 correctAnswer: "True"
//             }
//         ]
//     },
//     {
//         categoryName: 'Malware&Ransomware',
//         title: 'Malware & Ransomware',
//         description: 'Learn to protect against malware and ransomware.',
//         filePath: 'Malware&Ransomware.mp4',
//         interactiveQuestions: [
//             {
//                 id: uuidv4(),
//                 timestamp: 45,
//                 question: `Which of these actions can lead to a ransomware infection?`,
//                 options: [
//                     "Opening social media on mobile",
//                     "Clicking unknown links on WhatsApp Web",
//                     "Charging your phone via USB",
//                     "Clearing browser history"
//                 ],
//                 correctAnswer: "Clicking unknown links on WhatsApp Web"
//             },
//             {
//                 id: uuidv4(),
//                 timestamp: 56,
//                 question: `What’s the best action if you accidentally click a suspicious link?`,
//                 options: [
//                     "Restart the system",
//                     "Pay the ransom quickly",
//                     "Disconnect the device and report to IT",
//                     "Ignore it if nothing looks wrong"
//                 ],
//                 correctAnswer: "Disconnect the device and report to IT"
//             }
//         ]
//     },
//     {
//         categoryName: 'Malware-Identification&Response',
//         title: 'Malware Identification & Response',
//         description: 'How to identify and respond to malware infections.',
//         filePath: 'Malware-Identification&Response.mp4',
//         interactiveQuestions: [
//             {
//                 id: uuidv4(),
//                 timestamp: 38,
//                 question: `If your computer shows random pop-ups even when offline, what should you do first?`,
//                 options: [
//                     "Ignore and continue working",
//                     "Run a full antivirus scan",
//                     "Reboot and hope it fixes itself"
//                 ],
//                 correctAnswer: "Run a full antivirus scan"
//             },
//             {
//                 id: uuidv4(),
//                 timestamp: 65,
//                 question: `After installing a new app, your computer acts strange. What’s the safest step?`,
//                 options: [
//                     "Keep using the software",
//                     "Uninstall the software and scan for malware",
//                     "Restart the computer and ignore the behaviour"
//                 ],
//                 correctAnswer: "Uninstall the software and scan for malware"
//             }
//         ]
//     },
//     {
//         categoryName: 'Cousin-Domain',
//         title: 'Cousin Domain Trap',
//         description: 'Learn to spot fake websites using cousin domains.',
//         filePath: 'Cousin-Domain.mp4',
//         interactiveQuestions: [
//             {
//                 id: uuidv4(),
//                 timestamp: 29,
//                 question: `You receive an email with a link to update your company credentials. The website it leads to looks exactly like your company login page — but the domain is secure-corporate-login.com. What’s the safest interpretation?`,
//                 options: [
//                     "It's a secure external login page for remote employees",
//                     "It’s a temporary backup login due to maintenance",
//                     "It’s likely a lookalike or cousin domain used to steal credentials",
//                     "It’s a regional login page created for a specific office"
//                 ],
//                 correctAnswer: "It’s likely a lookalike or cousin domain used to steal credentials"
//             },
//             {
//                 id: uuidv4(),
//                 timestamp: 53,
//                 question: `Ali realizes he accidentally shared his work login on a fake site. What’s the most important action he should take immediately?`,
//                 options: [
//                     "Wait and see if anything unusual happens",
//                     "Change his password after a few hours",
//                     "Inform IT/security team right away and reset his credentials",
//                     "Delete the email and hope for the best"
//                 ],
//                 correctAnswer: "Inform IT/security team right away and reset his credentials"
//             }
//         ]
//     },
//     {
//         categoryName: 'Phishing',
//         title: 'Phishing',
//         description: 'General phishing awareness.',
//         filePath: 'Phishing.mp4',
//         interactiveQuestions: [
//             {
//                 id: uuidv4(),
//                 timestamp: 46,
//                 question: `Which of the following is a clear sign of a phishing email?`,
//                 options: [
//                     "The email asks you to verify your account by clicking a link.",
//                     "The email is from a known sender with no suspicious content.",
//                     "The email has perfect grammar and official branding.",
//                     "The email informs you about a recent purchase you actually made."
//                 ],
//                 correctAnswer: "The email asks you to verify your account by clicking a link."
//             }
//         ]
//     },
//     {
//         categoryName: 'WebSite-Defacement',
//         title: 'Website Defacement',
//         description: 'Learn how website defacement happens and how to prevent it.',
//         filePath: 'WebSite-Defacement.mp4',
//         interactiveQuestions: [
//             {
//                 id: uuidv4(),
//                 timestamp: 23,
//                 question: `Which of the following could allow a hacker to deface your website?`,
//                 options: [
//                     "Outdated CMS/plugins",
//                     "Strong admin passwords",
//                     "SSL certificate renewal",
//                     "VPN usage on office network"
//                 ],
//                 correctAnswer: "Outdated CMS/plugins"
//             },
//             {
//                 id: uuidv4(),
//                 timestamp: 44,
//                 question: `Which of the following is NOT a common cause of website defacement?`,
//                 options: [
//                     "Using weak admin passwords",
//                     "Outdated website plugins",
//                     "Having a strong firewall",
//                     "No regular backups"
//                 ],
//                 correctAnswer: "Having a strong firewall"
//             }
//         ]
//     },
//     {
//         categoryName: 'DDOS',
//         title: 'DDoS Attacks',
//         description: 'Understanding and mitigating DDoS attacks.',
//         filePath: 'DDOS.mp4',
//         interactiveQuestions: [
//             {
//                 id: uuidv4(),
//                 timestamp: 41,
//                 question: `Which of the following best describes a DDoS attack?`,
//                 options: [
//                     "A phishing email targeting employees",
//                     "A virus spreading through USB drives",
//                     "A flood of fake traffic that crashes a website",
//                     "A hacker stealing data through backdoors"
//                 ],
//                 correctAnswer: "A flood of fake traffic that crashes a website"
//             },
//             {
//                 id: uuidv4(),
//                 timestamp: 51,
//                 question: `Which of these actions can help protect against DDoS attacks?`,
//                 options: [
//                     "Using outdated plugins",
//                     "Disabling firewalls",
//                     "Implementing rate limiting and using a Web Application Firewall (WAF)",
//                     "Ignoring traffic spikes"
//                 ],
//                 correctAnswer: "Implementing rate limiting and using a Web Application Firewall (WAF)"
//             }
//         ]
//     },
//     {
//         categoryName: 'Endpoint-Security',
//         title: 'Endpoint Security',
//         description: 'The importance of securing endpoints.',
//         filePath: 'Endpoint-Security.mp4',
//         interactiveQuestions: [
//             {
//                 id: uuidv4(),
//                 timestamp: 48,
//                 question: `Why is endpoint security important?`,
//                 options: [
//                     "To improve battery life",
//                     "To block ads",
//                     "To protect each device from cyber threats",
//                     "To speed up downloads"
//                 ],
//                 correctAnswer: "To protect each device from cyber threats"
//             },
//             {
//                 id: uuidv4(),
//                 timestamp: 63,
//                 question: `Which of these is the best way to secure your credentials?`,
//                 options: [
//                     "Save passwords in a browser",
//                     "Use strong, unique passwords with MFA",
//                     "Write passwords on a notepad",
//                     "Share passwords with trusted colleagues"
//                 ],
//                 correctAnswer: "Use strong, unique passwords with MFA"
//             }
//         ]
//     }
// ];

// async function seedDB() {
//     // Fallback to a default local MongoDB instance if DATABASE_URL is not set.
//     const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/BASM";
//     const client = new MongoClient(uri);

//     try {
//         await client.connect();
//         console.log("Connected correctly to server");

//         const collection = client.db().collection("categoryVideos");

//         // The following line will delete all existing documents in the collection.
//         await collection.deleteMany({});
//         console.log("Deleted existing documents in 'categoryvideos' collection.");

//         // Insert the new data
//         await collection.insertMany(videoData);
//         console.log(`Successfully inserted ${videoData.length} documents into 'categoryvideos' collection.`);

//     } catch (err) {
//         console.error("An error occurred while attempting to seed the database:", err);
//     } finally {
//         await client.close();
//         console.log("Connection closed.");
//     }
// }

// seedDB();
