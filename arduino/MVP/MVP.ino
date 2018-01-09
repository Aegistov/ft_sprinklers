#include <Time.h>
#include <TimeLib.h>
#include <ArduinoSTL.h>
#include <LinkedList.h>
#include <WiFi101.h>
#include <ArduinoJson.h>
#include <SPI.h>

//#define WIFI_SSID    "42US Guests"
//#define WIFI_PASSWORD "42Events"
#define WIFI_SSID    "Bambi"
#define WIFI_PASSWORD "1234567890"

#define FIREBASE_HOST "sprink-3680f.firebaseio.com"
#define FIREBASE_AUTH "aAxhPEhI5yKEcsQJ1AXjufYehiZ7Nm0RwdpCCBIn"
/* #define FIREBASE_AUTH "AIzaSyB3RZQS46cqoVGDwvTVlih6N01LRD3atRY" */

/* #define FIREBASE_HOST  "ft-sprinklers.firebaseio.com" */
/* #define FIREBASE_AUTH  "AIzaSyAiPg4F4t0kVQ4AqLZISYeJhOlQ8yf15pw" */

#define SCHEDULE_PATH "/programSchedule.json"
#define OVERIDE_PATH  "/manualOverride.json"
#define PATH      "/.json"

#define LATCHPIN    3
#define CLOCKPIN    4
#define DATAPIN     5
#define REGISTERCOUNT 2 //Moteino IOShield has 2 daisy chained registers, if you have more adjust this number
#define LED       9 //pin connected to onboard LED
#define SERIAL_BAUD   115200
#define SERIAL_EN   //comment out if you don't want any serial output

#ifdef SERIAL_EN
#define DEBUG(input)   Serial.print(input)
#define DEBUGln(input) Serial.println(input)
#else
#define DEBUG(input)
#define DEBUGln(input)
#endif
#define SCHEDULE_PATH "/programSchedule.json"
#define OVERIDE_PATH  "/manualOverride.json"
#define PATH      "/.json"

#define LATCHPIN    3
#define CLOCKPIN    4
#define DATAPIN     5
#define REGISTERCOUNT 2 //Moteino IOShield has 2 daisy chained registers, if you have more adjust this number
#define LED       9 //pin connected to onboard LED
#define SERIAL_BAUD   115200
#define SERIAL_EN   //comment out if you don't want any serial output

#ifdef SERIAL_EN
#define DEBUG(input)   Serial.print(input)
#define DEBUGln(input) Serial.println(input)
#else
#define DEBUG(input)
#define DEBUGln(input)
#endif

WiFiSSLClient client;
unsigned long lastConnectionTime = 0;
const unsigned long postingInterval = 60L * 1000L; //60 seconds
int status = WL_IDLE_STATUS;

/* moteino */
byte programZone[7][32]; //used to store program data
unsigned int programSeconds[7][32]; //used to store program data
byte programLength = 0; //how many zones in this program
byte programPointer = 0; //keeps track of active zone (when >=0)
unsigned long programZoneStart = 0;
unsigned int seconds = 0;
byte whichZone;
//LinkedList<JsonObject> test;


/******************************************************/
/**              funtion prototypes                  **/
/******************************************************/
void setup();
void connectWiFi();
void printWifiStatus();
void httpRequest();
void httpStream();
String getResponse();
String getPath(String streamEvent);
boolean getStatus(String streamEvent);
byte getZone(String path);
void loop();
void printMacAddress();
void listNetworks();
void printEncryptionType(int thisType);
void zonesOFF();
void zoneON(byte which);
void registersClear();
void registersAllOn();
void registersWriteBit(byte whichPin);
void registerWriteBytes(const void* buffer, byte byteCount);
void Blink(byte PIN, byte DELAY_MS);
String getData(String streamEvent);
boolean boolstring( String b );
std::vector<JsonVariant> loadJson(String src);
void  writeToRegisters(byte *selectedPins);

