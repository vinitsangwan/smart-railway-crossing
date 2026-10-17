/* ============================================================================
 * SMART RAILWAY CROSSING WARNING SYSTEM USING DIGITAL LOGIC AND ARDUINO
 * Digital Electronics and Logic Design (DELD) & Embedded Systems Project
 *
 * Microcontroller: Arduino Uno (ATmega328P)
 * Clock Speed: 16 MHz | Operating Voltage: 5V
 *
 * DIGITAL LOGIC FORMULAS:
 *   W = A + B + D           (Warning Request: Approach OR Occupied OR Emergency)
 *   G = A + B + D           (Gate-Close Request: Approach OR Occupied OR Emergency)
 *   O = C · A' · B' · D'    (Safe-to-Open Request: Clear AND NOT Approach AND NOT Occupied AND NOT Emergency)
 *
 * SEQUENTIAL CONTROLLER FSM:
 *   States: IDLE (0), APPROACHING (1), CLOSING (2), CROSSING_OCCUPIED (3),
 *           CLEARING (4), OPENING (5), EMERGENCY (6)
 * ============================================================================ */

#include <Servo.h>

// ----------------------------------------------------------------------------
// PIN ASSIGNMENT TABLE
// ----------------------------------------------------------------------------
const uint8_t PIN_SENSOR_A    = 2;   // Input: Approach Sensor A (Active-HIGH with pull-down or active-LOW with pull-up)
const uint8_t PIN_SENSOR_B    = 3;   // Input: Crossing Occupied Sensor B
const uint8_t PIN_SENSOR_C    = 4;   // Input: Crossing Clear Sensor C
const uint8_t PIN_EMERGENCY_D = 5;   // Input: Emergency / Fault Switch D
const uint8_t PIN_RED_LED1    = 6;   // Output: Warning Flasher Red LED 1 (via 220Ω)
const uint8_t PIN_RED_LED2    = 7;   // Output: Warning Flasher Red LED 2 (via 220Ω)
const uint8_t PIN_GREEN_LED   = 8;   // Output: Safe / Clear Green LED (via 220Ω)
const uint8_t PIN_BUZZER      = 9;   // Output: Active Buzzer Alarm
const uint8_t PIN_SERVO       = 10;  // Output: Barrier Servo Motor (PWM)

// ----------------------------------------------------------------------------
// CONFIGURATION CONSTANTS
// ----------------------------------------------------------------------------
// Set to true if push buttons use internal pull-ups (Pressed = LOW = Active)
// Set to false if push buttons / sensors have external pull-down resistors (Pressed = HIGH = Active)
const bool INPUTS_ACTIVE_LOW = true; 

const unsigned long DEBOUNCE_DELAY_MS   = 40;    // Switch debounce time
const unsigned long FLASHER_INTERVAL_MS = 400;   // Alternating LED flash rate
const unsigned long WARNING_HOLD_MS     = 3000;  // Pre-closing warning advance interval
const unsigned long CLEAR_HOLD_MS       = 2000;  // Safe buffer interval after clear sensor
const unsigned long SERVO_STEP_DELAY_MS = 20;    // Servo smooth motion step interval

const int SERVO_OPEN_ANGLE   = 90;  // Vertical barrier: road open
const int SERVO_CLOSED_ANGLE = 0;   // Horizontal barrier: road blocked

// ----------------------------------------------------------------------------
// STATE DEFINITIONS
// ----------------------------------------------------------------------------
enum SystemState {
  STATE_IDLE = 0,
  STATE_APPROACHING = 1,
  STATE_CLOSING = 2,
  STATE_CROSSING_OCCUPIED = 3,
  STATE_CLEARING = 4,
  STATE_OPENING = 5,
  STATE_EMERGENCY = 6
};

// ----------------------------------------------------------------------------
// GLOBAL HARDWARE & TIMING VARIABLES
// ----------------------------------------------------------------------------
Servo barrierServo;

// Debounced raw sensor variables (1 = active, 0 = inactive)
uint8_t rawA = 0, rawB = 0, rawC = 0, rawD = 0;
uint8_t debouncedA = 0, debouncedB = 0, debouncedC = 0, debouncedD = 0;

// DELD Evaluated Boolean outputs
uint8_t boolW = 0; // Warning Request
uint8_t boolG = 0; // Gate-Close Request
uint8_t boolO = 0; // Safe-to-Open Request

// Controller FSM State
SystemState currentState = STATE_IDLE;
SystemState previousState = STATE_IDLE;

