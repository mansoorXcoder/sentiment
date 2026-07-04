from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from bs4 import BeautifulSoup
import pandas as pd
import time
from datetime import datetime
import re
import random

def setup_driver():
    """Setup Chrome driver with anti-detection measures"""
    options = Options()
    
    # Ask user for browser mode
    mode = input("Run in headless mode? (y/n, recommend 'n' for debugging): ").strip().lower()
    if mode == 'y':
        options.add_argument("--headless=new")
        print("✅ Running in background mode")
    else:
        print("✅ Running with visible browser (you can see what's happening)")
    
    # Anti-detection options
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--start-maximized")
    
    # Randomized user agent
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ]
    options.add_argument(f"user-agent={random.choice(user_agents)}")
    
    try:
        driver = webdriver.Chrome(options=options)
        
        # Remove webdriver flag
        driver.execute_cdp_cmd('Network.setUserAgentOverride', {
            "userAgent": driver.execute_script("return navigator.userAgent").replace('Headless', '')
        })
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        print("✅ Browser initialized successfully")
        return driver
    except Exception as e:
        print(f"❌ Error initializing browser: {str(e)}")
        print("\n💡 Common fixes:")
        print("  1. Install/Update ChromeDriver: pip install webdriver-manager")
        print("  2. Update Chrome browser to latest version")
        print("  3. Install selenium: pip install selenium")
        raise

def detect_site(url):
    """Detect if URL is Amazon or Flipkart"""
    url_lower = url.lower()
    if 'amazon' in url_lower or 'amzn.in' in url_lower or 'amzn.to' in url_lower:
        return 'Amazon'
    elif 'flipkart' in url_lower or 'fkrt.in' in url_lower:
        return 'Flipkart'
    return None

def resolve_shortened_url(driver, url):
    """Resolve shortened URLs to full URLs"""
    try:
        if 'amzn.in' in url or 'amzn.to' in url or 'fkrt.in' in url:
            print(f"    🔗 Resolving shortened URL...")
            driver.get(url)
            human_delay(2, 3)
            resolved_url = driver.current_url
            print(f"    ✅ Resolved to: {resolved_url[:70]}...")
            return resolved_url
        return url
    except Exception as e:
        print(f"    ⚠️ Could not resolve URL: {str(e)[:50]}")
        return url

def human_delay(min_sec=1, max_sec=3):
    """Add random human-like delay"""
    time.sleep(random.uniform(min_sec, max_sec))

