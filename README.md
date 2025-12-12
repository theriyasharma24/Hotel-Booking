# Hotel Room Reservation System

A smart and interactive room-booking system designed to **allocate hotel rooms optimally** based on distance, availability, and floor layout.

🔗 **Live Demo:** *[https://hotelroomreserve.netlify.app/](https://hotelroomreserve.netlify.app/)*

---

## Project Overview

This project implements a **Hotel Room Reservation System**.
The system simulates a hotel with **10 floors and 97 rooms**, applies travel-time rules, and intelligently books rooms to minimize walking distance for guests.
<p align="center">
  <img src="https://github.com/user-attachments/assets/f50eeb22-ea55-44de-8c4c-0369d169e03a" 
       alt="Hotel Layout"
       width="495" 
       height="386">
</p>

---

## Hotel Structure

### **Floors & Rooms**

* **Floors 1–9:** 10 rooms each (e.g., 101–110, 201–210, …)
* **Floor 10:** 7 rooms (1001–1007)
* Rooms are arranged **left → right**, with the **leftmost room closest to stairs/lift**.

### **Travel Time Rules**

| Movement Type                               | Time                    |
| ------------------------------------------- | ----------------------- |
| Horizontal (between rooms on same floor)    | **1 minute per room**   |
| Vertical (between floors using lift/stairs) | **2 minutes per floor** |

---

## Booking Rules Implemented

1. A single guest can book **1–5 rooms at a time**.
2. System first tries to book **all rooms on the same floor**.
3. If not possible, it finds the **optimal set of rooms that minimize travel time**.
4. When spanning across floors, it chooses rooms with the **minimal combination of vertical + horizontal travel**.

---

## Tech Stack

* **AngularJS (1.8.x)**
* **HTML5**
* **CSS3**
* **JavaScript**

---

## How It Works

1. User enters number of rooms.
2. On clicking **Book**, the algorithm:

   * Converts old selected rooms → occupied
   * Attempts same-floor booking
   * If not available, evaluates **all possible combinations**
   * Calculates travel time using the formula:

```
travelTime = horizontal_distance + (2 × vertical_distance)
```

3. The system selects the **combination with the least travel time**.

---

## How to Run Locally

1. Clone the repository

   ```bash
   git clone [https://github.com/theriyasharma24/Hotel-Booking.git](https://github.com/theriyasharma24/Hotel-Booking.git)
   ```
2. Open the project folder

   ```bash
   cd hotel-booking
   ```
3. Run using any local web server, or simply open `index.html` in a browser.

---

