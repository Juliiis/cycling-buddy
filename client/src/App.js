import React from "react";
import "./App.css";
import CreateRide from "./components/CreateRide";
import AllRides from "./components/AllRides";
import MyRides from "./components/MyRides";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //currently "logged in" user
      user: 1,
      rides: [],
      usersRides: [],
      showComponent: "all",
      rideCreated: 0,
    };
  }

  stringParse = (text) => {
    // swap single quote for 2 single quotes because SQL
    // prettier-ignore
    return text.replace(/'/g, "''");
  };

  addNewRide = async (newRide) => {
    console.log("adding new ride");

    let parsedDesc = this.stringParse(newRide.description);
    console.log(parsedDesc);
    newRide.description = parsedDesc;

    console.log(JSON.stringify(newRide));

    try {
      const result = await fetch("/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRide),
      });
      const rides = await result.json();
      this.setState({
        rides: rides,
      });
    } catch (err) {
      console.log(err);
    }
    this.setState({
      rideCreated: 1,
    });
    //get back updated users rides
    try {
      const resU = await fetch(`/api/usersrides/${this.state.user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const usersRides = await resU.json();
      this.setState({
        usersRides: usersRides,
      });
    } catch (err) {
      console.log(err);
    }
  };

  userDeleted = async (ride) => {
    const { user } = this.state;
    const bodyToSend = {
      user_id: user,
      ride_id: ride.ride_id,
    };
    if (user === ride.createdby) {
      // ride created by user - sets iscompleted flag to 1, get back list of rides and usersrides
      console.log("ride created by user");
      try {
        const result = await fetch("/api/rides", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyToSend),
        });
        const rides = await result.json();
        this.setState({
          rides: rides,
        });
        // console.log("in the try");
      } catch (err) {
        console.log(err);
      }
      //get back updated users rides
      try {
        const resU = await fetch(`/api/usersrides/${this.state.user}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const usersRides = await resU.json();
        this.setState({
          usersRides: usersRides,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      //if ride is not created by user - just delete user ride association, get back list of usersrides, change state
      try {
        const result = await fetch("/api/usersrides", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyToSend),
        });
        const usersRides = await result.json();
        this.setState({
          usersRides: usersRides,
        });
      } catch (err) {
        console.log(err);
      }
      // console.log("ride not created by user");
    }
  };

  refreshUsersRides = async () => {
    try {
      const resU = await fetch(`/api/usersrides/${this.state.user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const usersRides = await resU.json();
      this.setState({
        usersRides: usersRides,
      });
    } catch (err) {
      console.log(err);
    }
  };
  navigateTo(e) {
    e.preventDefault();
    // console.log(e.target.value);
    this.setState({
      showComponent: e.target.value,
      rideCreated: 0,
    });
  }

  createAnother(e) {
    e.preventDefault();
    this.setState({
      rideCreated: 0,
    });
  }

  formatDate(input) {
    // takes sql date and makes it browser friendly, default param for local timezone
    let options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };
    let d = new Date(input);
    // console.log(new Intl.DateTimeFormat('default', options).format(d));
    return new Intl.DateTimeFormat("default", options).format(d);
  }

  componentDidMount = async () => {
    // populate rides state
    try {
      const res = await fetch("/api/rides");
      const rides = await res.json();
      this.setState({
        rides: rides,
      });
    } catch (err) {
      console.log(err);
    }
    //populate user rides state
    try {
      const resU = await fetch(`/api/usersrides/${this.state.user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const usersRides = await resU.json();

      this.setState({
        usersRides: usersRides,
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { user, rides, usersRides, showComponent, rideCreated } = this.state;
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col bg-light rounded mt-2 text-center">
              <h1 className="display-2 ml-5 mt-5 mr-5 blue-text">
                <i className="fas fa-biking"></i>
                <i className="fas fa-biking ml-2"></i>
                <i className="fas fa-biking oddRider ml-2"></i>
                <i className="fas fa-biking ml-2"></i> <span> Cycling</span>
                <span className="oddRider"> Buddy </span>
              </h1>
              <br />
              <p className="lead font-italic mb-5 mt-3 blue-text">
                Don't want to go alone? Bring a buddy!
              </p>
            </div>
          </div>
          <div className="row sticky-top mt-n2 mb-2">
            <div className="col bg-light rounded">
              <nav className="navbar justify-content">
                <button
                  value="all"
                  onClick={(e) => {
                    this.navigateTo(e);
                  }}
                  className={
                    showComponent === "all"
                      ? "btn btn-lg btn-info m-2"
                      : "btn btn-lg btn-outline-info m-2"
                  }
                >
                  Browse all rides
                </button>
                <button
                  value="my"
                  onClick={(e) => {
                    this.navigateTo(e);
                  }}
                  className={
                    showComponent === "my"
                      ? "btn btn-lg btn-info ml-2"
                      : "btn btn-lg btn-outline-info ml-2"
                  }
                >
                  My rides
                </button>
                <button
                  value="create"
                  onClick={(e) => {
                    this.navigateTo(e);
                  }}
                  className={
                    showComponent === "create"
                      ? "btn btn-lg btn-info ml-3"
                      : "btn btn-lg btn-outline-info ml-3"
                  }
                >
                  Create a new ride
                </button>
              </nav>
            </div>
          </div>
          <div className="row">
            <div className="col bg-light rounded">
              {(() => {
                switch (showComponent) {
                  case "all":
                    return (
                      <AllRides
                        user={user}
                        rides={rides}
                        usersRides={usersRides}
                        refreshUsersRides={this.refreshUsersRides}
                        formatDate={(d) => this.formatDate(d)}
                      />
                    );
                  case "my":
                    return (
                      <MyRides
                        user={user}
                        usersRides={usersRides}
                        userDeleted={(ride) => this.userDeleted(ride)}
                        formatDate={(d) => this.formatDate(d)}
                      />
                    );
                  case "create":
                    return (
                      <CreateRide
                        user={user}
                        rides={rides}
                        addNewRide={(newRide) => this.addNewRide(newRide)}
                        rideCreated={rideCreated}
                        createAnother={(e) => this.createAnother(e)}
                      />
                    );

                  default:
                    return (
                      <AllRides
                        user={user}
                        rides={rides}
                        usersRides={usersRides}
                        refreshUsersRides={this.refreshUsersRides}
                      />
                    );
                }
              })()}
            </div>
            {/* <MyRides
              user={user}
              usersRides={usersRides}
              userDeleted={(ride) => this.userDeleted(ride)}
            /> */}
            {/* <CreateRide
              user={user}
              rides={rides}
              addNewRide={(newRide) => this.addNewRide(newRide)}
            /> */}
            {/* <div>
                <AllRides
                  user={user}
                  rides={rides}
                  usersRides={usersRides}
                  refreshUsersRides={this.refreshUsersRides}
                />
              </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
