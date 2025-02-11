import requests
from datetime import datetime
from dateutil.relativedelta import relativedelta
import xml.etree.ElementTree as ET
import re
import json

def parse_xml(xml_text):
    root = ET.fromstring(xml_text)  # Decode response content
    total_word_count = 0
    
    title_name = root.find(".//DIV1[@TYPE='TITLE']/HEAD").text.strip()

    # Find all sections (DIV8 elements with TYPE="SECTION")
    for section in root.findall(".//DIV8[@TYPE='SECTION']"):
        section_text = " ".join(p.text for p in section.findall("P") if p.text)
        words = re.findall(r'\b\w+\b', section_text)  # Tokenize words
        total_word_count += len(words)
    
    return title_name, total_word_count

def run_title(title_num):
    start_year = 2017
    date = datetime(year=start_year, month=1, day=2)

    base_url = "https://www.ecfr.gov/api/versioner/v1/full/{date}/title-{title}.xml"
    
    title_name = ''
    word_counts = {}

    while date <= datetime.today():

        date_str = date.strftime('%Y-%m-%d')

        print(date_str)

        url = base_url.format(date=date_str, title=title_num)
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers)
        # Keep retrying until status code 200
        failures = 0
        max_fails_allowed = 10
        while response.status_code != 200 and failures < max_fails_allowed:
            failures += 1
            print(f"Received status code {response.status_code}. Retrying...")
            response = requests.get(url, headers=headers)

        if failures < max_fails_allowed:
            response = response.content.decode("utf-8")
            title_name, num_words = parse_xml(response)
            word_counts[date_str] = num_words
        
        date += relativedelta(years=1)

    return title_name, word_counts

def run():

    data = {}
    num_titles = 50

    for title in range(1, num_titles + 1):
        print(f'Title: {title}')
        title_name, word_counts = run_title(title)

        data[title] = {'title_name': title_name, 'word_counts': word_counts}
        print(data)

    with open("../data/data.json", "w") as file:
        json.dump(data, file, indent=4)
        

if __name__ == "__main__":
    run()
