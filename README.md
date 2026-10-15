# UNSAID — Anonymous Feedback. Honest Perspectives.

A modern, full-stack anonymous feedback platform where users create contextual feedback requests, share unique links, and receive sincere, constructive advice without knowing who submitted each response.

---

## 🚀 Key Features

- **Architectural Anonymity:** The database model strictly omits any sender identity or IP mapping (`Feedback` schema has no `senderId`).
- **Contextual Feedback Requests:** Users can create specific topics (e.g., *"Placement Preparation"*, *"Portfolio Review"*, *"Communication"*) with custom questions instead of generic forms.
- **AI-Powered Feedback Suggestions:** Integrated OpenAI API provides constructive prompt starters to help respondents write meaningful feedback.
- **Visual Analytics:** Interactive Recharts dashboard visualizing category distributions and weekly feedback trends.
- **Secure Authentication:** Auth.js (NextAuth v5) with bcrypt password hashing and 6-digit email OTP verification via Resend.
- **Anti-Abuse Controls:** IP rate limiting, message length bounds, and global / per-request feedback acceptance toggles.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Sonner
- **Backend:** Next.js Server Actions & REST API Route Handlers
- **Database & ODM:** MongoDB Atlas + Mongoose
- **Authentication:** Auth.js (NextAuth.js v5)
- **Validation:** Zod + React Hook Form
- **Email:** Resend + React Email
- **AI:** OpenAI API (`gpt-4o-mini`)
- **Charts:** Recharts

---

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/utkarsharma12/Unsaid-Anonymous-feedback.git
cd Unsaid-Anonymous-feedback
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory (refer to `.env.example`):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/unsaid?retryWrites=true&w=majority
AUTH_SECRET=your_super_secret_auth_key
NEXTAUTH_URL=http://localhost:3000
RESEND_API_KEY=re_your_api_key
OPENAI_API_KEY=sk-your_openai_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ License
MIT License. Created as a Final Year Engineering Project.
