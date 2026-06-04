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

          <img
            src="/images/engineering-map.png"
            alt="공대 캠퍼스 맵"
            className="engineering-map-image"
          />
        </section>
      </main>
    </div>
  );
}

export default EngineeringMapPage;