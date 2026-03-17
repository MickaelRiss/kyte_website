import FadeInView from "../FadeInView";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const faqContent = [
  {
    id: 1,
    question: "Do I need all three fragments to recover my seed?",
    answer: (
      <div className="space-y-3">
        <p>
          No. You only need <strong>any 2 fragments out of 3</strong> (default
          Community configuration). Guardian users with custom M-of-N configs
          need their configured threshold. If you encrypted with a passphrase
          (Guardian), you&apos;ll also need that.
        </p>
      </div>
    ),
  },
  {
    id: 2,
    question: "What cryptographic technologies does Kyte use?",
    answer: (
      <div className="space-y-3">
        <p>Kyte uses industry-standard, battle-tested cryptography:</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>Shamir Secret Sharing</strong> to split your seed into
            fragments, where any K fragments out of N can reconstruct the
            original but fewer reveals nothing.
          </li>
          <li>
            <strong>AES-256-GCM</strong> (Guardian with passphrase) for
            authenticated encryption, ensuring both confidentiality and
            integrity before splitting
          </li>
          <li>
            <strong>PBKDF2-SHA512</strong> with 210,000 iterations (OWASP 2023)
            to derive strong encryption keys from your passphrase, protecting
            against brute-force attacks
          </li>
        </ul>
        <p>
          Community tier uses Shamir splitting alone, no passphrase required.
          These are the same cryptographic primitives used by banks, password
          managers, and major crypto wallets.
        </p>
      </div>
    ),
  },
  {
    id: 3,
    question:
      "How do I give my fragment to someone without compromising security?",
    answer: (
      <div className="space-y-3">
        <p>
          A single fragment reveals absolutely nothing about your seed phrase.
          This is the information-theoretic security guarantee of Shamir&apos;s
          Secret Sharing. You can safely print it as a QR code and give it to a
          trusted family member or friend. They can&apos;t access your crypto
          with just one fragment, no matter how much computing power they have.
        </p>
        <p>
          Think of it like giving someone half of a treasure map, they need the
          other half to find anything.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    question: "Is my seed phrase ever stored in plaintext anywhere?",
    answer: (
      <div className="space-y-3">
        <p>
          No. With <strong>Community tier</strong>, your seed is split using
          Shamir&apos;s Secret Sharing, no plaintext seed is ever stored. Each
          fragment on its own is meaningless.
        </p>
        <p>
          With <strong>Guardian tier</strong>, your seed is first encrypted with
          AES-256-GCM using your passphrase, then split into fragments. When
          recombining, you&apos;ll need both the required fragments and your
          passphrase to recover the original seed.
        </p>
      </div>
    ),
  },
  {
    id: 5,
    question: "What happens if I lose my passphrase?",
    answer: (
      <div className="space-y-3">
        <p>
          If you used <strong>Guardian mode</strong> with a passphrase, your
          seed was encrypted with AES-256-GCM before being split. Without the
          passphrase, the fragments alone cannot recover your seed.{" "}
          <strong>There is no passphrase reset or recovery mechanism.</strong>
        </p>
        <p>
          Store your passphrase safely and separately from your fragments. If
          you used <strong>Community mode</strong> (no passphrase), this does
          not apply, you only need the required number of fragments.
        </p>
      </div>
    ),
  },
  {
    id: 6,
    question: "Does Kyte need an internet connection?",
    answer: (
      <div className="space-y-3">
        <p>
          No. All encryption, splitting, and recovery operations run{" "}
          <strong>entirely locally on your machine</strong>. No seed or fragment
          data ever leaves your device. Kyte follows a zero-knowledge
          architecture. We never see your keys, your seed phrase, or your
          fragments.
        </p>
        <p>
          The only feature that uses the internet is{" "}
          <strong>Telegram Recovery Alerts</strong> (Guardian only), which sends
          a notification when your seed is recovered. Even then, no seed data is
          transmitted, only the recovery event metadata (IP-based location and
          timestamp).
        </p>
      </div>
    ),
  },
  {
    id: 7,
    question: "What seed phrases does Kyte support?",
    answer: (
      <div className="space-y-3">
        <p>
          Kyte supports standard <strong>BIP39</strong> seed phrases of{" "}
          <strong>12, 15, 18, 21, or 24 words</strong> from the English
          wordlist. Your seed is validated against the BIP39 checksum before any
          operation. Invalid seeds are rejected immediately.
        </p>
        <p>
          Kyte also normalizes your input automatically: extra spaces are
          trimmed and uppercase letters are converted to lowercase. You
          don&apos;t need to clean up your input manually.
        </p>
      </div>
    ),
  },
  {
    id: 8,
    question: "Can I accidentally mix fragments from different seeds?",
    answer: (
      <div className="space-y-3">
        <p>
          No. Each set of fragments gets a <strong>unique backup ID</strong>{" "}
          embedded at encryption time. If you accidentally mix fragments from
          two different encryption runs, Kyte detects the mismatch and rejects
          the combination. You&apos;ll be prompted to use fragments from the
          same backup.
        </p>
      </div>
    ),
  },
  {
    id: 9,
    question: "What happens after I recover my seed?",
    answer: (
      <div className="space-y-3">
        <p>
          Your recovered seed phrase is displayed on screen and{" "}
          <strong>automatically cleared after 30 seconds</strong> as a security
          precaution. Make sure you are ready to use or store it before starting
          recovery. This limits the window of exposure if you step away from
          your screen.
        </p>
      </div>
    ),
  },
];

export default function FaqSection() {
  return (
    <section
      className="mt-28 mb-30 max-w-5xl mx-auto lg:px-0 pt-24 px-6"
      id="support"
    >
      <FadeInView delay={0.1}>
        <h2 className="text-4xl font-bold text-center">
          Frequently Asked Questions
        </h2>
      </FadeInView>

      <FadeInView delay={0.2}>
        <div>
          <Accordion
            type="single"
            collapsible
            defaultValue="Do I need all three fragments to recover my seed?"
            className="max-w-2xl mx-auto mt-10 bg-card/60 border border-border p-8 rounded-xl"
          >
            {faqContent.map((question) => (
              <AccordionItem key={question.id} value={question.question}>
                <AccordionTrigger className="text-md cursor-pointer">
                  {question.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80">
                  {question.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </FadeInView>
    </section>
  );
}
