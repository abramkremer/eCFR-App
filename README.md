# eCFR Analysis & Visualization

## Overview
This project provides a simple website to analyze **Federal Regulations** using data from the **Electronic Code of Federal Regulations (eCFR)** available at [ecfr.gov](https://www.ecfr.gov/). The project consists of:
- **A front-end React application** that visualizes word count changes over time using charts.
- **A scraper** that downloads the latest eCFR data via the **public eCFR API**, and processes it.

## Features
✅ Fetches and processes eCFR data using a public API.  
✅ Computes metrics like **word count per agency** and **historical changes over time**.  
✅ Displays interactive visualizations with **charts for word count trends**.  
✅ Includes a search function for easy navigation.  

## Repository Structure
```
eCFR-App/              
│-- public/
│   ├── data.json      # Data file used for visualization
|
│-- src/               # React front-end application
│   ├── package.json   # Dependencies & scripts
│   ├── README.md
│
│-- scraper/           # Data extraction and processing
│   ├── code/          # Script to fetch eCFR data
│   ├── data/          # Scraper data output
│
│-- package.json       # Project dependencies
```


## License
This project is open-source and available under the **MIT License**.

---
**Created by Abram Kremer** 🚀

