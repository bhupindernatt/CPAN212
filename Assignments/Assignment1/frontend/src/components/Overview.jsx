function Overview({ data }) {
    return (
        <div className="card p-3 my-3">
            <h2>About Me</h2>
            <p><strong>Name:</strong> {data.name}</p>
            <p>{data.summary}</p>
        </div>
    );
}

export default Overview;
