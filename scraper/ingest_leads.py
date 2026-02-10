import os, json, asyncio
from datetime import datetime
from crawl4ai import AsyncWebCrawler
import httpx
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GOOGLE_API_KEY")
SOURCES = ["https://morth.nic.in/tenders/",

    "https://energy.economictimes.indiatimes.com/rss/topstories",

    "https://infra.economictimes.indiatimes.com/rss/topstories"]

async def extract_with_groq(content):
    prompt = f"""
    You are an HPCL B2B Sales Expert. Extract lead dossiers.
    Return ONLY a JSON object with a key "leads" containing a list of:
    {{
        "company_name": "...",
        "facility_location": "...",
        "recommended_products": ["Product1", "Product2"],
        "reason_code": "Brief explanation of the lead signal",
        "urgency": "High/Medium",
        "confidence_score": 0.0-10.0,
        "suggested_action": "What the sales officer should do"
    }}
    Text: {content[:10000]}
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"}
            },
            timeout=30.0
        )
        return json.loads(response.json()['choices'][0]['message']['content'])

async def save_to_json(new_leads):
    file_path = 'leads.json'
    data = []
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            try: data = json.load(f)
            except: data = []

    # Add timestamp and append
    for lead in new_leads:
        lead['extracted_at'] = datetime.now().isoformat()
        data.append(lead)

    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)


async def main():
    print("🚀 HPCL JSON Discovery Engine Active...")
    all_extracted_leads = []  # Initialize a list to hold all results

    async with AsyncWebCrawler() as crawler:
        for url in SOURCES:
            result = await crawler.arun(url=url)
            if result.success:
                # FIXED: Using .markdown.raw_markdown for v0.8.0+
                raw_data = await extract_with_groq(result.markdown.raw_markdown)
                leads = raw_data.get('leads', [])

                # Add timestamp to each lead before appending
                for lead in leads:
                    lead['extracted_at'] = datetime.now().isoformat()
                    all_extracted_leads.append(lead)

                print(f"✅ Extracted {len(leads)} dossiers from {url}")

    return all_extracted_leads  # Return the full list of JSON objects


if __name__ == "__main__":
    # Capture the return value from the event loop
    final_json = asyncio.run(main())

    # Print or process the returned JSON
    print(json.dumps(final_json, indent=4))
