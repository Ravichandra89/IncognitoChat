import {
  Html,
  Head,
  Font,
  Heading,
  Preview,
  Row,
  Text,
  Section,
  Button,
} from "@react-email/components";
import { HtmlContext } from "next/dist/server/future/route-modules/app-page/vendored/contexts/entrypoints";

interface VerificationProps {
  username: string;
  otp: string;
}

export default function EmailVerification({
  username,
  otp,
}: VerificationProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Here&apos;s your verification code : {otp}</Preview>
      <Section>
        <Row>
          <Heading>Hello {username}</Heading>
        </Row>

        <Row>
          <Text>
            Thank you for registering. Please use the following verification
            code to complete your registration:
          </Text>
        </Row>

        {/* Show Here the OTP  */}
        <Row>
          <Text>{otp}</Text>
        </Row>

        <Row>
          <Text>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
