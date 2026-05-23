import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

def debug_frontend_errors():
    chrome_options = Options()
    chrome_options.add_argument('--headless') 
    chrome_options.add_argument('--no-sandbox') 
    chrome_options.add_argument('--disable-dev-shm-usage') 
    chrome_options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})
    
    chrome_options.binary_location = '/usr/bin/chromium'
    service = Service('/usr/bin/chromedriver')
    
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.implicitly_wait(10)
    
    try:
        driver.get("http://localhost:5173/register")
        time.sleep(3) 
        
        try:
            username_input = driver.find_element(By.ID, "reg-username")
            email_input = driver.find_element(By.ID, "reg-email")
            password_input = driver.find_element(By.ID, "reg-password")
        except Exception as e:
            print(driver.page_source) 
            raise e
        
        username_input.send_keys("usuario_teste_selenium")
        email_input.send_keys("selenium@teste.com")
        password_input.send_keys("12345678")
        
        password_input.send_keys(Keys.ENTER)
        time.sleep(3)
        
        browser_logs = driver.get_log('browser')
        if browser_logs:
            for log in browser_logs:
                if log['level'] == 'SEVERE':
                    print(f"ERRO: {log['message']}")
                    
    finally:
        driver.quit()

if __name__ == "__main__":
    debug_frontend_errors()