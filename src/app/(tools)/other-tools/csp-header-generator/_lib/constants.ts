import { Code2, FileInput, Link2, Palette, Shield, Upload } from 'lucide-react';
import type { DirectiveCategory, DirectiveName, ServicePreset } from './types';

export const RISKY_SOURCES = new Set(['unsafe-inline', 'unsafe-eval']);

export const DIRECTIVE_ORDER: DirectiveName[] = [
  'default-src',
  'script-src',
  'script-src-elem',
  'script-src-attr',
  'style-src',
  'style-src-elem',
  'style-src-attr',
  'img-src',
  'media-src',
  'font-src',
  'connect-src',
  'frame-src',
  'frame-ancestors',
  'base-uri',
  'form-action',
  'object-src',
  'worker-src',
  'child-src',
  'manifest-src',
  'upgrade-insecure-requests',
  'block-all-mixed-content',
  'plugin-types',
  'referrer',
  'report-uri',
  'report-to',
  'require-trusted-types-for',
];

export const DIRECTIVE_CATEGORIES: DirectiveCategory[] = [
  {
    id: 'general',
    label: 'General & Fallback',
    icon: Shield,
    description: 'Default behavior and catch-all rules',
    directives: ['default-src'],
  },
  {
    id: 'scripts',
    label: 'Scripts',
    icon: Code2,
    description: 'JavaScript execution and loading rules',
    directives: ['script-src', 'script-src-elem', 'script-src-attr'],
  },
  {
    id: 'styles',
    label: 'Styles',
    icon: Palette,
    description: 'CSS and styling source rules',
    directives: ['style-src', 'style-src-elem', 'style-src-attr'],
  },
  {
    id: 'media',
    label: 'Media & Assets',
    icon: Upload,
    description: 'Images, audio, video, and font loading',
    directives: ['img-src', 'media-src', 'font-src'],
  },
  {
    id: 'navigation',
    label: 'Navigation & Connections',
    icon: Link2,
    description: 'API calls, embeds, and form submissions',
    directives: ['connect-src', 'frame-src', 'frame-ancestors', 'base-uri', 'form-action'],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: FileInput,
    description: 'Plugins, workers, mixed content, and reporting',
    directives: [
      'object-src',
      'worker-src',
      'child-src',
      'manifest-src',
      'upgrade-insecure-requests',
      'block-all-mixed-content',
      'plugin-types',
      'referrer',
      'report-uri',
      'report-to',
      'require-trusted-types-for',
    ],
  },
];

