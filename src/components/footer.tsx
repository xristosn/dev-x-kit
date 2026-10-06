import React from 'react';
import Link from 'next/link';
import { Container } from './container';

export const Footer: React.FC = () => (
  <footer
    className="w-full border-t border-border text-sm text-muted-foreground"
    data-testid="footer"
  >
    <Container className="sm:py-6 flex sm:flex-row gap-8 justify-between items-center w-full">
      <span>Dev X Kit &copy; {new Date().getFullYear()}</span>

      <div className="sm:text-center flex gap-6">
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/terms-of-use">Terms of use</Link>
      </div>

      <span className="sm:text-right">Made for the web</span>
    </Container>
  </footer>
);
