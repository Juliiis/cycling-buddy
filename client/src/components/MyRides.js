import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
// import MarkerLayer from "react-leaflet-marker-layer";
import "./MyRides.css";

const OCD_API_KEY = process.env.REACT_APP_KEY;

export default class MyRides extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myRideDetails: null,
      markers: [[41.38879, 2.15899], [41.38679, 2.15899], [41.38679, 2.15499]]
    };
  }

  onSelectRide(ride) {
    // console.log(ride.ride_id);
    this.setState({
      myRideDetails: ride,
    });
  }

  async deleteButtonPressed(e) {
    const { myRideDetails } = this.state;
    const { usersRides } = this.props;
    e.preventDefault();
    await this.props.userDeleted(myRideDetails);
    //when ride is deleted, empty myRideDetails as well
    this.setState({
      myRideDetails: null,
    });
  }

  // addMarker(){
  //   const { markers } = this.state;
  //   // markers.push(latlng);
  // };

  render() {
    const { usersRides } = this.props;
    const { myRideDetails } = this.state;
    return (
      <div>
        <div className="row">
          <br />
        </div>

        <div className="row">
          <div className="col-6 ml-4 scrollableCol setHeight">
            <div>
            {usersRides.map((ride) => {
              return (
                <div
                  key={ride.ride_id}
                  onClick={() => {
                    this.onSelectRide(ride);
                  }}
                  className="text-info mb-3"
                >
                  <strong className="h5">{ride.title}</strong>
                  <br />
                  <span className="text-muted">
                    {this.props.formatDate(ride.startdate)}
                  </span>
                  <br />
                  <span className="text-muted">{ride.startpoint}</span>
                </div>
              );
            })}
            </div>
              <div style={{backgroundColor: '#ccc'}}>
              <Map ref='map' center={[41.38879, 2.15899]}
        onClick={this.addMarker}
      zoom={15}
      >
        <TileLayer
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png"
          attribution='&copy; Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

            {this.state.markers.map((position, idx) => 
              <Marker key={`marker-${idx}`} position={position}>
              </Marker>
            )}
            </Map>
            </div>
          </div>



          <div className="col">
            {myRideDetails != null ? (
              <div className="text-info mb-3">
                <div className="h5">{myRideDetails.title}</div>
                <div>
                  <p className="text-muted">{myRideDetails.description}</p>
                </div>
                <div>
                  <span className="text-muted">Where: </span>
                  {myRideDetails.startpoint}
                </div>
                <div>
                  <span className="text-muted">When: </span>
                  {this.props.formatDate(myRideDetails.startdate)}
                </div>
                <div>
                  <span className="text-muted">Length: </span>
                  {myRideDetails.lengthinkm} km
                </div>
                <div>
                  <span className="text-muted">Difficulty: </span>
                  {myRideDetails.difficulty}
                </div>
                <div>
                  <span className="text-muted">Terrain type: </span>
                  {myRideDetails.terraintype}
                </div>
                <button
                  onClick={(e) => {
                    this.deleteButtonPressed(e);
                  }}
                  className="btn btn-outline-info mt-3"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div> 
          </div>
        </div>

    );
  }
}
