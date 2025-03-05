import express from "express";
import cors from "cors";

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());


const overview = { name: "Bhupinder Natt", summary: "A dedicated Humber College graduate passionate about data analytics, leveraging strong analytical skills and problem-solving abilities to extract insights and drive data-driven decision-making. Skilled in data visualization, statistical analysis, and database management, with a keen interest in transforming raw data into actionable business intelligence. Seeking opportunities to apply expertise in a dynamic and growth-oriented environment. " };
const education = [
    { degree: "Computer Programming", school: "Humber College", year: "2023-2025" },
    { degree: "High School Diploma", school: "St Francais Xavier", year: "2015-2019" }
];
const experience = [
    { jobTitle: "Technical Support Specialist", company: "Aspira", year: "2021-2023" },
    
];

// Endpoints
app.get("/getOverview", (req, res) => res.json(overview));
app.get("/getEdu", (req, res) => res.json(education));
app.get("/getExp", (req, res) => res.json(experience));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
