from playwright.sync_api import Page, expect, sync_playwright
import os

def test_homepage_content(page: Page):
    # Go to the homepage
    page.goto("http://localhost:4321/")

    # Wait for the page to load
    page.wait_for_selector("h1")

    # Check Hero section
    hero_title = page.locator("h1")
    expect(hero_title).to_contain_text("Kontrola systému vytápění")
    expect(hero_title).to_contain_text("vyhlášky 38/2022 Sb.")

    hero_p = page.locator("section >> p").first
    expect(hero_p).to_contain_text("Ing. Petra Nováka")
    expect(hero_p).to_contain_text("20 %")

    # Check About section
    about_section = page.locator("#about")
    expect(about_section).to_contain_text("Ing. Petr Novák")
    expect(about_section).to_contain_text("IČO 48873314")
    # Check for team images restoration
    team_images = about_section.locator("img[alt='Ing. Petr Novák'], img[alt='Člen týmu']")
    assert team_images.count() >= 2, f"Expected at least 2 team images, found {team_images.count()}"

    # Check Pricing section
    pricing_section = page.locator("#pricing")
    expect(pricing_section).to_contain_text("Kolik stojí odborná kontrola")
    expect(pricing_section).to_contain_text("úspor až 20 %")

    # Full page screenshot
    page.screenshot(path="/home/jules/verification/updated_full.png", full_page=True)

if __name__ == "__main__":
    os.makedirs("/home/jules/verification", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_homepage_content(page)
            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            # Take a screenshot even on failure to help debug
            page.screenshot(path="/home/jules/verification/failed_state.png")
        finally:
            browser.close()
