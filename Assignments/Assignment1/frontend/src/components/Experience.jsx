function Experience({ data }) {
    return (
        <div className="card p-3 my-3">
            <h2>Work Experience</h2>
            {data.map((exp, index) => (
                <div key={index}>
                    <h4>{exp.jobTitle}</h4>
                    <p>{exp.company} - {exp.year}</p>
                </div>
            ))}
        </div>
    );
}

export default Experience;