void setup()
{
  Serial.begin(SERIAL_BAUD);
  pinMode(LATCHPIN, OUTPUT);
  pinMode(DATAPIN, OUTPUT);
  pinMode(CLOCKPIN, OUTPUT);
  pinMode(LED, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial connection
  }

  // check for the presence of the shield:
  if (WiFi.status() == WL_NO_SHIELD) {
    DEBUGln("WiFi shield not present");
    // don't continue:
    while (true);
  }

  // Print WiFi MAC address:
  printMacAddress();

  // scan for existing networks:
  DEBUGln("Scanning available networks...");
  listNetworks();
  /* std::vector<JsonVariant> progSchedule = loadJson(data); */
  /* DEBUGln("Week Day: "); */
  /* Serial.println(weekday()); */
  /* runSchedule(progSchedule); */
  connectWiFi();
  /* httpRequest(); */
  httpStream();
}

void connectWiFi()
{
  DEBUGln("Connecting to WiFi");
  while (status != WL_CONNECTED) {
    status = WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    delay(1000);
    DEBUG(".");
  }
  DEBUGln();
  DEBUG("connected: ");
  printWifiStatus();
}

void printWifiStatus()
{
  // print the SSID of the network you're attached to:
  DEBUG("SSID: ");
  DEBUGln(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  DEBUG("IP Address: ");
  DEBUGln(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  DEBUG("signal strength (RSSI):");
  DEBUG(rssi);
  DEBUGln(" dBm");
}

void httpRequest()
{
  /* close any connection before send a new request. */
  client.stop();

  DEBUGln("Connecting to Firebase httpRequest()...");
  client.connect(FIREBASE_HOST, 443);
  if (client.connected()) {
    DEBUGln("connected to Firebase");
    client.println("GET " SCHEDULE_PATH "?auth=" FIREBASE_AUTH " HTTP/1.1");
    client.println("Host: " FIREBASE_HOST);
    client.println("Connection: close");
    client.println();
    lastConnectionTime = millis();
  }
  else {
    DEBUGln("Error connecting to Firebase");
  }
  /* DEBUGln(getResponse()); */
}

void httpStream()
{
  /* close any connection before send a new request. */
  client.stop();

  DEBUGln("Connecting to Firebase httpStream()...");
  client.connect(FIREBASE_HOST, 443);
  if (client.connected()) {
    DEBUGln("connected to Firebase");
    /* client.println("GET " OVERIDE_PATH "?auth=" FIREBASE_AUTH " HTTP/1.1"); */
    client.println("GET " PATH "?auth=" FIREBASE_AUTH " HTTP/1.1");
    client.println("Host: " FIREBASE_HOST);
    client.println("Accept: text/event-stream");
    client.println("Connection: keep-alive");
    client.println();
  }
  else {
    DEBUGln("Error connecting to Firebase");
  }
}

void   runSchedule(std::vector<JsonVariant> schedule)
{
  String today = "0";
  today += String(weekday());
  DEBUGln(today);
  std::vector<byte> zones;
  for (int i = 0; i < 1; i++)
  {
    today = "0";
    today += String(i);
    DEBUGln(today);
    for (int i = 0; i < schedule.size() - 1; i++)
    {
      if (schedule[i][today]["duration"] > 0)
      {
        DEBUGln("This zone is active today!");
        int t = schedule[i][today]["duration"];
        Serial.println(i);
        Serial.println(t);
        /* zones.push_back(i + 1); */
        zoneON(byte(i));
        //registerWriteBytes((void *)i, 1);
		    delay(2000);
      }
      //registersWrite((byte)i);
    }
    /* writeToRegisters(zones); */
  }
	zonesOFF();
  //byte  testStream[5] = {1, 3, 5, 7, 9};
  //registersWrite(1 - 1);
  //registersWrite(2 - 1);
  //  registersWrite(3 - 1);
}

String getResponse()
{
  delay(1000);
  int readSize = client.available();
  String result = "";
  while (client.available()) {
    char c = client.read();
    result += c;
  }
  /* DEBUG(result); */
  return (result);
}

String getPath(String streamEvent)
{
  StaticJsonBuffer<200> jsonBuffer;
  streamEvent = streamEvent.substring(19); // extract json object
  JsonObject& root = jsonBuffer.parseObject(streamEvent);
  if (!root.success())
  {
    DEBUGln("parsingObject() failed");
    return "";
  }
  String path = root["path"];
  DEBUG("path is:");
  DEBUGln(path);
  return (path);
}

String getData(String streamEvent)
{
  StaticJsonBuffer<200> jsonBuffer;
  streamEvent = streamEvent.substring(19); // extract json object
  JsonObject& root = jsonBuffer.parseObject(streamEvent);
  if (!root.success())
  {
    DEBUGln("parsingObject() failed");
    return "";
  }
  String dat = root["data"];
  DEBUG("data is:");
  DEBUGln(dat);
  return (dat);
}

std::vector<JsonVariant> loadJson(String src)
{
  const size_t              bufferSize = 8 * JSON_OBJECT_SIZE(1) + JSON_OBJECT_SIZE(7) + 130;
  DynamicJsonBuffer         jsonBuffer(bufferSize);
  std::vector<JsonVariant>  vec;
  int                       zone = 0;
  String                    zoneDays = "";
  String                    key = "";
  int                       start = src.indexOf("z") - 1;
  int                       terminator = src.indexOf("}},") + 2;

  while (start < src.length())
  {
    zoneDays = "{";
    zoneDays += src.substring(start, terminator);
    zoneDays += "}";
    DEBUG("Zone: ");
    DEBUGln(zoneDays);
    key = src.substring(start + 1, start + 4);
    DEBUGln("Key");
    DEBUGln(key);
    JsonObject& root = jsonBuffer.parseObject(zoneDays);
    if (!root.success())
    {
      DEBUGln("parsingObject() failed");
    }
    else {
      DEBUGln("Success");
      if (root.containsKey(key))
      {
        DEBUGln("Contains key");
        JsonVariant z00 = root[key];
        DEBUGln("Accessing Object");
        int t = z00["00"]["duration"];
        Serial.println(t);
        DEBUG("Vec Size: ");
        Serial.println(vec.size());
        vec.push_back(z00);
        DEBUG("Vec Size POST: ");
        Serial.println(vec.size());
        int z00_00_duration = vec[0]["00"]["duration"];
        Serial.println(z00_00_duration);
      }
      else
        DEBUGln("Key Not Found");
    }
    DEBUGln("Start and Terminator");
    DEBUGln(start);
    DEBUGln(terminator);
    if (start == src.indexOf("z23", terminator) - 1)
      break;
    start = src.indexOf("z", terminator) - 1;
    terminator = src.indexOf("}},", start) + 2;
    DEBUGln("Start and Terminator");
    DEBUGln(start);
    DEBUGln(terminator);
  }
  return (vec);
}

const char *getSchedule(String result)
{
  DEBUGln("result is:");
  DEBUGln(result);
  String test = result;
  //test.replace("\"", "'");
  DEBUGln("New Result: ");
  DEBUGln(test);
  DEBUG("SubString: ");
  String programSchedule = test.substring(19, (test.indexOf("z14") - 2));
  //programSchedule += "}";
  DEBUGln(programSchedule);
  String zoneDays = "{";
  zoneDays += programSchedule.substring(programSchedule.indexOf("z") - 1, programSchedule.indexOf("}},") + 2);
  zoneDays += "}";
  DEBUG("program before");
  DEBUGln(programSchedule);
  String testing = "{";
  testing += programSchedule.substring(programSchedule.indexOf("}},") + 3, programSchedule.length() - (programSchedule.indexOf("}},") + 1));
  DEBUG("program after");
  DEBUGln(testing);
  String tmp = "";
  for (int i = 0; i < 10; i++) {
    tmp += "{";
    tmp += testing.substring(testing.indexOf("}},") + 3, testing.length() - (testing.indexOf("}},") + 1));
    //DEBUGln(tmp);
    std::swap(testing, tmp);
    //DEBUG("program after");
    DEBUGln(testing);
  }
  loadJson(programSchedule);
  DEBUG("One Zone: ");
  DEBUGln(zoneDays);
  //FAILS ON THIS SIZE
  const size_t bufferSizeFail = 113 * JSON_OBJECT_SIZE(1) + 16 * JSON_OBJECT_SIZE(7) + JSON_OBJECT_SIZE(16) + 1960;
  DEBUG("bufferSizeFail: ");
  DEBUGln(bufferSizeFail);
  //FAILS ON SIZE ABOVE

  String zone = "{\"z00\":{\"00\":{\"duration\":50},\"01\":{\"duration\":60},\"02\":{\"duration\":60},\"03\":{\"duration\":60},\"04\":{\"duration\":60},\"05\":{\"duration\":60},\"06\":{\"duration\":60}}}";
  const size_t bufferSize = 8 * JSON_OBJECT_SIZE(1) + JSON_OBJECT_SIZE(7) + 130;
  DynamicJsonBuffer jsonBuffer(bufferSize);

  const char* json = "{\"z00\":{\"00\":{\"duration\":50},\"01\":{\"duration\":60},\"02\":{\"duration\":60},\"03\":{\"duration\":60},\"04\":{\"duration\":60},\"05\":{\"duration\":60},\"06\":{\"duration\":60}}}";

  JsonObject& root = jsonBuffer.parseObject(zoneDays);
  if (!root.success())
  {
    DEBUGln("parsingObject() failed");
  }
  else {
    DEBUGln("Success");
  }
  std::vector<JsonVariant> vec;
  JsonVariant z00 = root["z00"];
  DEBUG("Vec Size: ");
  Serial.println(vec.size());
  vec.push_back(z00);
  DEBUG("Vec Size POST: ");
  Serial.println(vec.size());
  int z00_00_duration = vec[0]["00"]["duration"];
  Serial.println(z00_00_duration);
  DEBUG("Printing vec element: ");
  const char* program = "";
  DEBUG("Duration is:");
  //  DEBUGln(t);
  return (program);
}

boolean getStatus(String streamEvent)
{
  StaticJsonBuffer<200> jsonBuffer;
  streamEvent = streamEvent.substring(19);// extract json object
  DEBUGln(streamEvent);
  JsonObject& root = jsonBuffer.parseObject(streamEvent);
  if (!root.success())
  {
    DEBUGln("parsingObject() failed");
    return "";
  }
  boolean dat = root["data"]["active"];
  DEBUG("status is:");
  DEBUGln(dat);
  return (dat);
}

byte getZone(String path)
{
  int first = path.indexOf('/');
  int second = path.indexOf('/', first + 1);
  if (path.indexOf("z") != -1 )
    whichZone = path.substring(path.indexOf("z") + 1).toInt();
  return (whichZone);
}

String response = "";
String result = "";
void loop()
{
  response = getResponse();
  if (response.startsWith("event: patch"))
  {
    result += response;
    DEBUGln("patching!");
    if (result.indexOf("manualOverride") != -1)
    {
      String path = getPath(result);
      String zone = path.substring(path.indexOf("manualOverride" + 14)); //trim off manualOverride
      Serial.println(zone);
      boolean active = getStatus(result); //get zone number from zone name: (i.e z00)
      whichZone = getZone(zone);
      if (!active)
      {
        DEBUG("Turning OFF Zone: ");
        DEBUGln(whichZone);
        zonesOFF();
      }
      else if (whichZone > 0) {
        DEBUG("Turning on Zone: ");
        DEBUGln(whichZone);
        zoneON(whichZone - 1);
      }
      else {
        DEBUGln("Invalid ON");
      }
    }
    else if (result.indexOf("programSchedule") != -1)
    {
      DEBUGln("handle change in schedule");
    }
    result = "";
  }
  /* else if (result.startsWith("event: put")) */
  else if (response.indexOf("event: put") != -1)
  {
    int start = response.indexOf("event: put");
    result += response.substring(start + 11);
  }
  else if (result.startsWith("event: keep-alive"))
  {
    DEBUGln(result);
    result = "";
  }
  else if (response.length() > 0)
  {
    DEBUGln("Collecting response...");
    result += response;
	DEBUGln(response);
  }
  else if (result.startsWith("data"))
  {
    DEBUGln("Work with schedule");
    result = result.substring(6);
    result.trim();
    String programSchedule = "{" + result.substring((result.indexOf("programSchedule") - 1), (result.indexOf("sensorHistory") - 2)) + "}";
	DEBUGln(programSchedule);
	std::vector<JsonVariant> progSchedule = loadJson(programSchedule);
	runSchedule(progSchedule);
  }
  /* if (!client.connected()){ */
  /*  DEBUGln(); */
  /*  DEBUGln("disconnecting from server."); */
  /*  client.stop(); */
  /* } */

  /* if (millis() - lastConnectionTime > postingInterval){ */
  /* DEBUGln("updating"); */
  /* httpRequest(); */
  /* httpStream(); */
  /* } */
}

void printMacAddress()
{
  // the MAC address of your Wifi shield
  byte mac[6];

  // print your MAC address:
  WiFi.macAddress(mac);
  Serial.print("MAC: ");
  Serial.print(mac[5], HEX);
  Serial.print(":");
  Serial.print(mac[4], HEX);
  Serial.print(":");
  Serial.print(mac[3], HEX);
  Serial.print(":");
  Serial.print(mac[2], HEX);
  Serial.print(":");
  Serial.print(mac[1], HEX);
  Serial.print(":");
  Serial.println(mac[0], HEX);
}

void listNetworks()
{
  // scan for nearby networks:
  DEBUGln("** Scan Networks **");
  int numSsid = WiFi.scanNetworks();
  if (numSsid == -1)
  {
    DEBUGln("Couldn't get a wifi connection");
    while (true);
  }

  // print the list of networks seen:
  DEBUG("number of available networks:");
  DEBUGln(numSsid);

  // print the network number and name for each network found:
  for (int thisNet = 0; thisNet < numSsid; thisNet++) {
    DEBUG(thisNet);
    DEBUG(") ");
    DEBUG(WiFi.SSID(thisNet));
    DEBUG("\tSignal: ");
    DEBUG(WiFi.RSSI(thisNet));
    DEBUG(" dBm");
    DEBUG("\tEncryption: ");
    printEncryptionType(WiFi.encryptionType(thisNet));
    Serial.flush();
  }
}

void printEncryptionType(int thisType)
{
  // read the encryption type and print out the name:
  switch (thisType) {
    case ENC_TYPE_WEP:
      DEBUGln("WEP");
      break;
    case ENC_TYPE_TKIP:
      DEBUGln("WPA");
      break;
    case ENC_TYPE_CCMP:
      DEBUGln("WPA2");
      break;
    case ENC_TYPE_NONE:
      DEBUGln("None");
      break;
    case ENC_TYPE_AUTO:
      DEBUGln("Auto");
      break;
  }
}

void stopAndResetProgram()
{
  programLength = 0;
  programPointer = 0;
  programZoneStart = 0;
}

//all zones OFF
void zonesOFF()
{
  /* stopAndResetProgram(); //stop any running programs */
  /* if (radio.ACKRequested()) radio.sendACK(); */
  registersClear();
  /* if (radio.sendWithRetry(GATEWAYID, "ZONES:OFF", 9)) */
  /*  {DEBUGln(F("..OK"));} */
  /* else {DEBUGln(F("..NOK"));} */
}

//turns ON one zone only, all others off
void zoneON(byte which)
{
  //stopAndResetProgram(); //stop any running programs
  /* if (radio.ACKRequested()) radio.sendACK(); */
  registersWriteBit(which);
  /* sprintf(buff, "ZONE:%d", which); */
  /* if (radio.sendWithRetry(GATEWAYID, buff, strlen(buff))) */
  /*  {DEBUGln(F("..OK"));} */
  /* else {DEBUGln(F("..NOK"));} */
}

void registersClear()
{
  digitalWrite(LATCHPIN, LOW);
  for (byte i = 0; i < REGISTERCOUNT; i++)
    shiftOut(DATAPIN, CLOCKPIN, MSBFIRST, 0x0);
  digitalWrite(LATCHPIN, HIGH);
}

void registersAllOn()
{
  digitalWrite(LATCHPIN, LOW);
  for (byte i = 0; i < REGISTERCOUNT; i++)
    shiftOut(DATAPIN, CLOCKPIN, MSBFIRST, 0xFF);
  digitalWrite(LATCHPIN, HIGH);
}

//writes a single bit to a daisy chain of up to 32 shift registers (max 16 IOShields) chained via LATCHPIN, CLOCKPIN, DATAPIN
void registersWriteBit(byte whichPin)
{
  byte bitPosition = whichPin % 8;
  int zeroFills = (REGISTERCOUNT - 1) - (whichPin / 8);

  if (zeroFills < 0) { //whichPin was "out of bounds"
    DEBUGln("requested bit out of bounds (ie learger than available register bits to set)");
    registersClear();
    return;
  }

  digitalWrite(LATCHPIN, LOW);
  for (byte i = 0; i < zeroFills; i++)
    shiftOut(DATAPIN, CLOCKPIN, MSBFIRST, 0x0);

  byte byteToWrite = 0;
  bitSet(byteToWrite, bitPosition);
  shiftOut(DATAPIN, CLOCKPIN, MSBFIRST, byteToWrite);

  for (byte i = 0; i < REGISTERCOUNT - zeroFills - 1; i++)
    shiftOut(DATAPIN, CLOCKPIN, MSBFIRST, 0x0);
  digitalWrite(LATCHPIN, HIGH);
}

void registersWrite(byte Pin)
{
  byte bitPosition = Pin % 8;
  byte byteToWrite = 0;
  std::vector<byte> pins;
  byte t[4] = {14, 10, 1, 6};
  byte  byteCount = 4;
  //bitSet(byteToWrite, bitPosition);
  for (byte i = 0; i < byteCount; i++)
  {
    //digitalWrite(LATCHPIN, LOW);
    pins.push_back(t[i]);
    bitPosition = t[i] % 8;
//    DEBUGln("Bit Position");
//    Serial.println(bitPosition);
    DEBUGln("Byte To Write PRE");
    Serial.println(byteToWrite);
    byte temp = 0;
    bitSet(temp, bitPosition);
    byteToWrite |= temp;
    DEBUGln("Byte To Write POST");
    Serial.println(byteToWrite);
//    byte x = 0x40;
//    byte y = 0x01;
//    x |= y;
//    shiftOut(DATAPIN, CLOCKPIN, MSBFIRST, byteToWrite);
//    shiftOut(DATAPIN, CLOCKPIN, MSBFIRST, 0x96);
//    
//    digitalWrite(LATCHPIN, HIGH);
//    //delay(3000);
  }
  //writeToRegisters(pins);
}

int   whichRegister(float num)
{
  Serial.println(num / 8);
  return (ceil(num / 8));
}

void  writeToRegisters(std::vector<byte> selectedPins)
{
  byte  registers[REGISTERCOUNT];
  for (int i = 0; i < REGISTERCOUNT; i++)
  {
    registers[i] = byte(0);
    Serial.println(registers[i]);
  }
  digitalWrite(LATCHPIN, LOW);
  for (int i = 0; i < selectedPins.size(); i++)
  {
    DEBUGln("Register: ");
    int reg = whichRegister(float(selectedPins[i]));
    Serial.println(reg);
    DEBUGln("Activating Zone: ");
    Serial.println(selectedPins[i]);
    byte  bitPosition = (selectedPins[i] - 1) % 8;
    byte  toWrite = 0;
    bitSet(toWrite, bitPosition);
    DEBUGln("Register's Byte Pre: ");
    Serial.println(registers[reg - 1], BIN);
    registers[reg - 1] |= toWrite;
    DEBUGln("Pin to OR");
    Serial.println(toWrite, BIN);
    DEBUGln("Register's Byte: ");
    Serial.println(registers[reg - 1], BIN);
  }
  for (int i = REGISTERCOUNT - 1; i >= 0; i--)
  {
    Serial.println(registers[i], BIN);
    shiftOut(DATAPIN, CLOCKPIN, MSBFIRST, registers[i]);
  }
  digitalWrite(LATCHPIN, HIGH);
}

//writes a byte stream to the shift register daisy chain (up to 256 daisy chained shift registers)
void registerWriteBytes(const void* buffer, byte byteCount)
{
  digitalWrite(LATCHPIN, LOW);
  byte jk[5] = {1, 2, 3, 4, 5};
  for (byte i = 0; i < byteCount; i++)
    shiftOut(DATAPIN, CLOCKPIN, MSBFIRST, jk[i]);
  digitalWrite(LATCHPIN, HIGH);
}

void Blink(byte PIN, byte DELAY_MS)
{
  pinMode(PIN, OUTPUT);
  digitalWrite(PIN, HIGH);
  delay(DELAY_MS / 2);
  digitalWrite(PIN, LOW);
  delay(DELAY_MS / 2);
}
