import requests
import time
import os
from datetime import datetime
import xml.etree.ElementTree as ET
from etl.storage import save_raw_response, update_metadata

# SEC EDGAR requires a specific User-Agent
# Standard format: "Company Name admin@example.com"
USER_AGENT = os.getenv("SEC_USER_AGENT", "CyberIncidentTracker (admin@example.com)")

SEC_RSS_URL = "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=8-K&count=100&output=atom"

def fetch_latest_8k_metadata():
    headers = {
        "User-Agent": USER_AGENT,
        "Accept-Encoding": "gzip, deflate"
    }
    
    print(f"Fetching latest 8-K filings from {SEC_RSS_URL}...")
    try:
        response = requests.get(SEC_RSS_URL, headers=headers)
        response.raise_for_status()
        
        # Parse XML (Atom feed)
        root = ET.fromstring(response.content)
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        
        filings = []
        for entry in root.findall("atom:entry", ns):
            title = entry.find("atom:title", ns).text
            # Title format usually: 8-K - COMPANY NAME (0000000000) (Filer)
            
            link = entry.find("atom:link", ns).attrib["href"]
            updated = entry.find("atom:updated", ns).text
            
            filings.append({
                "title": title,
                "url": link,
                "updated": updated,
                "source": "SEC EDGAR"
            })
        
        raw_file = save_raw_response("sec_8k_feed", filings)
        print(f"Saved {len(filings)} raw filing records to {raw_file}")
        
        return filings
    except Exception as e:
        print(f"Error fetching SEC filings: {e}")
        update_metadata("SEC EDGAR", 0, success=False)
        return []

if __name__ == "__main__":
    fetch_latest_8k_metadata()
