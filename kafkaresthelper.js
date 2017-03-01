
var KafkaRESTHelper = function (base_uri) {
  console.log("KafkaRESTHelper initialized")

  KafkaRESTHelper.prototype.base_uri = base_uri
};

KafkaRESTHelper.prototype.createConsumerInstance = function(groupname, topicname, callbackfunction, interval) {
  // Create consumer instance
  var jqxhr = $.ajax({
    method: "POST",
    data: "{\"format\": \"binary\"}",
    url:KafkaRESTHelper.prototype.base_uri + groupname,
    contentType: "application/vnd.kafka.v1+json"
  })
  .done(function(data) {
    console.log("New consumer created " + data["base_uri"])
    var consumerinstance = data["base_uri"]

    // Take the consumer instance out of the URI
    var consumerinstancesArray = consumerinstance.split("/")
    consumerinstance = consumerinstancesArray[consumerinstancesArray.length - 1]

    console.log("New consumer parsed " + consumerinstance)

    setInterval(function() {
      // Create consumer instance
      var jqxhr = $.ajax({
        headers: {
            Accept: "application/vnd.kafka.binary.v1+json"
        },
        url:KafkaRESTHelper.prototype.base_uri + groupname + "/instances/" + consumerinstance + "/topics/" + topicname
        
      })
      .done(function(data) {
        var jsonObjects = []

        // Process the incoming data from Kafka REST
        // It will be a series of key/value pairs that Base 64
        // encoded.
        for(var i = 0; i < data.length; i++) {
          try {
            // Decode the value from Base64 to a string
            decodedValue = atob(data[i].value)

            // Parse the string back to a JSON object
            var jsonObject = JSON.parse(decodedValue)

            for (var j = 0; j < jsonObject.length; j++) {
              // Data is delivered in an array
              // Split out the individual objects and put them in
              // a single array
              jsonObjects.push(jsonObject[j])
            }
          }
          catch (e) {
            console.log("Exception while decoding values. Error was:" + e + 
              "\nDecoded value was:\"" + decodedValue + "\"")
          }
          
        }

        callbackfunction(jsonObjects)
      })
      .fail(function(data) {
        console.log("Error consuming : " + topicname + "\n")
        console.dir(data)
      });
    }, interval);
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.log("Error creating Consumer Instance:" + groupname + " Status:" + textStatus + 
    " Error: " + errorThrown + "\n")
    console.dir(jqXHR)
  });
}
