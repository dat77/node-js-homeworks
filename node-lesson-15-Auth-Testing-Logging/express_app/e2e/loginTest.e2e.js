const { Builder, By, until, logging } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

describe("E2E Test for Login Page with Network Profiling", () => {
  let driver;

  beforeAll(async () => {
    const options = new chrome.Options();
    const prefs = new logging.Preferences();
    prefs.setLevel(logging.Type.PERFORMANCE, logging.Level.ALL);
    options.setLoggingPrefs(prefs);

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
    await driver.get("http://localhost:4200/auth/login");
  });

  afterAll(async () => {
    await driver.quit();
  });

  const captureNetworkLogs = async () => {
    const logs = await driver.manage().logs().get(logging.Type.PERFORMANCE);
    return logs
      .map((entry) => JSON.parse(entry.message).message)
      .filter((msg) => msg.method && msg.method.includes("Network."));
  };

  it("should display the login page and profile network requests", async () => {
    const usernameInput = await driver.wait(
      until.elementLocated(By.id("login")),
      5000,
    );
    const passwordInput = await driver.findElement(By.id("password"));
    const submitButton = await driver.findElement(
      By.css("button[type='submit']"),
    );

    expect(await usernameInput.isDisplayed()).toBe(true);
    expect(await passwordInput.isDisplayed()).toBe(true);
    expect(await submitButton.isDisplayed()).toBe(true);

    await usernameInput.sendKeys("testuser");
    await passwordInput.sendKeys("password123");
    await submitButton.click();

    const networkLogs = await captureNetworkLogs();
    console.log("Network Logs:", networkLogs);

    const loginRequest = networkLogs.find(
      (log) =>
        log.method === "Network.requestWillBeSent" &&
        log.params.request.url.includes("/auth/login"),
    );
    expect(loginRequest).toBeDefined();
    console.log("Login Request:", loginRequest);
  });
});
