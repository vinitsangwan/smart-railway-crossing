# CIRCUIT WIRING & HARDWARE SPECIFICATION

## Smart Railway Crossing Warning System Using Digital Logic & Arduino

### 1. Arduino Uno Pin Assignment Table

| Arduino Pin | Component | Hardware Role | Logic Level / Type | Resistor Required |
|---|---|---|---|---|
| **D2** | Pushbutton A | Train Approach Sensor | Active-LOW (INPUT_PULLUP) | Internal 20kΩ pull-up |
| **D3** | Pushbutton B | Crossing Occupancy Sensor | Active-LOW (INPUT_PULLUP) | Internal 20kΩ pull-up |
| **D4** | Pushbutton C | Train Departure Clear Sensor | Active-LOW (INPUT_PULLUP) | Internal 20kΩ pull-up |
| **D5** | Pushbutton D | Emergency Stop / Fault Input | Active-LOW (INPUT_PULLUP) | Internal 20kΩ pull-up |
| **D6** | Red LED 1 | Alternating Warning Flasher 1 | Active-HIGH (OUTPUT) | 220Ω (Current limiting) |
| **D7** | Red LED 2 | Alternating Warning Flasher 2 | Active-HIGH (OUTPUT) | 220Ω (Current limiting) |
| **D8** | Green LED | Safe Highway Status Indicator | Active-HIGH (OUTPUT) | 220Ω (Current limiting) |
| **D9** | Piezo Buzzer | Audible Alarm Siren | Active-HIGH (OUTPUT) | Direct connection to GND |
| **D10** | SG90 Micro Servo | Boom Barrier Gate Actuator | PWM 50Hz (90° Open, 0° Closed)| Common 5V and GND rails |
| **5V** | Servo Power / Vcc | +5.0V DC System Rail | Continuous Power | Direct from Arduino 5V |
| **GND** | Common Ground | 0.0V DC System Ground Rail | Common Reference | Common ground tie |

---

### 2. Discrete 74-Series Integrated Circuits Pinout Reference

For students implementing or examining the pure discrete IC circuit variant:

#### 7408 / 74HC08: Quad 2-Input AND Gate
- Pin 14: Vcc (+5V DC)
- Pin 7: GND (0V)
- Gate 1: Pin 1 (A), Pin 2 (B) -> Pin 3 Output (Y = A · B)
- Gate 2: Pin 4 (A), Pin 5 (B) -> Pin 6 Output (Y = A · B)
- Gate 3: Pin 9 (A), Pin 10 (B) -> Pin 8 Output (Y = A · B)
- Gate 4: Pin 12 (A), Pin 13 (B) -> Pin 11 Output (Y = A · B)

#### 7432 / 74HC32: Quad 2-Input OR Gate
- Pin 14: Vcc (+5V DC)
- Pin 7: GND (0V)
- Gate 1: Pin 1 (A), Pin 2 (B) -> Pin 3 Output (Y = A + B)
- Gate 2: Pin 4 (A), Pin 5 (B) -> Pin 6 Output (Y = A + B)

#### 7404 / 74HC04: Hex Inverter (NOT Gate)
- Pin 14: Vcc (+5V DC)
- Pin 7: GND (0V)
- Inverter 1: Pin 1 (A) -> Pin 2 Output (Y = A')
- Inverter 2: Pin 3 (B) -> Pin 4 Output (Y = B')
- Inverter 3: Pin 5 (D) -> Pin 6 Output (Y = D')

#### 7474 / 74HC74: Dual D-Type Flip-Flop with Set and Reset
- Pin 14: Vcc (+5V DC)
- Pin 7: GND (0V)
- FF1: Pin 1 (CLR'), Pin 2 (D), Pin 3 (CLK), Pin 4 (PRE'), Pin 5 (Q), Pin 6 (Q')
- FF2: Pin 13 (CLR'), Pin 12 (D), Pin 11 (CLK), Pin 10 (PRE'), Pin 9 (Q), Pin 8 (Q')
