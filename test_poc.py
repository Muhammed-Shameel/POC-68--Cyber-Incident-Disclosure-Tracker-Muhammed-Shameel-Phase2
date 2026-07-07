from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
from datetime import datetime

# Configuration
TARGET_URL = "https://poc-68-cyber-incident-disclosure-tracker-muhammed-cf6ualwfg.vercel.app/dashboard"
REPORT_FILE = "Test_Report.txt"

def run_test():
    start_time_all = time.time()
    
    chrome_options = Options()
    # chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(options=chrome_options)
    
    report_lines = []
    report_lines.append("="*70)
    report_lines.append("UAT TEST REPORT — Cyber Incident Disclosure Tracker")
    report_lines.append("="*70)
    report_lines.append(f"Target URL : {TARGET_URL}")
    report_lines.append(f"Run Time   : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    stats = {"passed": 0, "failed": 0}

    def add_test_case(name, status, detail, duration):
        report_lines.append("-" * 70)
        report_lines.append(f"[Test Case: {name}]")
        report_lines.append(f"       Status : {status}")
        report_lines.append(f"       Detail : {detail}")
        report_lines.append(f"       Time   : {duration:.2f}s")
        if status == "PASS": stats["passed"] += 1
        else: stats["failed"] += 1

    try:
        # Step 1: Visual Load
        t0 = time.time()
        driver.get(TARGET_URL)
        wait = WebDriverWait(driver, 10)
        header = wait.until(EC.visibility_of_element_located((By.TAG_NAME, "header")))
        add_test_case("Visual Load", "PASS", "Header/Main structure visible", time.time() - t0)
        
        # Step 2: The Handshake
        t0 = time.time()
        # Use more specific selector for Intelligence button
        intelligence_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.intelligence-trigger")))
        intelligence_button.click()
        # Wait for the panel to be both visible and fully transitioned
        panel = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, "div.side-panel.is-open")))
        add_test_case("The Handshake", "PASS", "Intelligence Panel slid into view", time.time() - t0)
        
        # Step 3: The Signature
        t0 = time.time()
        info_icon_button = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.relative > button > svg.lucide-info")))
        info_button = info_icon_button.find_element(By.XPATH, "./..")
        driver.execute_script("arguments[0].click();", info_button)
        name_element = wait.until(EC.visibility_of_element_located((By.XPATH, "//*[text()='Muhammed Shameel']")))
        add_test_case("The Signature", "PASS", "Info popover opened and name verified", time.time() - t0)
        
    except Exception as e:
        report_lines.append("-" * 70)
        report_lines.append(f"!!! TEST FAILED: {str(e)}")
        stats["failed"] += 1
        
    finally:
        driver.quit()
        total_time = time.time() - start_time_all
        report_lines.append("-" * 70)
        report_lines.append(f"SUMMARY: {stats['passed']} passed, {stats['failed']} failed, {stats['passed'] + stats['failed']} total")
        report_lines.append(f"Total Time : {total_time:.2f}s")
        report_lines.append("="*70)
        
        with open(REPORT_FILE, "w") as f:
            f.write("\n".join(report_lines))
        print(f"Test complete. Formatted report saved to {REPORT_FILE}")

if __name__ == "__main__":
    run_test()
