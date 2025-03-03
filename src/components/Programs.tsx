function Programs() {
    return (
        <>
            <section className="p-8">
                <div className="flex space-x-3 justify-between items-center">
                    <h2 className="text-3xl font-bold text-dark-secondary mb-4">Programs</h2>
                    <ul className="flex gap-4 items-center cursor-pointer">
                        <li className = 'hover:bg-light-primary p-4 rounded'>All Programs</li>
                        <li className = 'hover:bg-light-primary p-4 rounded'>Basic Education</li>
                        <li className = 'hover:bg-light-primary p-4 rounded'>Non formal Edu</li>
                        <li className = 'hover:bg-light-primary p-4 rounded'>Others..</li>
                        <form>
                            <input type="text" placeholder="Search" className="p-2 rounded border border-light-primary bg-light-gray" />
                        </form>
                    </ul>
                </div>
                <div className="card-container flex flex-wrap gap-3">
                    <div className="card">
                        <h3>Card 1</h3>
                    </div>
                    <div className="card">
                        <h3>Card 2</h3>
                    </div>
                </div>
            </section>
        </>
    )
};

export default Programs;