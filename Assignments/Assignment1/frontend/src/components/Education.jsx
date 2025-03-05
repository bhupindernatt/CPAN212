function Education({ data }) {
    return (
        <div className="card p-3 my-3">
            <h2>Education</h2>
            {data.map((edu, index) => (
                <div key={index}>
                    <h4>{edu.degree}</h4>
                    <p>{edu.school} - {edu.year}</p>
                </div>
            ))}
        </div>
    );
}

export default Education;