def scrape_amazon(driver, url):
    """Scrape Amazon reviews with updated selectors"""
    reviews = []
    
    try:
        print("    Loading Amazon product page...")
        driver.get(url)
        human_delay(3, 5)
        
        wait = WebDriverWait(driver, 15)
        
        # Get product name with multiple attempts
        product_name = "N/A"
        try:
            product_element = wait.until(
                EC.presence_of_element_located((By.ID, "productTitle"))
            )
            product_name = product_element.text.strip()
            print(f"    ✅ Product found: {product_name[:50]}...")
        except Exception as e:
            print(f"    ⚠️ Could not find product title: {str(e)[:50]}")
            # Try alternative selector
            try:
                product_element = driver.find_element(By.CSS_SELECTOR, "h1.a-size-large")
                product_name = product_element.text.strip()
            except:
                pass
        
        # Scroll to load content
        driver.execute_script("window.scrollTo(0, 800);")
        human_delay(2, 3)
        
        # Navigate to reviews page
        try:
            # Method 1: Click "See all reviews" link
            see_all_selectors = [
                (By.XPATH, "//a[@data-hook='see-all-reviews-link-foot']"),
                (By.XPATH, "//a[contains(@href, '/product-reviews/')]"),
                (By.CSS_SELECTOR, "a[data-hook='see-all-reviews-link-foot']"),
                (By.XPATH, "//a[contains(text(), 'customer reviews')]")
            ]
            
            clicked = False
            for by, selector in see_all_selectors:
                try:
                    element = driver.find_element(by, selector)
                    driver.execute_script("arguments[0].scrollIntoView(true);", element)
                    human_delay(1, 2)
                    driver.execute_script("arguments[0].click();", element)
                    print("    ✅ Navigated to reviews page")
                    human_delay(3, 4)
                    clicked = True
                    break
                except:
                    continue
            
            if not clicked:
                # Method 2: Direct URL navigation
                if "/dp/" in url:
                    product_id = url.split("/dp/")[1].split("/")[0].split("?")[0]
                    review_url = f"https://www.amazon.in/product-reviews/{product_id}"
                    driver.get(review_url)
                    print("    ✅ Navigated to reviews page via direct URL")
                    human_delay(3, 4)
                elif "/product-reviews/" not in url:
                    print("    ⚠️ Could not navigate to reviews page")
                    
        except Exception as e:
            print(f"    ⚠️ Navigation error: {str(e)[:50]}")
        
        # Scroll page to load reviews
        for i in range(3):
            driver.execute_script(f"window.scrollTo(0, {(i+1)*800});")
            human_delay(1, 2)
        
        # Parse the page
        soup = BeautifulSoup(driver.page_source, "html.parser")
        
        # Debug: Save page source
        print("    🔍 Analyzing page structure...")
        
        # Find review containers with multiple selectors
        review_containers = soup.find_all("div", {"data-hook": "review"})
        
        if not review_containers:
            print("    ⚠️ No reviews found with primary selector, trying alternatives...")
            review_containers = soup.find_all("div", class_=re.compile("review.*"))
            review_containers = [c for c in review_containers if c.find("i", {"data-hook": "review-star-rating"})]
        
        print(f"    📊 Found {len(review_containers)} review(s)")
        
        if len(review_containers) == 0:
            print("    ⚠️ Page might be blocking scraper or no reviews available")
            print("    💡 Try running in non-headless mode to see the actual page")
        
        for idx, container in enumerate(review_containers, 1):
            try:
                review_id = f"AMZ_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{idx}"
                
                # Rating (most reliable indicator)
                rating = "N/A"
                rating_elem = container.find("i", {"data-hook": "review-star-rating"})
                if rating_elem:
                    rating_text = rating_elem.find("span", class_="a-icon-alt")
                    if rating_text:
                        match = re.search(r'(\d+\.?\d*)', rating_text.get_text())
                        rating = match.group(1) if match else "N/A"
                
                # Title
                title_elem = container.find("a", {"data-hook": "review-title"})
                if not title_elem:
                    title_elem = container.find("span", {"data-hook": "review-title"})
                review_title = title_elem.get_text(strip=True) if title_elem else "N/A"
                # Remove "5.0 out of 5 stars" prefix if present
                review_title = re.sub(r'^\d+\.?\d*\s+out of \d+ stars\s*', '', review_title)
                
                # Text
                text_elem = container.find("span", {"data-hook": "review-body"})
                review_text = text_elem.get_text(strip=True) if text_elem else "N/A"
                
                # Date
                date_elem = container.find("span", {"data-hook": "review-date"})
                date = "N/A"
                location = "N/A"
                if date_elem:
                    date_text = date_elem.get_text(strip=True)
                    if " on " in date_text:
                        parts = date_text.split(" on ")
                        date = parts[-1] if parts else date_text
                        if " in " in parts[0]:
                            location = parts[0].split(" in ")[-1]
                    else:
                        date = date_text
                
                # Reviewer
                name_elem = container.find("span", class_="a-profile-name")
                reviewer_name = name_elem.get_text(strip=True) if name_elem else "N/A"
                
                # Verified Purchase
                verified = container.find("span", {"data-hook": "avp-badge"})
                verified_purchase = "Yes" if verified else "No"
                
                reviews.append({
                    "Review_ID": review_id,
                    "Review_Title": review_title,
                    "Review_Text": review_text,
                    "Rating": rating,
                    "Date_Time": date,
                    "Reviewer_Name": reviewer_name,
                    "Location": location,
                    "Product_Name": product_name[:100],
                    "Category": "N/A",
                    "Verified_Purchase": verified_purchase,
                    "Site": "Amazon"
                })
                
                print(f"      ✅ Review {idx}: Rating {rating}")
                
            except Exception as e:
                print(f"      ❌ Review {idx} failed: {str(e)[:40]}")
                continue
                
    except Exception as e:
        print(f"    ❌ Amazon scraping error: {str(e)}")
        import traceback
        print(f"    📋 Details: {traceback.format_exc()[:200]}")
    
    return reviews