// Timing counters (non-blocking millis)
unsigned long lastFlasherTime   = 0;
unsigned long stateTimerStart   = 0;
unsigned long lastServoStepTime = 0;
bool flasherPhase               = false;
int currentServoAngle           = 90;
int targetServoAngle            = 90;

// Sensor debounce trackers
unsigned long lastDebounceTimeA = 0;
unsigned long lastDebounceTimeB = 0;
unsigned long lastDebounceTimeC = 0;
unsigned long lastDebounceTimeD = 0;
uint8_t lastReadingA = 0, lastReadingB = 0, lastReadingC = 0, lastReadingD = 0;

// ----------------------------------------------------------------------------
// FUNCTION DECLARATIONS
// ----------------------------------------------------------------------------
void readAndDebounceInputs();
void evaluateBooleanLogic();
void updateStateMachine();
void driveOutputs();
void logTelemetry();
const char* getStateName(SystemState s);

// ----------------------------------------------------------------------------
// SETUP
// ----------------------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  while (!Serial && millis() < 1000); // Allow USB serial to initialize

  // Initialize Inputs
  if (INPUTS_ACTIVE_LOW) {
    pinMode(PIN_SENSOR_A, INPUT_PULLUP);
    pinMode(PIN_SENSOR_B, INPUT_PULLUP);
    pinMode(PIN_SENSOR_C, INPUT_PULLUP);
    pinMode(PIN_EMERGENCY_D, INPUT_PULLUP);
  } else {
    pinMode(PIN_SENSOR_A, INPUT);
    pinMode(PIN_SENSOR_B, INPUT);
    pinMode(PIN_SENSOR_C, INPUT);
    pinMode(PIN_EMERGENCY_D, INPUT);
  }

  // Initialize Outputs
  pinMode(PIN_RED_LED1, OUTPUT);
  pinMode(PIN_RED_LED2, OUTPUT);
  pinMode(PIN_GREEN_LED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);

  // Attach Servo
  barrierServo.attach(PIN_SERVO);
  currentServoAngle = SERVO_OPEN_ANGLE;
  targetServoAngle = SERVO_OPEN_ANGLE;
  barrierServo.write(currentServoAngle);

  // Initial Safe Outputs
  digitalWrite(PIN_RED_LED1, LOW);
  digitalWrite(PIN_RED_LED2, LOW);
  digitalWrite(PIN_GREEN_LED, HIGH); // Safe indicator
  digitalWrite(PIN_BUZZER, LOW);

  Serial.println(F("======================================================"));
  Serial.println(F(" SMART RAILWAY CROSSING WARNING LOGIC CONTROLLER"));
  Serial.println(F(" Subject: DELD College Mini-Project"));
  Serial.println(F(" Architecture: Boolean Logic Engine + Clocked FSM"));
  Serial.println(F("======================================================"));
}

// ----------------------------------------------------------------------------
// MAIN LOOP
// ----------------------------------------------------------------------------
void loop() {
  // 1. Read and debounce physical pushbuttons / sensors
  readAndDebounceInputs();

  // 2. Evaluate combinational Boolean logic expressions
  evaluateBooleanLogic();

  // 3. Clocked update of the Sequential Finite-State Machine
  updateStateMachine();

  // 4. Drive physical actuator outputs (LEDs, Buzzer, Servo)
  driveOutputs();

  // 5. Periodic status logging over Serial (every 500ms)
  static unsigned long lastLog = 0;
  if (millis() - lastLog >= 500) {
    lastLog = millis();
    logTelemetry();
  }
}

// ----------------------------------------------------------------------------
// 1. SENSOR READING & DEBOUNCING
// ----------------------------------------------------------------------------
void readAndDebounceInputs() {
  uint8_t readA = digitalRead(PIN_SENSOR_A);
  uint8_t readB = digitalRead(PIN_SENSOR_B);
  uint8_t readC = digitalRead(PIN_SENSOR_C);
  uint8_t readD = digitalRead(PIN_EMERGENCY_D);

  if (INPUTS_ACTIVE_LOW) {
    readA = !readA;
    readB = !readB;
    readC = !readC;
    readD = !readD;
  }

  unsigned long currentMillis = millis();

  // Debounce Sensor A
  if (readA != lastReadingA) lastDebounceTimeA = currentMillis;
  if ((currentMillis - lastDebounceTimeA) > DEBOUNCE_DELAY_MS) {
    debouncedA = readA;
  }
  lastReadingA = readA;

  // Debounce Sensor B
  if (readB != lastReadingB) lastDebounceTimeB = currentMillis;
  if ((currentMillis - lastDebounceTimeB) > DEBOUNCE_DELAY_MS) {
    debouncedB = readB;
  }
  lastReadingB = readB;

  // Debounce Sensor C
  if (readC != lastReadingC) lastDebounceTimeC = currentMillis;
  if ((currentMillis - lastDebounceTimeC) > DEBOUNCE_DELAY_MS) {
    debouncedC = readC;
  }
  lastReadingC = readC;

  // Debounce Emergency Sensor D
  if (readD != lastReadingD) lastDebounceTimeD = currentMillis;
  if ((currentMillis - lastDebounceTimeD) > DEBOUNCE_DELAY_MS) {
    debouncedD = readD;
  }
  lastReadingD = readD;
}

