from selenium import webdriver
from bs4 import BeautifulSoup
import pandas as pd
import time

# 1️⃣ Setup
driver = webdriver.Chrome()  
url = "https://amzn.in/d/d6eKsJw"
driver.get(url)

# 2️⃣ Open 'See all reviews'
driver.get(url + "#customerReviews")

time.sleep(3)  # wait to load
soup = BeautifulSoup(driver.page_source, "html.parser")

# 3️⃣ Extract reviews
reviews = [r.get_text(strip=True) for r in soup.find_all("span", {"data-hook": "review-body"})]

# 4️⃣ Save
df = pd.DataFrame({
    "Review_ID": range(1, len(reviews)+1),
    "Product_Category": "E-Commerce",
    "Review_Text": reviews,
    "Rating": None,
    "Sentiment": None
})
df.to_csv("amazon_reviews.csv", index=False)
print("✅ Reviews saved as amazon_reviews.csv")

driver.quit()
