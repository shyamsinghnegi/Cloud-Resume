# Cloud Resume - Shyam Negi

## Introduction

This project is a hands-on initiative designed to demonstrate proficiency in modern cloud technologies, DevOps practices, and full-stack development. It features a responsive resume website with a serverless backend for a visitor counter.

This project was originally built and deployed entirely on AWS. Due to account and billing issues, the entire application was successfully migrated to Microsoft Azure, demonstrating multi-cloud adaptability and cost management.

## Live Demo (Azure)

Explore the live website, now hosted on Azure Storage:
🔗 https://portfoliorga628.z29.web.core.windows.net/
(https://portfoliorga628.z29.web.core.windows.net/)

## ☁️ The Migration Story: AWS to Azure

This project's history demonstrates the ability to map services and migrate a full-stack application from AWS to Azure.

| Function | Original AWS Service | New Azure Service (Live) |
| :--- | :--- | :--- |
| **Frontend Host** | AWS S3 (Static Hosting) | Azure Blob Storage (Static Website) |
| **CDN** | AWS CloudFront | Azure CDN (Optional, not used) |
| **Backend Logic** | AWS Lambda (Python) | Azure Functions (Python, Consumption) |
| **API Endpoint** | Amazon API Gateway | Azure Function HTTP Trigger |
| **Database** | Amazon DynamoDB (NoSQL) | Azure Cosmos DB (NoSQL, Free Tier) |
| **IaC** | AWS SAM (template.yaml) | VS Code Azure Tools (for deployment) |
| **CI/CD** | GitHub Actions (for AWS) | GitHub Actions (for Azure, future) |

The original AWS infrastructure code (SAM template) and Lambda function are preserved in the repository for comparison.

## Key Features

* **Static Website Hosting:** My resume is hosted on Azure Blob Storage, configured for static website hosting.
* **Serverless Visitor Counter:**
    * **Azure Functions:** A Python function (Consumption Plan) handles the logic for incrementing and retrieving visitor counts.
    * **Azure Cosmos DB:** A NoSQL database (on the free tier) stores and manages the visitor count.
* **Infrastructure as Code (IaC):** The original backend infrastructure was defined using AWS SAM templates. This IaC is preserved in the repo, while the new Azure infrastructure is deployed via VS Code.
* **CI/CD Pipeline:** Automated deployments were handled via GitHub Actions for the AWS version, demonstrating CI/CD principles.
* **Modern Frontend:**
    * Clean, Apple-inspired design built with HTML5, CSS3, and JavaScript.
    * Dynamic typing animation for the hero tagline.
    * Interactive skill bars and progress indicators.
    * Smooth navigation with scroll effects and responsive design.
    * Parallax effect on the hero section for a dynamic visual experience.
    * Custom cursor and Konami Code easter egg for an enhanced user experience.

## Technologies Used

### Frontend
* **HTML5:** Structure of the web pages.
* **CSS3:** Styling with a modern, clean aesthetic.
* **JavaScript (ES6+):** Interactivity, animations, and API communication.
* **Font Awesome:** Icons for professional design.
* **Google Fonts:** SF Pro Display and SF Pro Text for Apple-like typography.

### Backend & Cloud (Live on Azure)
* **Azure Blob Storage:** Storage for static website assets.
* **Azure Functions:** Serverless compute for backend logic (Python).
* **Azure Cosmos DB:** NoSQL database for storing visitor data.

### Backend & Cloud (Original AWS Deployment)
* **AWS S3:** Storage for static website assets.
* **AWS CloudFront:** Content Delivery Network (CDN).
* **AWS Lambda:** Serverless compute for backend logic (Python).
* **Amazon API Gateway:** Manages API endpoints.
* **Amazon DynamoDB:** NoSQL database for storing visitor data.
* **AWS SAM (Serverless Application Model):** For defining serverless applications.

### DevOps
* **Git:** Version control.
* **GitHub Actions:** CI/CD pipeline for automated testing and deployment.

## Project Structure

(Based on the actual repository structure)
```bash
├── backend/
│   ├── AWS-Function-Code/      # Original AWS SAM project
│   │   ├── src/
│   │   ├── tests/
│   │   ├── template.yaml
│   │   └── ...
│   │
│   └── azure-function-code/    # New Azure Function project
│       ├── visitorCounter/
│       │   ├── __init__.py
│       │   └── function.json
│       ├── host.json
│       └── requirements.txt
│
├── frontend-infrastructure/    # IaC for original AWS frontend
│   ├── buildspec.yml
│   ├── deploy.sh
│   └── template.yaml
│
├── website/                    # The live frontend code
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── script.js           # (Ignored by .gitignore for security)
│   │   └── script.js.template  # (Safe-to-share version)
│   ├── .gitignore
│   └── index.html
│
└── README.md 
```
## Setup & Deployment (Azure Version)

This section describes how to deploy the new Azure version of this project.

### Prerequisites

* Azure Account (Free Tier)
* Visual Studio Code with the Azure Tools extension
* Python 3.x
* Git

### Backend Deployment (Serverless API)

1.  **Create Cosmos DB:** In the Azure portal, create an Azure Cosmos DB account (Core SQL, Provisioned throughput, Apply Free Tier Discount). Create a database (e.g., `resumeDB`) and a container (e.g., `views`) with a partition key of `/id`.
2.  **Get Cosmos DB Keys:** From the "Keys" blade, copy the `URI` and `PRIMARY KEY`.
3.  **Create Function App:** Create a Function App (Python, Consumption Plan).
4.  **Set Environment Variables:** In the Function App's "Configuration", add two Application Settings:
    * `COSMOS_ENDPOINT`: (Paste your URI)
    * `COSMOS_KEY`: (Paste your PRIMARY KEY)
5.  **Deploy Code:** Open the `backend/azure-function-code/` folder in VS Code. Right-click the folder and choose "Deploy to Function App...".
6.  **Get API URL:** After deployment, go to the function in the Azure portal and click "Get Function Url". Copy this URL.

### Frontend Deployment (Static Site)

1.  **Create Storage Account:** Create an Azure Storage Account.
2.  **Upgrade to v2 (if needed):** If the "Static website" option is missing, go to "Configuration" and upgrade the account to `General-purpose v2`. Set the Access Tier to `Hot`.
3.  **Enable Static Website:** Find "Static website" in the side menu, enable it, and set the index document to `index.html`.
4.  **Update script.js:**
    * Go to the `website/js/` directory.
    * Create a copy of `script.js.template` and name it `script.js`.
    * Paste your Function URL into the `API_URL` constant in the new `script.js`.
5.  **Set CORS:** Go to your Function App, find the "CORS" page, and add your Static Website's "Primary endpoint" URL to the list of allowed origins.
6.  **Upload Files:** Go to your Storage Account's `$web` container and upload the contents of your `website/` folder (i.e., `index.html`, the `css` folder, and the `js` folder).

## Challenges & Learning

### Original AWS Deployment
A key learning point during the initial AWS challenge involved troubleshooting MIME type issues (`text/html` being served instead of `text/javascript`) for the JavaScript file from CloudFront. This was resolved by implementing a dedicated CloudFront Response Headers Policy to explicitly override the `Content-Type` headers, reinforcing the importance of proper CDN configuration.

### Azure Migration
* **Storage Account Version:** Discovered that "Static website" hosting is only available on `General-purpose v2` accounts. This required upgrading the storage account from its default.
* **Function Deployment:** VS Code deployment requires a specific project structure, including a `host.json` file at the root, which was not immediately obvious.
* **API Key Security:** The Azure Function URL contains a `code` query parameter (its API key). This must not be committed to a public repository. This was solved by using a `.gitignore` to exclude the live `script.js` file and committing a `script.js.template` file for future use.

## Author

**Shyam Singh Negi**
* [LinkedIn](https://www.linkedin.com/in/shyam-singh-negi-5523awd1/)
* [GitHub](https://github.com/shyamsinghnegi)

---