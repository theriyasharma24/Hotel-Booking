var app = angular.module("hotelApp", ["ngSanitize"]);
app.controller("MainCtrl", function ($scope) {
  //handle error popup
  $scope.showError = false;
  $scope.showPopup = (title, message) => {
    $scope.errorTitle = title;
    $scope.errorMessage = message;
    $scope.showError = true;
  };
  $scope.closeError = () => ($scope.showError = false);

  //creates rooms structure
  const createRooms = () => {
    const floors = [];

    //floors 1–9 (10 rooms each)
    for (let f = 1; f <= 9; f++) {
      floors.push({
        floor: f,
        rooms: Array.from({ length: 10 }, (_, i) => f * 100 + (i + 1)),
      });
    }
    //floor 10 (7 rooms)
    floors.push({
      floor: 10,
      rooms: [1001, 1002, 1003, 1004, 1005, 1006, 1007],
    });
    return floors;
  };
  $scope.floors = createRooms();

  //room status map
  $scope.status = Object.fromEntries(
    $scope.floors.flatMap((floorObj) =>
      floorObj.rooms.map((room) => [room, "available"])
    )
  );

  //booking logic of rooms
  $scope.bookRooms = function () {
    let count = $scope.roomsToBook;
    // Convert previously selected to occupied
    Object.keys($scope.status).forEach((r) => {
      if ($scope.status[r] === "selected") $scope.status[r] = "occupied";
    });

    //validation
    if (!count || count < 1 || count > 5) {
      return $scope.showPopup(
        "Limit Exceeded",
        "You can book a maximum of <strong>5 rooms</strong> at a time."
      );
    }

    //try same-floor booking
    let same = findSameFloor(count);
    if (same) return markSelected(same);

    //try multi-floor optimized booking
    let best = findOptimalRooms(count);
    if (best) return markSelected(best);

    //no rooms available
    $scope.showPopup(
      "No Rooms Available",
      "Sorry, there are not enough available rooms to complete your booking."
    );
  };

  const markSelected = (rooms) =>
    rooms.forEach((r) => ($scope.status[r] = "selected"));

  const getAvailableRooms = () =>
    $scope.floors.flatMap((f) =>
      f.rooms
        .filter((r) => $scope.status[r] === "available")
        .map((r) => ({
          room: r,
          floor: f.floor,
          position: parseInt(r.toString().slice(-2)) - 1,
        }))
    );

  //same-floor booking
  const findSameFloor = (count) => {
    for (let f of $scope.floors) {
      const available = f.rooms.filter((r) => $scope.status[r] === "available");
      if (available.length >= count) return available.slice(0, count);
    }
    return null;
  };

  //multi-floor booking
  const findOptimalRooms = (count) => {
    const available = getAvailableRooms();
    if (available.length < count) return null;

    let bestSet = null;
    let bestTime = Infinity;

    const choose = (start, combo) => {
      if (combo.length === count) {
        const t = travelTime(combo);
        if (t < bestTime) {
          bestTime = t;
          bestSet = combo.map((r) => r.room);
        }
        return;
      }

      for (let i = start; i < available.length; i++) {
        choose(i + 1, [...combo, available[i]]);
      }
    };

    choose(0, []);
    return bestSet;
  };

  //calculate travel time for a set of rooms
  const travelTime = (rooms) => {
    const positions = rooms.map((r) => r.position);
    const floors = rooms.map((r) => r.floor);
    return (
      Math.max(...positions) -
      Math.min(...positions) +
      2 * (Math.max(...floors) - Math.min(...floors))
    );
  };

  //reset room statuses
  $scope.reset = function () {
    Object.keys($scope.status).forEach((r) => ($scope.status[r] = "available"));
    $scope.roomsToBook = null;
  };

  //randomly occupy 30% rooms
  $scope.randomize = function () {
    $scope.reset();
    Object.keys($scope.status).forEach((r) => {
      if (Math.random() < 0.3) $scope.status[r] = "occupied";
    });
  };
});
