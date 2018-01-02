#include "./lib/Json/ArduinoJson.h"
#include <iostream>

#define String std::string;

void        test(void)
{
    std::cout << "Hello World";
}

const char *getSchedule(std::string result)
{
 // DEBUGln("result is:");
 // DEBUGln(result);
  std::string test = result;
  //test.replace("\"", "'");
 // DEBUGln("New Result: ");
 // DEBUGln(test);
 // DEBUG("SubString: ");
  std::string programSchedule = test.substring(19, (test.indexOf("z14") - 2));
  //programSchedule += "}";
 // DEBUGln(programSchedule);
  std::string zoneDays = "{";
  zoneDays += programSchedule.substring(programSchedule.indexOf("z") - 1, programSchedule.indexOf("}},") + 2);
  zoneDays += "}";
 // DEBUG("program before");
 // DEBUGln(programSchedule);
  std::string testing = "{";
  testing += programSchedule.substring(programSchedule.indexOf("}},") + 3, programSchedule.length() - (programSchedule.indexOf("}},") + 1));
  //DEBUG("program after");
 // DEBUGln(testing);
  std::string tmp = "";
  for (int i = 0; i < 10; i++) {
    tmp += "{";
    tmp += testing.substring(testing.indexOf("}},") + 3, testing.length() - (testing.indexOf("}},") + 1));
    //DEBUGln(tmp);
    std::swap(testing, tmp);
    //DEBUG("program after");
    DEBUGln(testing);
  }
  loadJson(programSchedule);
  //DEBUG("One Zone: ");
  //DEBUGln(zoneDays);
  //FAILS ON THIS SIZE
  const size_t bufferSizeFail = 113 * JSON_OBJECT_SIZE(1) + 16 * JSON_OBJECT_SIZE(7) + JSON_OBJECT_SIZE(16) + 1960;
  //DEBUG("bufferSizeFail: ");
 // DEBUGln(bufferSizeFail);
  //FAILS ON SIZE ABOVE

  std::string zone = "{\"z00\":{\"00\":{\"duration\":50},\"01\":{\"duration\":60},\"02\":{\"duration\":60},\"03\":{\"duration\":60},\"04\":{\"duration\":60},\"05\":{\"duration\":60},\"06\":{\"duration\":60}}}";
  const size_t bufferSize = 8*JSON_OBJECT_SIZE(1) + JSON_OBJECT_SIZE(7) + 130;
  DynamicJsonBuffer jsonBuffer(bufferSize);

  const char* json = "{\"z00\":{\"00\":{\"duration\":50},\"01\":{\"duration\":60},\"02\":{\"duration\":60},\"03\":{\"duration\":60},\"04\":{\"duration\":60},\"05\":{\"duration\":60},\"06\":{\"duration\":60}}}";

  JsonObject& root = jsonBuffer.parseObject(zoneDays);
  if (!root.success())
  {
   // DEBUGln("parsingObject() failed");
  }
  else {
//    DEBUGln("Success");
  }
  std::vector<JsonVariant> vec;
  JsonVariant z00 = root["z00"];
 // DEBUG("Vec Size: ");
  //Serial.println(vec.size());
  vec.push_back(z00);
  //DEBUG("Vec Size POST: ");
  //Serial.println(vec.size());
  int z00_00_duration = vec[0]["00"]["duration"];
  //Serial.println(z00_00_duration);
  //DEBUG("Printing vec element: ");
  const char* program = "";
  //DEBUG("Duration is:");
//  DEBUGln(t);
  return (program);
}}