export const DIRECTIVE_INFO: Record<DirectiveName, { label: string; description: string }> = {
  'default-src': {
    label: 'default-src',
    description:
      'The catch-all fallback. Applies when no other specific directive matches. Always define this first, it sets the baseline policy for all content types not explicitly covered.',
  },
  'script-src': {
    label: 'script-src',
    description:
      'Controls where JavaScript can be loaded from, including <script> tags, event handlers (onclick, onload), and the eval() family of functions. Use script-src-elem and script-src-attr for finer control.',
  },
  'script-src-elem': {
    label: 'script-src-elem',
    description:
      'Narrower than script-src only controls <script> elements and <script> blocks in HTML. Does not affect inline event handlers or eval(). Overrides script-src for script elements when both are present.',
  },
  'script-src-attr': {
    label: 'script-src-attr',
    description:
      'Controls inline JavaScript in attribute handlers like onclick="...", onload="...", onerror="...". This is a common source of CSP violations, consider using event delegation instead.',
  },
  'style-src': {
    label: 'style-src',
    description:
      'Controls where stylesheets can be loaded from, including <link rel="stylesheet"> tags and <style> blocks. Also affects CSS font-face rules in some browsers.',
  },
  'style-src-elem': {
    label: 'style-src-elem',
    description:
      'Narrower than style-src, only controls <style> tags and <link rel="stylesheet"> elements. Does not affect style="..." attributes. Overrides style-src for style elements when both are present.',
  },
  'style-src-attr': {
    label: 'style-src-attr',
    description:
      'Controls inline style attributes like style="color: red;". Rarely needed, most styling should come from external stylesheets.',
  },
  'img-src': {
    label: 'img-src',
    description:
      'Controls where images, favicons, and SVGs can be loaded from. Applies to <img>, <svg>, <link rel="icon">, and CSS background-image rules.',
  },
  'media-src': {
    label: 'media-src',
    description:
      'Controls where <audio> and <video> elements can load media from. Does not affect WebRTC (use connect-src for that).',
  },
  'font-src': {
    label: 'font-src',
    description:
      'Controls where web fonts can be loaded from. Applies to @font-face rules in CSS and font imports. Many font CDNs require both font-src and their CSS domain in style-src.',
  },
  'connect-src': {
    label: 'connect-src',
    description:
      'Controls where the page can make network requests via fetch(), XMLHttpRequest, WebSocket, and EventSource. This is one of the most commonly customized directives for SPAs.',
  },
  'frame-src': {
    label: 'frame-src',
    description:
      'Controls where <iframe>, <frame>, and <frame> elements can load content from. Also affects nested browsing contexts like web workers in some browsers.',
  },
  'frame-ancestors': {
    label: 'frame-ancestors',
    description:
      "Controls which origins are allowed to embed your page in an <iframe>, <frame>, <object>, or <embed>. Use 'none' to completely prevent embedding, or 'self' to allow only your own domain.",
  },
  'base-uri': {
    label: 'base-uri',
    description:
      "Restricts the URL that can be used in a <base> element. Prevents attackers from redirecting all relative URLs in your page. Use 'self' to allow only your own domain.",
  },
  'form-action': {
    label: 'form-action',
    description:
      "Controls where <form> elements can submit data. Use 'self' to allow only same-origin submissions, or list specific endpoints like https://api.example.com.",
  },
  'object-src': {
    label: 'object-src',
    description:
      "Controls where <object>, <embed>, and <applet> elements can load. Best practice is to use 'none'. These plugins are largely obsolete and a common attack vector.",
  },
  'worker-src': {
    label: 'worker-src',
    description:
      'Controls where web workers and shared workers can be loaded from. Also affects Blob URLs and Service Workers in some browsers.',
  },
  'child-src': {
    label: 'child-src',
    description:
      'Legacy alias for frame-src. Most browsers treat child-src the same as frame-src. Prefer using frame-src for clarity.',
  },
  'manifest-src': {
    label: 'manifest-src',
    description:
      'Controls where web app manifests (manifest.json) can be loaded from. Applies to <link rel="manifest"> tags.',
  },
  'upgrade-insecure-requests': {
    label: 'upgrade-insecure-requests',
    description:
      'Automatically upgrades all HTTP requests to HTTPS. Use this on HTTPS sites that still reference HTTP resources. No value needed, just include the directive name.',
  },
  'block-all-mixed-content': {
    label: 'block-all-mixed-content',
    description:
      'Blocks all mixed content (HTTP resources loaded on an HTTPS page). Stricter than upgrade-insecure-requests, it blocks resources like HTTP images, not just scripts.',
  },
  'plugin-types': {
    label: 'plugin-types',
    description:
      'Restricts the MIME types allowed in <object> elements. For example, you can limit to application/pdf to only allow PDF plugins.',
  },
  referrer: {
    label: 'referrer',
    description:
      'Controls how much referrer information is sent with requests. Options: no-referrer, origin, origin-when-cross-origin, strict-origin-when-cross-origin, unsafe-url.',
  },
  'report-uri': {
    label: 'report-uri',
    description:
      'Specifies a URL to send CSP violation reports to. When a policy is violated, the browser sends a POST request with JSON details. Deprecated in favor of report-to.',
  },
  'report-to': {
    label: 'report-to',
    description:
      'Specifies the Report-To group name for CSP violation reports. More flexible than report-uri, allows grouping multiple endpoints and configuring TTL.',
  },
  'require-trusted-types-for': {
    label: 'require-trusted-types-for',
    description:
      'Requires Trusted Types to prevent DOM-based XSS. When set, dangerous sinks like innerHTML, eval(), and setTimeout(string) only accept TrustedType objects instead of plain strings.',
  },
};

