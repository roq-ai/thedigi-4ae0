const mapping: Record<string, string> = {
  analytics: 'analytics',
  companies: 'company',
  'custom-fields': 'custom_field',
  privacies: 'privacy',
  'social-medias': 'social_media',
  themes: 'theme',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
