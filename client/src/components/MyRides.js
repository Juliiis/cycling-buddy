import React, { Component } from "react";

export default class MyRides extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myRideDetails: null,
    };
  }

  onSelectRide(ride) {
    console.log(ride.ride_id);
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
