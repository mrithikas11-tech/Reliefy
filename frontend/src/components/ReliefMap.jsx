function ReliefMap({ large = false }) {
  return (
    <section className={`mapCard ${large ? "mapCardLarge" : ""}`}>
      <div className="mapHeader">
        <div>
          <span className="eyebrow">SJSU RELIEF NETWORK</span>
          <h3>Nearby Restaurant Coverage</h3>
        </div>

        <span className="livePill">
          <span></span>
          Live
        </span>
      </div>

      <div className="mapCanvas">
        <div className="mapGrid"></div>
        <div className="river"></div>

        <div className="mapRoad roadA"></div>
        <div className="mapRoad roadB"></div>
        <div className="mapRoad roadC"></div>

        <div className="mapLocation shelterLocation">
          <div className="shelterPin">⌂</div>

          <div className="locationCard shelterCard">
            <strong>San José State University</strong>
            <span>200 meals needed</span>
            <span>Deadline: 6:00 PM</span>
          </div>
        </div>

        <div className="mapLocation sunriseLocation">
          <div className="restaurantPin selected"></div>

          <div className="locationCard">
            <strong>Peanuts Deluxe Cafe</strong>
            <span>80 demo meals · $640</span>
            <span>Ready 4:00 PM</span>
            <em>Selected</em>
          </div>
        </div>

        <div className="mapLocation mapleLocation">
          <div className="restaurantPin selected"></div>

          <div className="locationCard">
            <strong>Home Eat</strong>
            <span>120 demo meals · $960</span>
            <span>Ready 5:00 PM</span>
            <em>Selected</em>
          </div>
        </div>

        <div className="mapLocation gardenLocation">
          <div className="restaurantPin late"></div>

          <div className="locationCard">
            <strong>Sammy G's Pizzeria</strong>
            <span>60 demo meals · $600</span>
            <span>Ready 7:00 PM</span>
            <em className="lateText">Too late</em>
          </div>
        </div>

        <span className="distanceTag distanceA">Nearby</span>
        <span className="distanceTag distanceB">Nearby</span>
        <span className="distanceTag distanceC">Nearby</span>

        <div className="mapDisclaimer">
          Schematic map · Google Maps integration next
        </div>
      </div>
    </section>
  );
}

export default ReliefMap;