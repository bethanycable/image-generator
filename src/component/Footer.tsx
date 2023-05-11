import PrimaryLink from "./PrimaryLink";

function Footer () {
  return (
    <footer className="dark:bg-gray-800">
      <div className="mx-auto grid h-12 grid-cols-3 items-center bg-gray-900 text-center">
        <PrimaryLink href="/">BookCoverGenerator.com</PrimaryLink>
        <PrimaryLink href="/privacy-policy">Privacy Policy</PrimaryLink>
        <PrimaryLink href="/terms-of-service">Terms of Service</PrimaryLink>
      </div>
    </footer>
  );
}

export default Footer;
