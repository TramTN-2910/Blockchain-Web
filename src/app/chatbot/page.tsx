'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatbotRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page where the floating chatbot widget is available
    router.replace('/');
  }, [router]);

  return null;
}
