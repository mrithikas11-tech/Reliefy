import json
import boto3

REGION = "us-east-1"
MODEL_ID = "us.openai.gpt-6-luna"

client = boto3.client("bedrock-runtime", region_name=REGION)

message = """
Extract this restaurant offer into JSON with fields:
restaurant, meals, total_cost, ready_time.

Offer: Restaurant A can provide 80 meals for $640,
ready at 4 PM.

Return only valid JSON. Use 24-hour time.
"""

response = client.converse(
    modelId=MODEL_ID,
    messages=[{"role": "user", "content": [{"text": message}]}],
    inferenceConfig={"maxTokens": 1000},
)

blocks = response["output"]["message"]["content"]
answer = "".join(b["text"] for b in blocks if "text" in b)

print("Bedrock response:")
print(answer)

# Parse it so the rest of your app can use it
try:
    data = json.loads(answer)
    print(data["restaurant"], data["meals"], data["total_cost"], data["ready_time"])
except json.JSONDecodeError:
    print("Model returned non-JSON, check the output above")