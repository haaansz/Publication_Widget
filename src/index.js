// SAC Custom Widget: Schedule Publication API Integration
// This widget uses OAuth 2.0 with SAML Bearer Assertion to authenticate with SAC API

const template = document.createElement("template");
template.innerHTML = `
  <style>
    .widget-container {
      font-family: Arial, sans-serif;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background: white;
    }
    button {
      padding: 10px;
      background-color: #007aff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background-color: #005bb5;
    }
  </style>
  <div class="widget-container">
    <h3>Schedule Report</h3>
    <button id="schedule-btn">Schedule Publication</button>
    <p id="status"></p>
  </div>
`;

class SACPublicationWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.scheduleBtn = this.shadowRoot.getElementById("schedule-btn");
    this.statusText = this.shadowRoot.getElementById("status");
  }

  connectedCallback() {
    this.scheduleBtn.addEventListener("click", () => this.schedulePublication());
  }

  async getAccessToken() {
    const tokenUrl = "https://your-auth-server/oauth/token"; // Replace with your SAC OAuth endpoint
    const clientId = "your-client-id";
    const clientSecret = "your-client-secret";
    const samlAssertion = "your-saml-assertion"; // This needs to be dynamically retrieved
    
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:saml2-bearer",
        assertion: samlAssertion,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to obtain access token");
    }
    
    const data = await response.json();
    return data.access_token;
  }

  async schedulePublication() {
    try {
      const token = await this.getAccessToken();
      const scheduleApiUrl = "https://your-sac-instance/api/v1/schedule-publications"; // Replace with actual API endpoint
      
      const response = await fetch(scheduleApiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Automated Report",
          recurrence: "ONCE",
          format: "PDF",
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to schedule publication");
      }
      
      this.statusText.textContent = "Publication scheduled successfully!";
    } catch (error) {
      this.statusText.textContent = `Error: ${error.message}`;
    }
  }
}

customElements.define("sac-publication-widget", SACPublicationWidget);

// Export for use in other files
export default SACPublicationWidget;
