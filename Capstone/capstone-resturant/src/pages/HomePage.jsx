import atmosphereImage from '../../public/images/atmosphere.jpg';
import './HomePage.css';

export default function HomePage() {
    return (
        <>
            <header className="hero-section">
                <img src={atmosphereImage} alt="Lorem Ipsum atmosphere and design" className="hero-bg" />
            </header>

            <main className="container my-5">
                <div className="row justify-content-center text-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <section className="welcome-title-container">

                            <h1 className="tiered-title mb-5">Lorem Ipsum Cafe</h1>

                            {/* 4. Don't forget to self-close the horizontal rule! */}
                            <hr className="section-divider my-3 w-50 mx-auto" />

                            <h2 className="tiered-subtitle text-muted mt-5">Where simple is better than complex.</h2>

                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}