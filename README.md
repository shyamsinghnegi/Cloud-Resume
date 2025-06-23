# Cloud Resume Challenge - Shyam Negi

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Website-brightgreen?style=for-the-badge&logo=vercel)](https://d2e8byfxayj514.cloudfront.net/)

## Introduction

This project is my implementation of the [Cloud Resume], a hands-on initiative designed to demonstrate proficiency in modern cloud technologies, DevOps practices, and full-stack development. It features a responsive resume website with a serverless backend for a visitor counter, deployed entirely on AWS.

## Live Demo

Explore the live website hosted on AWS CloudFront:
🔗 [https://d2e8byfxayj514.cloudfront.net/](https://d2e8byfxayj514.cloudfront.net/)

## Key Features

*   **Static Website Hosting:** My resume is hosted securely and efficiently on Amazon S3 and distributed globally via Amazon CloudFront for low latency and high availability.
*   **Serverless Visitor Counter:**
    *   **AWS Lambda:** A Python Lambda function handles the logic for incrementing and retrieving visitor counts.
    *   **Amazon API Gateway:** Exposes a RESTful API endpoint for the frontend to interact with the Lambda function.
    *   **Amazon DynamoDB:** A NoSQL database table stores and manages the visitor count persistency.
*   **Infrastructure as Code (IaC):** The backend infrastructure is defined and deployed using AWS Serverless Application Model (SAM) templates, ensuring repeatable and consistent deployments.
*   **CI/CD Pipeline:** Automated deployments are handled via GitHub Actions, which builds, tests, and deplolds both frontend and backend components upon code changes.
*   **Modern Frontend:**
    *   Clean, Apple-inspired design built with HTML5, CSS3, and JavaScript.
    *   Dynamic typing animation for the hero tagline.
    *   Interactive skill bars and progress indicators.
    *   Smooth navigation with scroll effects and responsive design.
    *   Parallax effect on the hero section for a dynamic visual experience.
    *   Custom cursor and Konami Code easter egg for an enhanced user experience.

## Technologies Used

### Frontend
*   **HTML5:** Structure of the web pages.
*   **CSS3:** Styling with a modern, clean aesthetic.
*   **JavaScript (ES6+):** Interactivity, animations, and API communication.
*   **Font Awesome:** Icons for professional design.
*   **Google Fonts:** SF Pro Display and SF Pro Text for Apple-like typography.

### Backend & Cloud
*   **AWS S3:** Storage for static website assets.
*   **AWS CloudFront:** Content Delivery Network (CDN) for fast, global delivery.
*   **AWS Lambda:** Serverless compute for backend logic (Python).
*   **Amazon API Gateway:** Manages API endpoints for the visitor counter.
*   **Amazon DynamoDB:** NoSQL database for storing visitor data.
*   **AWS SAM (Serverless Application Model):** For defining and deploying serverless applications.

### DevOps
*   **Git:** Version control.
*   **GitHub Actions:** CI/CD pipeline for automated testing and deployment.

## Project Structure

├──
├── index.html                  # Main resume webpage
├── css/
│   └── styles.css              # Main stylesheet for the resume
├── script.js                   # Main JavaScript file for frontend logic and API calls
└── README.md                   # This README file
└── backend/                    # (Conceptual - contains SAM template, Lambda code)
├── template.yaml           # AWS SAM template for backend infrastructure
└── visitor-counter/        # Lambda function directory
└── app.py              # Python Lambda function code
└── requirements.txt    # Python dependencies
└── tests/              # Unit tests for Lambda function
└── unit/
└── test_app.py

## Setup & Deployment

This project demonstrates a full CI/CD pipeline, so changes pushed to the main branch are automatically deployed. If you wish to deploy your own version:

### Prerequisites

*   AWS Account
*   AWS CLI configured
*   AWS SAM CLI installed
*   Node.js (for SAM CLI dependencies)
*   Python 3.x (for Lambda function)
*   Git

### Frontend Deployment (Static Site)

1.  **Upload Assets to S3:** Upload `index.html`, `css/styles.css`, and `script.js` to an S3 bucket configured for static website hosting.
2.  **Set Correct MIME Types in S3:**
    *   For `index.html`: `Content-Type: text/html`
    *   For `script.js`: `Content-Type: text/javascript`
    *   For `css/styles.css`: `Content-Type: text/css`
3.  **Configure CloudFront:** Create an AWS CloudFront distribution pointing to your S3 bucket.
4.  **Create Response Headers Policy in CloudFront:**
    *   In CloudFront, go to `Policies` -> `Response headers policies`.
    *   Create a new policy (e.g., `MyWebsiteMIMEPoliicy`).
    *   Add a `Custom Header`: `Header name: Content-Type`, `Value: text/javascript`, `Override: true`. Repeat for CSS and HTML if your S3 bucket is not reliably setting them.
    *   Attach this policy to your CloudFront distribution's cache behavior(s).
5.  **Invalidate CloudFront Cache:** After any changes, invalidate your CloudFront distribution cache (e.g., `/*`) to ensure the updated files and headers are served.

### Backend Deployment (Serverless API)

1.  **Clone the Repository:** Clone this repository to your local machine.
2.  **Navigate to Backend:** Change directory into the `backend/` folder.
3.  **Build SAM Application:**
    ```bash
    sam build
    ```
4.  **Deploy SAM Application:**
    ```bash
    sam deploy --guided
    ```
    Follow the prompts to configure your stack name, AWS region, and other parameters. This will deploy your Lambda function, API Gateway endpoint, and DynamoDB table.
5.  **Update Frontend API_URL:** Once deployed, update the `API_URL` constant in `script.js` with the new API Gateway endpoint URL.

## Challenges & Learning

A key learning point during this challenge involved troubleshooting MIME type issues (`text/html` being served instead of `text/javascript`) for the JavaScript file from CloudFront. This was resolved by:
1.  Ensuring correct MIME types were set in the S3 bucket metadata for all assets.
2.  Implementing a dedicated CloudFront Response Headers Policy to explicitly override and set the `Content-Type` headers for different file types (`.js`, `.css`, `.html`), ensuring browsers correctly interpret the content.
3.  Thorough cache invalidation on CloudFront and browser-level cache clearing.

This experience reinforced the importance of proper CDN and object storage configuration for web applications.

## Author

**Shyam Singh Negi**
*   [LinkedIn](https://www.linkedin.com/in/shyamsinghnegi)
*   [GitHub](https://github.com/shyamsinghnegi)

---