// ----------------------------------------------------------------------------
// 2. BOOLEAN LOGIC EVALUATION
// ----------------------------------------------------------------------------
void evaluateBooleanLogic() {
  uint8_t notA = !debouncedA;
  uint8_t notB = !debouncedB;
  uint8_t notD = !debouncedD;

  // DELD Teaching Equations:
  // W = A + B + D
  boolW = (debouncedA || debouncedB || debouncedD) ? 1 : 0;

  // G = A + B + D
  boolG = (debouncedA || debouncedB || debouncedD) ? 1 : 0;

  // O = C · A' · B' · D'
  boolO = (debouncedC && notA && notB && notD) ? 1 : 0;
}

// ----------------------------------------------------------------------------
// 3. SEQUENTIAL FINITE-STATE MACHINE
// ----------------------------------------------------------------------------
void updateStateMachine() {
  unsigned long now = millis();

  // Fail-Safe Emergency Interlock has top priority
  if (debouncedD == 1) {
    if (currentState != STATE_EMERGENCY) {
      previousState = currentState;
      currentState = STATE_EMERGENCY;
      targetServoAngle = SERVO_CLOSED_ANGLE;
      Serial.println(F("[ALERT] EMERGENCY line asserted. System locked in fail-safe."));
    }
    return;
  }

  switch (currentState) {
    case STATE_IDLE:
      targetServoAngle = SERVO_OPEN_ANGLE;
      if (debouncedA == 1) {
        currentState = STATE_APPROACHING;
        stateTimerStart = now;
        Serial.println(F("[FSM] IDLE -> APPROACHING: Train detected at sensor A."));
      } else if (debouncedB == 1) {
        // Direct occupancy without prior approach detection
        currentState = STATE_CLOSING;
        targetServoAngle = SERVO_CLOSED_ANGLE;
        Serial.println(F("[FSM] IDLE -> CLOSING: Unexpected occupancy at sensor B."));
      }
      break;

    case STATE_APPROACHING:
      // Pre-warning flasher sound interval before motor actuation
      if ((now - stateTimerStart >= WARNING_HOLD_MS) || debouncedB == 1) {
        currentState = STATE_CLOSING;
        targetServoAngle = SERVO_CLOSED_ANGLE;
        Serial.println(F("[FSM] APPROACHING -> CLOSING: Warning interval complete. Lowering barrier."));
      }
      break;

    case STATE_CLOSING:
      if (currentServoAngle <= SERVO_CLOSED_ANGLE) {
        if (debouncedB == 1) {
          currentState = STATE_CROSSING_OCCUPIED;
          Serial.println(F("[FSM] CLOSING -> CROSSING_OCCUPIED: Barrier fully closed. Train at crossing."));
        }
      }
      break;

    case STATE_CROSSING_OCCUPIED:
      // Train is traversing crossing
      if (debouncedB == 0 && debouncedC == 1) {
        currentState = STATE_CLEARING;
        stateTimerStart = now;
        Serial.println(F("[FSM] CROSSING_OCCUPIED -> CLEARING: Center clear, exit sensor tripped."));
      }
      break;

    case STATE_CLEARING:
      // Must satisfy Safe-to-Open equation O = C · A' · B' · D' AND buffer timer
      if (boolO == 1) {
        if (now - stateTimerStart >= CLEAR_HOLD_MS) {
          currentState = STATE_OPENING;
          targetServoAngle = SERVO_OPEN_ANGLE;
          Serial.println(F("[FSM] CLEARING -> OPENING: Safe-to-Open verified. Raising barrier."));
        }
      } else {
        // Safe conditions invalidated (e.g. second train approaching)
        if (debouncedA == 1 || debouncedB == 1) {
          currentState = STATE_CLOSING;
          targetServoAngle = SERVO_CLOSED_ANGLE;
          Serial.println(F("[FSM] CLEARING -> CLOSING: Abort opening, track occupied again!"));
        }
      }
      break;

    case STATE_OPENING:
      if (currentServoAngle >= SERVO_OPEN_ANGLE) {
        currentState = STATE_IDLE;
        Serial.println(F("[FSM] OPENING -> IDLE: Barrier fully vertical. Normal operations restored."));
      }
      break;

    case STATE_EMERGENCY:
      // Recovery only allowed when emergency line released (D=0) and manual verification
      if (debouncedD == 0) {
        if (debouncedA == 0 && debouncedB == 0) {
          currentState = STATE_OPENING;
          targetServoAngle = SERVO_OPEN_ANGLE;
          Serial.println(F("[FSM] EMERGENCY -> OPENING: Emergency released, track clear. Safe recovery."));
        }
      }
      break;
  }
}

