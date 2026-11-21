
USE careerconnect;

-- =========================================
-- 1. INSERT DEMO COMPANY ACCOUNTS
-- =========================================

INSERT IGNORE INTO users (name, email, password_hash, role)
VALUES
('TechNova Solutions', 'hr@technova.demo', 'SEED_ONLY_NOT_LOGIN', 'company'),
('CodeWave Technologies', 'hr@codewave.demo', 'SEED_ONLY_NOT_LOGIN', 'company'),
('Virtusa Demo', 'hr@virtusa-demo.demo', 'SEED_ONLY_NOT_LOGIN', 'company'),
('Dialog Digital Labs', 'hr@dialog-demo.demo', 'SEED_ONLY_NOT_LOGIN', 'company'),
('99X Technologies', 'hr@99x-demo.demo', 'SEED_ONLY_NOT_LOGIN', 'company'),
('Creative Software', 'hr@creative.demo', 'SEED_ONLY_NOT_LOGIN', 'company'),
('DataSphere Analytics', 'hr@datasphere.demo', 'SEED_ONLY_NOT_LOGIN', 'company'),
('CloudNine Systems', 'hr@cloudnine.demo', 'SEED_ONLY_NOT_LOGIN', 'company'),
('SecureNet Lanka', 'hr@securenet.demo', 'SEED_ONLY_NOT_LOGIN', 'company'),
('PixelPerfect Studio', 'hr@pixelperfect.demo', 'SEED_ONLY_NOT_LOGIN', 'company'),
('NextGen IT Solutions', 'hr@nextgen.demo', 'SEED_ONLY_NOT_LOGIN', 'company'),
('InnovateX Labs', 'hr@innovatex.demo', 'SEED_ONLY_NOT_LOGIN', 'company');

-- =========================================
-- 2. GET COMPANY IDS
-- =========================================

SET @c1 = (SELECT id FROM users WHERE email='hr@technova.demo');
SET @c2 = (SELECT id FROM users WHERE email='hr@codewave.demo');
SET @c3 = (SELECT id FROM users WHERE email='hr@virtusa-demo.demo');
SET @c4 = (SELECT id FROM users WHERE email='hr@dialog-demo.demo');
SET @c5 = (SELECT id FROM users WHERE email='hr@99x-demo.demo');
SET @c6 = (SELECT id FROM users WHERE email='hr@creative.demo');
SET @c7 = (SELECT id FROM users WHERE email='hr@datasphere.demo');
SET @c8 = (SELECT id FROM users WHERE email='hr@cloudnine.demo');
SET @c9 = (SELECT id FROM users WHERE email='hr@securenet.demo');
SET @c10 = (SELECT id FROM users WHERE email='hr@pixelperfect.demo');
SET @c11 = (SELECT id FROM users WHERE email='hr@nextgen.demo');
SET @c12 = (SELECT id FROM users WHERE email='hr@innovatex.demo');

-- =========================================
-- 3. INSERT 24 INTERNSHIP OPPORTUNITIES
-- =========================================

INSERT INTO jobs
(company_id, title, company_name, category, location,
 work_type, description, requirements, skills, stipend, deadline)
VALUES

(@c1, 'QA Engineer Intern', 'TechNova Solutions',
'Quality Assurance', 'Colombo', 'Hybrid',
'Join our QA team and participate in testing modern web applications. Assist with test case creation, bug reporting and regression testing.',
'Basic knowledge of software testing and web applications.',
JSON_ARRAY('Manual Testing','Playwright','JavaScript','JIRA'),
'LKR 35,000 - 45,000', '2027-02-28'),

(@c1, 'Software Engineering Intern', 'TechNova Solutions',
'Software Engineering', 'Colombo', 'On-site',
'Work with developers to build and maintain web applications.',
'Basic programming and database knowledge.',
JSON_ARRAY('Java','React','MySQL','Git'),
'LKR 40,000', '2027-03-15'),

