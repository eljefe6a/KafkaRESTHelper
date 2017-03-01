# KafkaRESTHelper
Helper JavaScript code to make it easier to interface with the Kafka REST server and JQuery.

This is a JavaScript module that is part of my [Real-time Data Engineering class](http://www.jesse-anderson.com/real-time-data-pipelines/). We use Apache Spark and Apache Kafka to process data. Then, we show the data in real-time on a webpage using this JavaScript module to pull in data from Kafka via the [Kafka REST](https://github.com/confluentinc/kafka-rest) interface.

## Configuration

This helper function makes a few assumptions about data and URLs. It assumes that the data is in Kafka and accessible by the Kafka REST server. It assumes the value of the payload is a valid JSON string.

## Usage

Initialize the `KafkaRESTHelper` helper. The parameter is the URL of where to access the Kafka REST server. This example shows how to use Kafka REST behind a proxy:

```javascript
var kafkaRESTHelper = new KafkaRESTHelper("/kafkarest/consumers/");
```

Next, you'll create a `createConsumerInstance` by passing in the consumer group name, the topic name to consume, the function to call when data is retrieved, and the interval in millisecond to poll for data on the topic. This example shows an example call:

```javascript
kafkaRESTHelper.createConsumerInstance("totalsbygameid", "totalsbygameid", byGameId, 10000)
```

The callback function will be called with a JavaScript object containing all of the data for the topic merged together. Here is an example function:

```javascript
function byGameId(data) {
  console.log(data)
}
```

This function would power the rest of page. It might be used for charting or another function.

The module supports multiple calls to the `createConsumerInstance` function with different topics or the same topic.

## TODOs

This code doesn't delete the consumer instances automatically. I'd need to maintain a list of consumer nstances created and then register an onclose event to delete them.
