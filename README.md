# AI Tasks and Goals Manager

### Full-stack application designed to assist users align tasks with predefined goals, thereby boosting productivity and goal achievement.

> (*Web application under development*)

> [Check out a short demo video of the app!](https://go.screenpal.com/watch/cZh62tVLfXn)

<br/>

## Technologies and Features
### Frontend:
- Developed using **TypeScript**, **React**, **Redux** Toolkit and **CSS** for styling.
### Backend:
- **API and Database**: Built with Node.js, TypeScript, Express.js and Axios, along with PostgreSQL database, and using Prisma to interact with the database.
- **User Authentication**: JWT authentication with Node.js and password hashing with bcrypt.
- **LLM**: integrated GPT-4 model from OpenAI. Structured approach using Zod and Langchain to support consistency of the results and ensure compatibility between the AI-generated data and the database.
### Testing: 
- **Unit Testing**: Vitest and React Testing Library *(under development)*.
- **End-to-End and Component Testing**: Cypress *(under development)*.

<br/>

### Features:

- **CRUD operations**:  Users can easily create, view, edit and delete tasks and goals. 
    - **Tasks**: Each tasks includes a description, priority level (Low, Moderate or High), deadline, progress state ("To do", "In progress" or "Completed") and a category. 
    - **Goals**: Each goal includes a description, a category and associated month. 
    - **Categories**: Options include Career, Personal Development, Leisure, Family and Friends, Financial, Health and Wellness.

- **Dashboard**: 
    - **User interface**: A user-friendly interface where users can manage tasks and goals and track their progress.

- **Open AI model**:
    - **Purpose**: Integrated GPT-4 model from OpenAI to evaluate users’ progress and alignment with goals. 
    - **Monthly analysis**: Evaluates tasks and goals within a specific month. Compares tasks and goals within the same category, taking into account task priority, progress and overall contribution to achieving the related goals. 
    - **Insights and Tagging**: (results of the analysis)
        - Each goal is tagged as "Needs improvement", "In Progress" or "Achieved".
        - A brief overview of the monthly progress is provided, as well as suggestions to enhance productivity.


<br/>

Here are some screenshots of the web application to illustrate some of its features:

![Dashboard_Tasks](https://github.com/fatimampg/ai-tasks-goals/assets/142017021/09ddb190-8b8e-4f51-8e96-cbbe1e08c1dc)

![Dashboard_Results](https://github.com/fatimampg/ai-tasks-goals/assets/142017021/d1e18ee7-9442-4141-8116-7e733fdcd982)