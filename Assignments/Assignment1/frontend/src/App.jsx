import { useState } from "react";
import Overview from "./components/Overview";
import Education from "./components/Education";
import Experience from "./components/Experience";

function App() {
    const [overview, setOverview] = useState(null);
    const [education, setEducation] = useState(null);
    const [experience, setExperience] = useState(null);

    const fetchOverview = async () => {
        const response = await fetch("http://localhost:8000/getOverview");
        const data = await response.json();
        setOverview(data);
    };

    const fetchEducation = async () => {
        const response = await fetch("http://localhost:8000/getEdu");
        const data = await response.json();
        setEducation(data);
    };

    const fetchExperience = async () => {
        const response = await fetch("http://localhost:8000/getExp");
        const data = await response.json();
        setExperience(data);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center">Online Resume</h1>
            <button className="btn btn-primary m-2" onClick={fetchOverview}>Load Overview</button>
            {overview && <Overview data={overview} />}
            
            <button className="btn btn-primary m-2" onClick={fetchEducation}>Load Education</button>
            {education && <Education data={education} />}
            
            <button className="btn btn-primary m-2" onClick={fetchExperience}>Load Experience</button>
            {experience && <Experience data={experience} />}
        </div>
    );
}

export default App;