// ----------------------------------------------------------------------------
// 4. ACTUATOR & OUTPUT DRIVE
// ----------------------------------------------------------------------------
void driveOutputs() {
  unsigned long now = millis();

  // A. Warning Flashers (Alternating Red LEDs) and Buzzer
  bool warningsActive = (currentState == STATE_APPROACHING ||
                         currentState == STATE_CLOSING ||
                         currentState == STATE_CROSSING_OCCUPIED ||
                         currentState == STATE_CLEARING ||
                         currentState == STATE_EMERGENCY);

  if (warningsActive) {
    if (now - lastFlasherTime >= FLASHER_INTERVAL_MS) {
      lastFlasherTime = now;
      flasherPhase = !flasherPhase;
    }

    // Alternating flash: LED1 and LED2 out of phase
    digitalWrite(PIN_RED_LED1, flasherPhase ? HIGH : LOW);
    digitalWrite(PIN_RED_LED2, flasherPhase ? LOW : HIGH);
    digitalWrite(PIN_GREEN_LED, LOW);
    digitalWrite(PIN_BUZZER, HIGH); // Alarm active
  } else {
    // Roadway safe
    digitalWrite(PIN_RED_LED1, LOW);
    digitalWrite(PIN_RED_LED2, LOW);
    digitalWrite(PIN_GREEN_LED, HIGH); // Green safe indicator on
    digitalWrite(PIN_BUZZER, LOW);
  }

  // B. Smooth Barrier Servo Motion
  if (now - lastServoStepTime >= SERVO_STEP_DELAY_MS) {
    lastServoStepTime = now;
    if (currentServoAngle < targetServoAngle) {
      currentServoAngle++;
      barrierServo.write(currentServoAngle);
    } else if (currentServoAngle > targetServoAngle) {
      currentServoAngle--;
      barrierServo.write(currentServoAngle);
    }
  }
}

// ----------------------------------------------------------------------------
// 5. SERIAL TELEMETRY & DIAGNOSTICS
// ----------------------------------------------------------------------------
void logTelemetry() {
  Serial.print(F("{\"time\":"));
  Serial.print(millis());
  Serial.print(F(",\"state\":\""));
  Serial.print(getStateName(currentState));
  Serial.print(F("\",\"sensors\":{\"A\":"));
  Serial.print(debouncedA);
  Serial.print(F(",\"B\":"));
  Serial.print(debouncedB);
  Serial.print(F(",\"C\":"));
  Serial.print(debouncedC);
  Serial.print(F(",\"D\":"));
  Serial.print(debouncedD);
  Serial.print(F("},\"logic\":{\"W\":"));
  Serial.print(boolW);
  Serial.print(F(",\"G\":"));
  Serial.print(boolG);
  Serial.print(F(",\"O\":"));
  Serial.print(boolO);
  Serial.print(F("},\"servoAngle\":"));
  Serial.print(currentServoAngle);
  Serial.println(F("}"));
}

const char* getStateName(SystemState s) {
  switch (s) {
    case STATE_IDLE: return "IDLE";
    case STATE_APPROACHING: return "APPROACHING";
    case STATE_CLOSING: return "CLOSING";
    case STATE_CROSSING_OCCUPIED: return "CROSSING_OCCUPIED";
    case STATE_CLEARING: return "CLEARING";
    case STATE_OPENING: return "OPENING";
    case STATE_EMERGENCY: return "EMERGENCY";
    default: return "UNKNOWN";
  }
}
