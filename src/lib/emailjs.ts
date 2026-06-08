import emailjs from '@emailjs/browser';

// 👇 Replace these with YOUR values from EmailJS dashboard
const SERVICE_ID = 'service_xxxxxxx';      // Step 2 se mila
const CONTACT_TEMPLATE = 'template_xxxxxxx'; // Step 3 se mila (contact)
const NEWSLETTER_TEMPLATE = 'template_yyyyyyy'; // Step 3 se mila (newsletter)
const PUBLIC_KEY = 'abcdefghijklmnopqrstuvwxyz'; // Step 4 se mila

// Contact Form Email
export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  try {
    const result = await emailjs.send(
      SERVICE_ID,
      CONTACT_TEMPLATE,
      {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        to_email: 'info@solarcrane.com', // 👈 YOUR email
      },
      PUBLIC_KEY
    );
    return { success: true, result };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { success: false, error };
  }
}

// Newsletter Subscription Email
export async function sendNewsletterEmail(email: string) {
  try {
    const result = await emailjs.send(
      SERVICE_ID,
      NEWSLETTER_TEMPLATE,
      {
        to_email: email,
        subscribe_date: new Date().toLocaleDateString(),
      },
      PUBLIC_KEY
    );
    return { success: true, result };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { success: false, error };
  }
}

// Custom Solution Request Email
export async function sendCustomSolutionEmail(data: {
  name: string;
  email: string;
  phone: string;
  category: string;
  project: string;
  requirements: string;
  budget: string;
  timeline: string;
}) {
  try {
    const result = await emailjs.send(
      SERVICE_ID,
      CONTACT_TEMPLATE,
      {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        subject: `Custom Solution: ${data.category} - ${data.project}`,
        message: `
Category: ${data.category}
Project: ${data.project}
Budget: ${data.budget}
Timeline: ${data.timeline}

Requirements:
 ${data.requirements}
        `,
        to_email: 'info@solarcrane.com',
      },
      PUBLIC_KEY
    );
    return { success: true, result };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { success: false, error };
  }
}
