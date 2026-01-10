# Fluent Progress

This is a Next.js application designed to help users track their English speaking practice. It's built with Next.js, ShadCN UI, Tailwind CSS, and Genkit for AI-powered features.

## Getting Started

Follow these instructions to get the project running on your local machine for development and testing purposes.

### Prerequisites

You will need to have [Node.js](https://nodejs.org/) (version 18 or later) and npm installed on your computer.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    Run the following command to install all the necessary packages for the project.
    ```bash
    npm install
    ```

### Running the Development Server

Once the installation is complete, you can start the local development server:

```bash
npm run dev
```

This will start the application, and you can view it in your browser at [http://localhost:9002](http://localhost:9002).

### Using AI Features (Text-to-Speech)

To use the "speak aloud" feature, you need a Gemini API key.

1.  Obtain a free API key from [Google AI Studio](https://aistudio.google.com/app/api-keys).
2.  Navigate to the "Settings" page within the running application.
3.  Paste your API key into the input field and click "Save". The application will test the key and save it to your browser's local storage.

## A Note on Performance

You might notice a slight delay the first time you navigate to a new page. This is expected behavior in Next.js. The framework pre-fetches the necessary data and code for the page in the background. While this might cause a small initial loading time, it makes subsequent visits to the same page much faster, resulting in a better overall user experience.