(@c2, 'Frontend Developer Intern', 'CodeWave Technologies',
'Software Engineering', 'Remote', 'Remote',
'Develop responsive web interfaces and collaborate with the UI team.',
'Knowledge of HTML, CSS and JavaScript.',
JSON_ARRAY('React','JavaScript','CSS','HTML'),
'LKR 30,000', '2027-03-20'),

(@c2, 'Backend Developer Intern', 'CodeWave Technologies',
'Software Engineering', 'Kandy', 'Hybrid',
'Assist in developing REST APIs and database-driven applications.',
'Basic backend development knowledge.',
JSON_ARRAY('Node.js','Express','MySQL','REST API'),
'LKR 35,000', '2027-04-10'),

(@c3, 'Automation QA Intern', 'Virtusa Demo',
'Quality Assurance', 'Colombo', 'Hybrid',
'Support automation testing activities and develop automated test scripts.',
'Understanding of testing fundamentals.',
JSON_ARRAY('Playwright','Selenium','JavaScript','API Testing'),
'LKR 45,000', '2027-03-30'),

(@c3, 'Business Analyst Intern', 'Virtusa Demo',
'Business Analysis', 'Colombo', 'On-site',
'Assist business analysts with requirement gathering and documentation.',
'Good analytical and communication skills.',
JSON_ARRAY('Excel','Documentation','SQL','Communication'),
'LKR 35,000', '2027-04-15'),

(@c4, 'IT Support Intern', 'Dialog Digital Labs',
'IT Support', 'Colombo', 'On-site',
'Provide technical support for hardware, software and network-related issues.',
'Basic Windows troubleshooting and computer hardware knowledge.',
JSON_ARRAY('Windows','Networking','Hardware','Troubleshooting'),
'LKR 30,000', '2027-03-25'),

(@c4, 'Network Engineering Intern', 'Dialog Digital Labs',
'Network Engineering', 'Colombo', 'Hybrid',
'Assist with network monitoring and infrastructure maintenance.',
'Basic networking concepts.',
JSON_ARRAY('TCP/IP','Networking','Cisco','Linux'),
'LKR 35,000', '2027-04-20'),

(@c5, 'Junior QA Intern', '99X Technologies',
'Quality Assurance', 'Colombo', 'Hybrid',
'Perform functional, exploratory and regression testing.',
'Interest in software quality assurance.',
JSON_ARRAY('Test Cases','Bug Reporting','Postman','Agile'),
'LKR 40,000', '2027-03-10'),

(@c5, 'React Developer Intern', '99X Technologies',
'Software Engineering', 'Remote', 'Remote',
'Contribute to frontend development using React.',
'Basic React and JavaScript knowledge.',
JSON_ARRAY('React','JavaScript','GitHub','CSS'),
'LKR 35,000', '2027-04-01'),

(@c6, 'UI UX Design Intern', 'Creative Software',
'UI/UX Design', 'Galle', 'Hybrid',
'Create wireframes, prototypes and user-friendly interfaces.',
'Basic understanding of UI/UX principles.',
JSON_ARRAY('Figma','Wireframing','Prototyping','UI Design'),
'LKR 25,000', '2027-03-28'),

(@c6, 'Web Development Intern', 'Creative Software',
'Software Engineering', 'Galle', 'On-site',
'Assist in developing and maintaining company websites.',
'HTML, CSS and JavaScript fundamentals.',
JSON_ARRAY('HTML','CSS','JavaScript','PHP'),
'LKR 28,000', '2027-04-18'),

(@c7, 'Data Analyst Intern', 'DataSphere Analytics',
'Data Analytics', 'Colombo', 'Remote',
'Analyze datasets and prepare reports to support business decisions.',
'Basic SQL and analytical skills.',
JSON_ARRAY('Python','SQL','Excel','Power BI'),
'LKR 40,000', '2027-03-31'),

(@c7, 'Machine Learning Intern', 'DataSphere Analytics',
'Data Analytics', 'Colombo', 'Hybrid',
'Assist with data preprocessing and machine learning experiments.',
'Basic Python and statistics knowledge.',
JSON_ARRAY('Python','Pandas','Machine Learning','Statistics'),
'LKR 45,000', '2027-04-25'),

