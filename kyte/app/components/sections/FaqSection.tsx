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
          No. You only need <strong>any 2 fragments out of 3</strong> (with
          Freemium subscription), plus your passphrase. This gives you multiple
          recovery paths.
        </p>
      </div>
    ),
  },
  {
    id: 2,
    question: "What cryptographic technologies does Kyte use?",
    answer: (
      <div className="space-y-3">
        <p>Kyte uses industry-standard, battle-tested encryption:</p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li>
            <strong>AES-256-GCM</strong> for encrypting your seed phrase with
            authenticated encryption, ensuring both confidentiality and
            integrity
          </li>
          <li>
            <strong>PBKDF2-SHA512</strong> with 100,000 iterations to derive
            strong encryption keys from your passphrase, protecting against
            brute-force attacks
          </li>
          <li>
            <strong>Shamir Secret Sharing (2-of-3)</strong> to split encrypted
            data into fragments, where any 2 fragments can reconstruct the
            original but 1 fragment alone reveals nothing
          </li>
        </ul>
        <p>
          These are the same cryptographic primitives used by banks, password
          managers, and major crypto wallets. Kyte&apos;s code is open source,
          allowing security experts to verify our implementation.
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
          A fragment is just one piece of a puzzle—it&apos;s completely useless
          without either another fragment or your passphrase. You can safely
          print it as a QR code and give it to a trusted family member or
          friend. They can&apos;t access your crypto with just one fragment.
        </p>
        <p>
          Think of it like giving someone half of a treasure map—they need the
          other half to find anything.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    question: "Why use cloud storage instead of blockchain?",
    answer: (
      <div className="space-y-3">
        <p>
          While blockchain seems crypto-native, it creates permanent public
          exposure. Once data is on-chain, it&apos;s visible forever—even when
          encrypted.
        </p>
        <p>Cloud storage offers:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>
            <strong>Better privacy</strong> (you can delete it)
          </li>
          <li>
            <strong>Zero cost</strong> (no gas fees)
          </li>
          <li>
            <strong>Simplicity</strong> (no wallet needed)
          </li>
        </ul>
        <p>
          Your fragment is encrypted, so even if someone accesses your cloud,
          they can&apos;t use it without your passphrase (if you used one) and
          another fragment.
        </p>
      </div>
    ),
  },
  {
    id: 5,
    question: "Is my seed phrase ever stored in plaintext anywhere?",
    answer: (
      <div className="space-y-3">
        <p>
          No. Your seed is always encrypted with AES-256 before being split into
          fragments. Even when fragments are recombined, the result is still
          encrypted data that requires your passphrase to decrypt (if you used
          one).
        </p>
        <p>
          Fragment C in your cloud is encrypted, Fragment B on paper is a Shamir
          share (not the actual seed), and Fragment A is derived from your
          passphrase each time—never stored anywhere.
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
