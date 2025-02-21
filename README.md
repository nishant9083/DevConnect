# DevConnect

## Overview

DevConnect is a web application designed to connect developers based on their GitHub profiles and location. The application fetches developer data from GitHub and displays nearby developers in a user-friendly interface. Users can view developer profiles, including their GitHub repositories, followers, and other relevant information.

## Features

- **Nearby Developers**: Displays developers near the user's location based on GitHub data.
- **Developer Profiles**: Detailed profiles with GitHub data, including repositories, followers, and bio.
- **Infinite Scrolling**: Automatically loads more developers as the user scrolls down.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Superset of JavaScript that adds static types.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **GitHub API**: Fetches developer data from GitHub.
- **OpenCage Data API**: Geocoding service to convert coordinates into readable locations.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/nishant9083/devconnect.git
    cd devconnect
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Create a `.env.local` file in the root directory and add your API keys:

    ```env
    NEXT_PUBLIC_OPENCAGE_API_KEY=your_opencage_api_key
    ```

### Running the Application

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Project Structure

```plaintext
devconnect/
├── components/          # React components
│   ├── ui/              # UI components
│   ├── nearby-developers.tsx
│   └── ...other components...
├── lib/                 # Utility functions and libraries
│   ├── github.ts        # GitHub API functions
│   └── ...other libraries...
├── pages/               # Next.js pages
│   ├── api/             # API routes
│   ├── _app.tsx         # Custom App component
│   └── index.tsx        # Home page
├── public/              # Static assets
├── styles/              # Global styles
│   ├── globals.css
│   └── ...other styles...
├── .env.local           # Environment variables
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GitHub API](https://docs.github.com/en/rest)
- [OpenCage Data API](https://opencagedata.com/)

## Contact

For any inquiries or feedback, please contact [nishantverma040@gmail.com](mailto:nishantverma040@gmail.com).