(@c8, 'Cloud Engineering Intern', 'CloudNine Systems',
'Software Engineering', 'Remote', 'Remote',
'Support cloud infrastructure deployment and monitoring.',
'Basic cloud computing knowledge.',
JSON_ARRAY('AWS','Linux','Docker','Cloud Computing'),
'LKR 40,000', '2027-04-12'),

(@c8, 'DevOps Intern', 'CloudNine Systems',
'Software Engineering', 'Colombo', 'Hybrid',
'Assist in CI/CD pipeline development and infrastructure automation.',
'Basic Git and command-line knowledge.',
JSON_ARRAY('GitHub Actions','Docker','Linux','CI/CD'),
'LKR 42,000', '2027-05-01'),

(@c9, 'Cybersecurity Intern', 'SecureNet Lanka',
'Cybersecurity', 'Colombo', 'On-site',
'Assist the security team with vulnerability assessments and security monitoring.',
'Basic understanding of cybersecurity concepts.',
JSON_ARRAY('Cybersecurity','Networking','Linux','Security'),
'LKR 35,000', '2027-04-05'),

(@c9, 'Security Testing Intern', 'SecureNet Lanka',
'Quality Assurance', 'Remote', 'Remote',
'Support application security testing and security documentation.',
'Basic software testing knowledge.',
JSON_ARRAY('Security Testing','OWASP','Postman','API Testing'),
'LKR 38,000', '2027-05-10'),

(@c10, 'Graphic and UI Design Intern', 'PixelPerfect Studio',
'UI/UX Design', 'Kandy', 'Hybrid',
'Create digital designs and support user interface projects.',
'Basic design and prototyping skills.',
JSON_ARRAY('Figma','Adobe XD','UI Design','Creativity'),
'LKR 25,000', '2027-04-22'),

(@c10, 'Frontend UI Developer Intern', 'PixelPerfect Studio',
'Software Engineering', 'Remote', 'Remote',
'Convert design prototypes into responsive web interfaces.',
'Basic HTML, CSS and JavaScript knowledge.',
JSON_ARRAY('React','HTML','CSS','JavaScript'),
'LKR 30,000', '2027-05-15'),

(@c11, 'Technical Support Intern', 'NextGen IT Solutions',
'IT Support', 'Gampaha', 'On-site',
'Help users troubleshoot software, hardware and connectivity issues.',
'Basic computer maintenance knowledge.',
JSON_ARRAY('Windows','Microsoft Office','Hardware','Networking'),
'LKR 25,000', '2027-04-30'),

(@c11, 'Database Intern', 'NextGen IT Solutions',
'Software Engineering', 'Gampaha', 'Hybrid',
'Assist with database management, queries and data validation.',
'Basic SQL knowledge.',
JSON_ARRAY('MySQL','SQL','Database Design','PHP'),
'LKR 30,000', '2027-05-20'),

(@c12, 'Software QA Intern', 'InnovateX Labs',
'Quality Assurance', 'Badulla', 'Remote',
'Participate in manual and automated testing of web applications.',
'Basic understanding of SDLC and testing.',
JSON_ARRAY('Playwright','Manual Testing','JavaScript','GitHub'),
'LKR 32,000', '2027-05-25'),

(@c12, 'Full Stack Developer Intern', 'InnovateX Labs',
'Software Engineering', 'Colombo', 'Hybrid',
'Contribute to frontend and backend application development.',
'Basic React and backend programming skills.',
JSON_ARRAY('React','Node.js','MySQL','REST API'),
'LKR 40,000', '2027-06-01');

-- =========================================
-- 4. VERIFY INSERTED DATA
-- =========================================

SELECT COUNT(*) AS total_companies
FROM users
WHERE role = 'company';

SELECT COUNT(*) AS total_internships
FROM jobs;

SELECT id, title, company_name, category,
       location, work_type, stipend, deadline
FROM jobs
ORDER BY created_at DESC;
