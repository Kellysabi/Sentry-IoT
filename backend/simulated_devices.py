# backend/simulated_devices.py
import time
import random
import json
import threading
import paho.mqtt.client as mqtt

BROKER = 'localhost'
PORT = 1883
TOPIC = 'iot/traffic'

def generate_device_traffic(device_id):
    """Simulate IoT device traffic with occasional anomalies."""
    while True:
        message = {
            "device_id": device_id,
            "timestamp": time.time(),
            "temperature": round(20 + random.uniform(-5, 5), 2),
            "humidity": round(50 + random.uniform(-10, 10), 2),
            "source_ip": f'192.168.1.{random.randint(2,254)}',
            "status": "OK"
        }
        # Introduce anomaly with 5% probability.
        if random.random() < 0.05:
            message["temperature"] = round(100 + random.uniform(1, 10), 2)
            message["status"] = "ALERT"
        client.publish(TOPIC, json.dumps(message))
        time.sleep(random.uniform(0.5, 2.0))

def start_simulation(num_devices=10):
    for device_id in range(1, num_devices + 1):
        thread = threading.Thread(target=generate_device_traffic, args=(f'device_{device_id}',))
        thread.daemon = True
        thread.start()

client = mqtt.Client()
client.connect(BROKER, PORT, 60)
client.loop_start()

if __name__ == '__main__':
    print("Starting IoT devices simulation...")
    start_simulation(num_devices=15)
    while True:
        time.sleep(10)
