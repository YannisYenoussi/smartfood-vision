import os
from dotenv import load_dotenv
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from msrest.authentication import CognitiveServicesCredentials

load_dotenv()

key = os.getenv("AZURE_KEY")
endpoint = os.getenv("AZURE_ENDPOINT")

client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(key))

image_url = "https://atelierbanette.com/wp-content/uploads/2023/04/atelier-banette-baguette-tradition.jpg"

result = client.analyze_image(image_url, visual_features=["Tags", "Description"])

print("=== TAGS DÉTECTÉS ===")
for tag in result.tags:
    print(f"{tag.name} — confiance : {round(tag.confidence * 100, 1)}%")

print("\n=== DESCRIPTION ===")
print(result.description.captions[0].text)