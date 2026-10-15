import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  code: string;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({
  username,
  code,
}) => {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f9fafb", fontFamily: "sans-serif" }}>
        <Container style={{ margin: "40px auto", padding: "20px", maxWidth: "560px", background: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
          <Heading style={{ color: "#111827", fontSize: "24px" }}>
            Welcome to Unsaid, {username}!
          </Heading>
          <Text style={{ color: "#4b5563", fontSize: "16px" }}>
            Please use the following verification code to confirm your email address and activate your anonymous feedback portal:
          </Text>
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <span style={{ fontSize: "32px", fontWeight: "bold", letterSpacing: "6px", padding: "12px 24px", background: "#f3f4f6", borderRadius: "6px", display: "inline-block" }}>
              {code}
            </span>
          </Section>
          <Text style={{ color: "#6b7280", fontSize: "14px" }}>
            This code expires in 10 minutes. If you didn't create an Unsaid account, you can safely ignore this email.
          </Text>
          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />
          <Text style={{ color: "#9ca3af", fontSize: "12px", textAlign: "center" }}>
            Unsaid — Honest perspectives without the awkwardness.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;
