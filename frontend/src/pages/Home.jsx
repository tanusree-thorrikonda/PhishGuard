function Home() {
    return (
        <div className="home">

            <h1>Stay Safe in the Digital World</h1>

            <p>
                Analyze suspicious URLs and understand
                potential phishing threats with PhishGuard.
            </p>

            <div className="scanner">
                <input
                    type="text"
                    placeholder="Enter a URL to analyze..."
                />

                <button>Analyze URL</button>
            </div>

            <p className="note">
                Your URL will be analyzed for suspicious
                characteristics.
            </p>

        </div>
    );
}

export default Home;