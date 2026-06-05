import Header from "../components/Header";
import "./EngineeringMapPage.css";

function EngineeringMapPage() {
  return (
    <div className="engineering-map-page">
      <Header />

      <main className="engineering-map-container">
        <section className="engineering-map-card">
          <div className="engineering-map-header">
            <p className="map-badge">CAMPUS MAP</p>
          </div>

          <a
            href="/images/engineering-map2.png"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/images/engineering-map2.png"
              alt="공대 캠퍼스 맵"
              className="engineering-map-image"
            />
          </a>
        </section>
      </main>
    </div>
  );
}

export default EngineeringMapPage;