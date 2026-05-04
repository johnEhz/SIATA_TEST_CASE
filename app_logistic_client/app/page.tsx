import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>SIATA Logistics Portal</h1>
      <p>Deployment - Root Page</p>
      <a href="/auth/login" style={{ color: "blue", textDecoration: "underline" }}>Go to Login</a>
    </div>
  );
}

