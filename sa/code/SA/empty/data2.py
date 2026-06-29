from selenium import webdriver
from bs4 import BeautifulSoup
import pandas as pd
import time
import os

# ✅ Ask user for product links
print("Enter Amazon product links (comma separated):")
links = input().split(',')

# Setup Chrome browser
driver = webdriver.Chrome()
all_reviews = []

# Loop through each link
for link in links:
    link = link.strip()
    print(f"\nScraping reviews from: {link}")
    driver.get(link + "#customerReviews")
    time.sleep(3)

    soup = BeautifulSoup(driver.page_source, "html.parser")
    reviews = [r.get_text(strip=True) for r in soup.find_all("span", {"data-hook": "review-body"})]

    # Store results
    for rev in reviews:
        all_reviews.append({
            "Review_ID": len(all_reviews) + 1,
            "Product_Link": link,
            "Review_Text": rev,
            "Product_Category": "E-Commerce",
            "Rating": None,
            "Sentiment": None
        })

# Close browser
driver.quit()

# ✅ Save dataset to Downloads folder
downloads_path = os.path.join(os.path.expanduser("~"), "Downloads")
file_path = os.path.join(downloads_path, "scraped_reviews.csv")

df = pd.DataFrame(all_reviews)
df.to_csv(file_path, index=False)

print(f"\n✅ All reviews saved successfully in your Downloads folder:")
print(f"📂 {file_path}")
