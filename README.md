SploreAI is an AI-powered social media analytics platform that provides actionable insights to help businesses optimize their social media performance. Built using Langflow, DataStax Astra DB, and GPT, it enables users to analyze engagement data through interactive chats, visual dashboards, and comprehensive PDF reports.

🚀 Project Overview
This project was developed as part of the Supermind Hackathon to solve the challenge of transforming raw social media data into meaningful insights. SploreAI helps users:
Identify top-performing posts
Conduct sentiment analysis
Predict engagement trends
Generate data-driven strategies

🛠️ Tech Stack
Langflow – To create a workflow for GPT agent interactions
DataStax Astra DB – For storing and querying social media engagement data
OpenAI GPT – For generating insights and recommendations

🧩 Key Features
SploreAI delivers a seamless user experience through:

✅ Interactive Chatbot: Ask questions about your best-performing posts, strategies, sentiment analysis, engagement predictions, and more.<br/>
✅ Visual Dashboards: Get instant insights displayed as clear, interactive charts and graphs.<br/>
✅ Comprehensive PDF Reports: Download detailed reports featuring key metrics and actionable insights.<br/>
✅ File Uploads: Enhance your analysis by uploading CSV files of competitor data or historical performance.<br/>

⚙️ Setup Instructions
Follow these steps to run SploreAI locally:

1️⃣ Clone the Repository
git clone https://github.com/Sarang9975/supermind_hackathon.git  
cd supermind_hackathon  
cd langflow_client

2️⃣ Install Dependencies
npm install  

3️⃣ Run the Project
npm start  

4️⃣ Setup and Start the Server
cd server  
npm install  
node server.js  

5️⃣ Start the Python Server for PDF Generation
cd pdfserver  
python script.py  

📄 How It Works
Data Storage: Social media data is stored in DataStax Astra DB.
Langflow Workflow: The workflow queries the database and passes data to the GPT agent.
Insight Generation: GPT processes the data to deliver actionable insights in chat, dashboard, or PDF format.

📊 Sample Insights
"Carousel posts have 20% higher engagement than static posts."
"Reels drive 2x more comments compared to other formats."