export const SERVICE_PRESETS: ServicePreset[] = [
  {
    id: 'google-fonts',
    name: 'Google Fonts',
    icon: '🔤',
    description: 'Loads fonts from Google Fonts API and CDN',
    tags: ['fonts', 'css', 'google'],
    directives: {
      'style-src': ["'self'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
    },
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    icon: '📊',
    description: 'Google Analytics 4, Google Tag Manager, and Google Ads',
    tags: ['analytics', 'tracking', 'google', 'ads'],
    directives: {
      'script-src-elem': ['https://www.googletagmanager.com'],
      'img-src': [
        "'self'",
        'https://*.google-analytics.com',
        'https://www.googletagmanager.com',
        'https://*.g.doubleclick.net',
        'https://*.google.com',
      ],
      'connect-src': [
        "'self'",
        'https://*.google-analytics.com',
        'https://*.analytics.google.com',
        'https://www.googletagmanager.com',
        'https://*.g.doubleclick.net',
        'https://*.google.com',
      ],
      'frame-src': ['https://www.googletagmanager.com'],
    },
  },
  {
    id: 'youtube',
    name: 'YouTube Embed',
    icon: '▶️',
    description: 'YouTube video embeds and the YouTube Iframe API',
    tags: ['video', 'embed', 'google'],
    directives: {
      'frame-src': ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com'],
      'img-src': ["'self'", 'https://i.ytimg.com'],
      'script-src': ["'self'", 'https://www.youtube.com'],
    },
  },
  {
    id: 'stripe',
    name: 'Stripe',
    icon: '💳',
    description: 'Stripe.js payment processing and elements',
    tags: ['payment', 'checkout', 'billing'],
    directives: {
      'script-src': ["'self'", 'https://js.stripe.com'],
      'frame-src': ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
      'connect-src': ["'self'", 'https://api.stripe.com', 'https://js.stripe.com'],
    },
  },
  {
    id: 'cloudflare-turnstile',
    name: 'Cloudflare Turnstile',
    icon: '☁️',
    description: 'Cloudflare CAPTCHA replacement widget',
    tags: ['captcha', 'bot', 'security', 'cloudflare'],
    directives: {
      'script-src': ["'self'", 'https://challenges.cloudflare.com'],
      'frame-src': ["'self'", 'https://challenges.cloudflare.com'],
    },
  },
  {
    id: 'intercom',
    name: 'Intercom',
    icon: '💬',
    description: 'Intercom customer messaging and chat widget',
    tags: ['chat', 'support', 'messaging'],
    directives: {
      'script-src': ["'self'", 'https://static.intercomcdn.com', 'https://api.intercom.io'],
      'style-src': ["'self'", 'https://static.intercomcdn.com'],
      'img-src': ["'self'", 'https://static.intercomcdn.com'],
      'connect-src': ["'self'", 'https://api.intercom.io', 'wss://ws.intercom.io'],
      'frame-src': ["'self'", 'https://www.intercom.io'],
      'font-src': ["'self'", 'https://static.intercomcdn.com'],
    },
  },
  {
    id: 'vercel-analytics',
    name: 'Vercel Analytics',
    icon: '▲',
    description: 'Vercel web analytics tracking',
    tags: ['analytics', 'tracking', 'vercel'],
    directives: {
      'script-src-elem': ['https://vercel.com'],
      'img-src': ["'self'", 'https://vz-traffic-content.vercel.app'],
      'connect-src': ["'self'", 'https://vz-media-data-collect.vercel.app'],
    },
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    icon: '🗺️',
    description: 'Google Maps JavaScript API and embeds',
    tags: ['maps', 'location', 'google'],
    directives: {
      'script-src': ["'self'", 'https://maps.googleapis.com', 'https://maps.gstatic.com'],
      'style-src': ["'self'", 'https://fonts.googleapis.com'],
      'img-src': ["'self'", 'https://*.googleapis.com', 'https://*.google.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'connect-src': ["'self'", 'https://*.googleapis.com', 'https://www.google.com'],
      'frame-src': ["'self'", 'https://www.google.com'],
    },
  },
  {
    id: 'google-recaptcha',
    name: 'Google reCAPTCHA',
    icon: '🤖',
    description: 'Google reCAPTCHA v2 and v3',
    tags: ['captcha', 'bot', 'google'],
    directives: {
      'script-src': ["'self'", 'https://www.google.com/recaptcha/', 'https://recaptcha.google.com'],
      'frame-src': ["'self'", 'https://www.google.com/recaptcha/', 'https://recaptcha.google.com'],
      'img-src': ["'self'", 'https://www.google.com/recaptcha/'],
    },
  },
  {
    id: 'cloudflare-analytics',
    name: 'Cloudflare Web Analytics',
    icon: '📈',
    description: 'Cloudflare web analytics script',
    tags: ['analytics', 'tracking', 'cloudflare'],
    directives: {
      'script-src': ["'self'", 'https://static.cloudflareinsights.com'],
    },
  },
  {
    id: 'twilio-video',
    name: 'Twilio Video',
    icon: '📹',
    description: 'Twilio Programmable Video SDK',
    tags: ['video', 'webRTC', 'communication'],
    directives: {
      'script-src': ["'self'", 'https://static.twilio.com'],
      'connect-src': ["'self'", 'wss://*.twilio.com', 'https://*.twilio.com'],
      'media-src': ['https:'],
    },
  },
  {
    id: 'google-chat',
    name: 'Google Chat / Meet',
    icon: '💬',
    description: 'Google Chat and Google Meet embeds',
    tags: ['video', 'chat', 'google', 'meet'],
    directives: {
      'frame-src': ["'self'", 'https://meet.google.com', 'https://chat.google.com'],
      'script-src': ["'self'", 'https://www.gstatic.com'],
      'style-src': ["'self'", 'https://www.gstatic.com'],
      'img-src': ["'self'", 'https://*.googleusercontent.com'],
      'connect-src': ["'self'", 'https://*.googleapis.com'],
    },
  },
];
