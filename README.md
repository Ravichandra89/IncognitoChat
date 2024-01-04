<<<<<<< HEAD
# Anonymous Chat Application

Welcome to the Anonymous Chat Application built using Next.js! This platform allows users to send feedback anonymously to any user on the platform.

## Features

- **Sign-Up**: New users can sign up with their email and username.
- **Sign-In**: Existing users can sign in to access their dashboard.
- **Verification Code**: Users receive a verification code to confirm their email address.
- **User Dashboard**: From the dashboard, users can send and receive anonymous messages.
- **Tech-Stack** :- NextJs, NextAuth, Resend-Mail, MongoDB, Shadcn Ui, Zod, TailwindCss,

## Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/Ravichandra89/Anonymous-Chat-Application.git
    ```

2. **Navigate to the project directory**:
    ```sh
    cd Anonymous-Chat-Application
    ```

3. **Install dependencies**:
    ```sh
    npm install
    ```

4. **Create a `.env` file in the root directory and add the necessary environment variables**:
    ```env
    NEXT_PUBLIC_API_URL=your_api_url
    MONGODB_URL=your_database_url
    RESEND_API_KEY=your_resend_url
    NEXTAUTH_SECRET=NextauthSecret
    ```

5. **Run the development server**:
    ```sh
    npm run dev
    ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Sign-Up

- Go to the Sign-Up page.
- Enter your email and desired username.
- Submit the form and check your email for a verification code.

### Sign-In

- Go to the Sign-In page.
- Enter your registered email and password.
- Access your user dashboard.

### Verification Code

- After signing up, you will receive a verification code in your email.
- Enter the code on the verification page to verify your account.

### User Dashboard

- Once signed in, you will be redirected to your user dashboard.
- From here, you can send anonymous messages to any user on the platform.
- View the messages you have received from other users.

## References

- **ChaiAurCode YouTube Channel by Hitesh Choudhry**: This project was inspired by and built with the help of tutorials from [ChaiAurCode](https://www.youtube.com/c/HiteshChoudharydotcom).
- **Next.js Documentation**: For detailed information on Next.js, visit the [Next.js documentation](https://nextjs.org/docs).
- **ShadCN UI Library**: This project uses the ShadCN UI library for UI components. Check out the [ShadCN UI documentation](https://ui.shadcn.com/docs).
- **Resend Mail **: This project uses the Resend Email Verification. Check Out the [Resend Docs](https://resend.com/nextjs).

## Contributing
Contributions are welcome! Please open an issue or submit a pull request with your improvements.

---

Made with ❤️ by [RAVI CHANDRA](https://github.com/Ravichandra89)

<img width="1710" alt="Screenshot 2024-07-25 at 12 52 46 PM" src="https://github.com/user-attachments/assets/6011748d-fb40-4142-b75a-2f46f7f6addc">
=======
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
>>>>>>> f774d97 (app init)
