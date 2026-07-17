export default {
  name: 'example-company-policy',
  version: '1.0.0',
  exporters: {
    company: ({ project }) => ({
      '.design-frontier/generated/company-policy.txt': `Project: ${project.name}\nAccessibility: ${project.accessibility}\n`
    })
  },
  validators: [({ project }) => {
    if (!project.locales.includes('en')) return [{
      code: 'EXAMPLE001',
      severity: 'warning',
      message: 'The example policy recommends an English locale for shared support operations.'
    }];
  }]
};