def scrape_flipkart(driver, url):
    """Scrape Flipkart reviews with updated selectors"""
    reviews = []
    
    try:
        print("    Loading Flipkart product page...")
        driver.get(url)
        human_delay(4, 6)
        
        wait = WebDriverWait(driver, 15)
        
        # Scroll to load content
        for i in range(3):
            driver.execute_script(f"window.scrollTo(0, {(i+1)*600});")
            human_delay(1, 2)
        
        # Get product name
        product_name = "N/A"
        product_selectors = [
            (By.CLASS_NAME, "B_NuCI"),
            (By.CLASS_NAME, "yhB1nd"),
            (By.TAG_NAME, "h1"),
            (By.CSS_SELECTOR, "span.VU-ZEz")
        ]
        
        for by, selector in product_selectors:
            try:
                elem = driver.find_element(by, selector)
                product_name = elem.text.strip()
                if product_name:
                    print(f"    ✅ Product: {product_name[:50]}...")
                    break
            except:
                continue
        
        # Try to click "View All Reviews"
        try:
            view_all_buttons = [
                (By.XPATH, "//div[contains(text(), 'All') and contains(text(), 'reviews')]"),
                (By.XPATH, "//span[contains(text(), 'All') and contains(text(), 'reviews')]"),
                (By.XPATH, "//div[contains(@class, 'col') and contains(text(), 'Ratings')]/..//div"),
            ]
            
            for by, selector in view_all_buttons:
                try:
                    button = driver.find_element(by, selector)
                    driver.execute_script("arguments[0].scrollIntoView(true);", button)
                    human_delay(1, 2)
                    driver.execute_script("arguments[0].click();", button)
                    print("    ✅ Clicked 'View All Reviews'")
                    human_delay(3, 4)
                    break
                except:
                    continue
        except Exception as e:
            print(f"    ℹ️ Scraping visible reviews only")
        
        # Scroll more after clicking
        for i in range(2):
            driver.execute_script(f"window.scrollTo(0, document.body.scrollHeight - {i*500});")
            human_delay(1, 2)
        
        # Parse page
        soup = BeautifulSoup(driver.page_source, "html.parser")
        
        print("    🔍 Analyzing page structure...")
        
        # Find review containers
        review_containers = soup.find_all("div", class_=re.compile("col.*12"))
        
        # Filter for actual reviews (must have rating)
        actual_reviews = []
        for container in review_containers:
            rating_elem = container.find("div", class_=re.compile("XQDdHH|_3LWZlK|hGSR34"))
            if rating_elem:
                actual_reviews.append(container)
        
        print(f"    📊 Found {len(actual_reviews)} review(s)")
        
        review_count = 0
        for container in actual_reviews:
            try:
                review_count += 1
                review_id = f"FK_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{review_count}"
                
                # Rating
                rating_elem = container.find("div", class_=re.compile("XQDdHH|_3LWZlK|hGSR34"))
                rating = rating_elem.get_text(strip=True) if rating_elem else "N/A"
                
                # Title
                title_elem = container.find("p", class_=re.compile("z9E0IG"))
                review_title = title_elem.get_text(strip=True) if title_elem else "N/A"
                
                # Text
                text_elem = container.find("div", class_=re.compile("ZmyHeo"))
                if not text_elem:
                    text_elem = container.find("div", {"class": ""})
                review_text = text_elem.get_text(strip=True) if text_elem else "N/A"
                
                # Reviewer name
                name_elem = container.find("p", class_=re.compile("_2NsDsF|_2sc7ZR"))
                reviewer_name = name_elem.get_text(strip=True) if name_elem else "N/A"
                
                # Date and location
                date_elems = container.find_all("p", class_=re.compile("_2NsDsF|_2sc7ZR"))
                date = "N/A"
                location = "N/A"
                
                for elem in date_elems:
                    text = elem.get_text(strip=True)
                    if any(m in text for m in ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']):
                        date = text
                    elif text != reviewer_name and len(text) < 50:
                        location = text
                
                # Verified purchase
                certified = container.find(text=re.compile("Certified Buyer"))
                verified_purchase = "Yes" if certified else "No"
                
                reviews.append({
                    "Review_ID": review_id,
                    "Review_Title": review_title,
                    "Review_Text": review_text,
                    "Rating": rating,
                    "Date_Time": date,
                    "Reviewer_Name": reviewer_name,
                    "Location": location,
                    "Product_Name": product_name[:100],
                    "Category": "N/A",
                    "Verified_Purchase": verified_purchase,
                    "Site": "Flipkart"
                })
                
                print(f"      ✅ Review {review_count}: Rating {rating}")
                
            except Exception as e:
                print(f"      ❌ Review {review_count} failed: {str(e)[:40]}")
                continue
                
    except Exception as e:
        print(f"    ❌ Flipkart scraping error: {str(e)}")
        import traceback
        print(f"    📋 Details: {traceback.format_exc()[:200]}")
    
    return reviews

def main():
    """Main function"""
    print("\n" + "="*70)
    print("🛒 AMAZON & FLIPKART REVIEW SCRAPER (FIXED VERSION)")
    print("="*70)
    
    # Get URLs
    print("\n📝 Enter product URLs (comma-separated)")
    print("\n✅ Supported formats:")
    print("   Amazon:   https://www.amazon.in/dp/PRODUCTID")
    print("   Flipkart: https://www.flipkart.com/product-name/p/itm...")
    print()
    
    urls_input = input("Enter URLs: ").strip()
    
    if not urls_input:
        print("❌ No URLs provided!")
        return
    
    # Parse and validate URLs
    urls = [url.strip() for url in urls_input.split(',')]
    valid_urls = []
    
    print(f"\n🔍 Validating {len(urls)} URL(s)...")
    for url in urls:
        site = detect_site(url)
        if site:
            valid_urls.append(url)
            print(f"  ✅ {site} URL detected")
        else:
            print(f"  ❌ Invalid URL: {url[:50]}...")
    
    if not valid_urls:
        print("\n❌ No valid URLs found!")
        return
    
    print(f"\n✅ {len(valid_urls)} valid URL(s) ready")
    proceed = input("Start scraping? (y/n): ").strip().lower()
    
    if proceed != 'y':
        print("❌ Cancelled")
        return
    
    # Setup driver
    print("\n⚙️ Setting up browser...")
    try:
        driver = setup_driver()
    except Exception as e:
        print(f"\n❌ Failed to start browser: {str(e)}")
        return
    
    # Scrape all URLs
    all_reviews = []
    
    print("\n" + "="*70)
    print("🔄 SCRAPING IN PROGRESS")
    print("="*70)
    
    for idx, url in enumerate(valid_urls, 1):
        site = detect_site(url)
        print(f"\n[{idx}/{len(valid_urls)}] Processing {site}...")
        print(f"  🔗 URL: {url[:65]}...")
        
        if site == 'Amazon':
            reviews = scrape_amazon(driver, url)
        elif site == 'Flipkart':
            reviews = scrape_flipkart(driver, url)
        else:
            continue
        
        all_reviews.extend(reviews)
        print(f"  ✅ Scraped: {len(reviews)} review(s)")
        
        if idx < len(valid_urls):
            wait_time = random.randint(5, 8)
            print(f"  ⏳ Waiting {wait_time} seconds...")
            time.sleep(wait_time)
    
    # Close driver
    print("\n🔒 Closing browser...")
    driver.quit()
    
    # Save results
    if all_reviews:
        df = pd.DataFrame(all_reviews)
        df.insert(0, 'SNo', range(1, len(df) + 1))
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        amazon_count = len(df[df['Site'] == 'Amazon'])
        flipkart_count = len(df[df['Site'] == 'Flipkart'])
        
        filename = f"reviews_{timestamp}_A{amazon_count}_F{flipkart_count}.csv"
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        
        print("\n" + "="*70)
        print("✅ SCRAPING COMPLETED!")
        print("="*70)
        print(f"📊 Total Reviews: {len(df)}")
        if amazon_count > 0:
            print(f"   • Amazon: {amazon_count}")
        if flipkart_count > 0:
            print(f"   • Flipkart: {flipkart_count}")
        print(f"\n💾 File saved: {filename}")
        
        # Sample
        print("\n📋 Sample reviews:")
        print("-"*70)
        for i in range(min(3, len(df))):
            print(f"\n{i+1}. {df.iloc[i]['Site']} - Rating: {df.iloc[i]['Rating']}")
            print(f"   Title: {df.iloc[i]['Review_Title'][:60]}...")
            print(f"   Verified: {df.iloc[i]['Verified_Purchase']}")
        
    else:
        print("\n" + "="*70)
        print("⚠️ NO REVIEWS SCRAPED")
        print("="*70)
        print("\n🔍 Troubleshooting steps:")
        print("  1. ✅ Run in NON-headless mode (answer 'n') to see what's happening")
        print("  2. ✅ Check if URLs are valid product pages")
        print("  3. ✅ Websites may be blocking automated access")
        print("  4. ✅ Try manually opening the URL in Chrome first")
        print("  5. ✅ Update ChromeDriver: pip install --upgrade selenium")
        print("  6. ✅ Consider adding proxies or using API alternatives")
    
    print("\n👋 Done!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️ Interrupted by user")
    except Exception as e:
        print(f"\n❌ Fatal error: {str(e)}")
        import traceback
        print(traceback.format_exc())